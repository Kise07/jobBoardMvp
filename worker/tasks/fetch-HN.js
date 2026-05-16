import { createClient } from 'redis';

const HN_ITEM_ID = '43243024';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

async function fetchHNJobs() {
  const client = createClient({ url: REDIS_URL });
  client.on('error', (err) => console.error('Redis error:', err));
  await client.connect();

  const res = await fetch(`https://hn.algolia.com/api/v1/items/${HN_ITEM_ID}`);
  const thread = await res.json();

  const allJobs = (thread.children || [])
    .filter(c => c.text && !c.deleted && !c.dead)
    .map(c => parseJob(c.text, c.id))
    .filter(isValidJob);

  console.log('got', allJobs.length, 'valid job posts');

  // Optional: Filter for junior-friendly roles
  const jrJobs = allJobs.filter(job => {
    const role = (job.role || '').toLowerCase();
    const raw = (job.raw || '').toLowerCase();
    const combined = `${role} ${raw}`;

    const excludeTerms = [
      'senior', 'sr.', ' sr ', 'staff', 'principal',
      'lead', 'tech lead', 'team lead',
      'manager', 'engineering manager',
      'director', 'vp of', 'vice president',
      'head of', 'chief', 'cto', 'ceo', 'coo',
      'architect', 'distinguished',
    ];
    if (excludeTerms.some(t => combined.includes(t))) return false;
    if (excludeTerms.some(t => raw.includes(t))) return false;

    const includeTerms = [
      'junior', 'jr.', 'jr ',
      'entry', 'entry-level', 'entry level',
      'associate', 'new grad', 'graduate',
      'intern', 'internship',
      'early career', '0-2', '1-2', '0-3',
    ];
    if (includeTerms.some(t => combined.includes(t))) return true;

    return true;
  });

  console.log('filtered down to', jrJobs.length, 'junior-friendly jobs');

  // Store individual jobs
  for (const job of jrJobs) {
    await client.set(
      `job:${job.id}`,
      JSON.stringify(job),
      { EX: 60 * 60 * 24 } // 24-hour TTL
    );
  }

  // Use correct key name that API expects
  await client.set(
    `hn:${HN_ITEM_ID}:jobIds`,
    JSON.stringify(jrJobs.map(j => j.id)),
    { EX: 60 * 60 * 24 }
  );

  console.log('stored', jrJobs.length, 'jobs in Redis');
  console.log({ success: jrJobs.length > 0 ? 'OK' : 'EMPTY' });

  await client.disconnect();
  return jrJobs;
}

// PARSE HELPER
function parseJob(html, id) {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x2F;/g, '/')
    .replace(/&#x27;/g, "'")
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

  const parts = text.split('|').map(s => s.trim());

  // FIX 1: bare domains now caught (loop.com, mintlify.com, www.x.co)
  const looksLikeUrl = /^https?:\/\/|^www\.|\.com\b|\.ai\b|\.co\b|\.io\b|\.dev\b/i;

  // FIX 2: "Fully Remote", "US & Global", citizenship lines now skipped
  const skipPart = /^(full.?time|part.?time|fully.?remote|remote|onsite|hybrid|contract|intern|multiple|various|equity|us\s*&\s*global|citizenship|https?:\/\/)/i;

  // FIX 3: expanded city/region list + "In person in X" phrase
  const looksLikeLocation = /^in person\s+in\b|\b(NYC|SF|Boston|London|Berlin|Paris|Stockholm|Munich|Amsterdam|Barcelona|Vienna|Dubai|Singapore|Seattle|Austin|Denver|Chicago|Mumbai|Hyderabad|Prague|Malaysia|India|Germany|France|Australia|Canada|Europe|timezone|US only|EU only|San Francisco|New York|Mountain View|Palo Alto|Los Angeles|New England|San Diego|Boulder|Pittsburgh|Toronto|Vancouver)\b|\b[A-Z]{2},\s*[A-Z]{2}\b/i;

  const looksLikeSalary = /^\$|^\d+[kK]|\d+k\s*\+/i;
  const looksLikeNoise = /^[√✓✗×•\-–—]|^hiring:/i;

  let company = null;
  let role = null;
  let location = null;

  for (const p of parts) {
    if (!company) {
      if (
        p.split(' ').length <= 6 &&
        !looksLikeUrl.test(p) &&
        !skipPart.test(p) &&
        !looksLikeSalary.test(p) &&
        !looksLikeLocation.test(p) &&
        !looksLikeNoise.test(p)
      ) company = p;
      continue;
    }
    if (!role) {
      if (
        !looksLikeUrl.test(p) &&
        !skipPart.test(p) &&
        !looksLikeSalary.test(p) &&
        !looksLikeLocation.test(p) &&
        !looksLikeNoise.test(p) &&
        p.length <= 80
      ) role = p;
      continue;
    }
    if (!location) {
      if (
        !looksLikeUrl.test(p) &&
        !skipPart.test(p) &&
        !looksLikeSalary.test(p) &&
        p.length <= 80
      ) location = p;
      break;
    }
  }

  const remote = /remote|work from home|wfh/i.test(text);

  const salaryMatch = text.match(
    /\$\s*(\d{2,3})[kK](?:\s*[-–]\s*\$?\s*(\d{2,3})[kK])?|\$\s*(\d{3,})\s*(?!M|B|T|[kK]?\s*(million|billion|trillion|ARR|raise|raised|funding|revenue|valuation))/i
  );
  const salary = salaryMatch ? salaryMatch[0].trim() : null;

  return {
    id,
    company,
    role,
    location,
    remote,
    visa: /visa/i.test(text),
    salary,
    tags: extractTags(text),
    raw: text.slice(0, 400),
    url: `https://news.ycombinator.com/item?id=${id}`,
  };
}

// VALIDITY CHECK HELPER
function isValidJob(job) {
  if (!job.company || !job.role) return false;
  if (job.company.split(' ').length > 6) return false;
  if (job.role.length > 80) return false;
  if (job.company[0] === job.company[0].toLowerCase()) return false;

  const nonDevRoles = [
    'physician', 'doctor', 'transcrib', 'sales development',
    'growth market', 'recruiter', 'legal', 'accountant',
    'implementation manager', 'customer success',
    'business development', 'bdr', 'sales rep',
  ];
  const roleRaw = `${job.role} ${job.raw}`.toLowerCase();
  if (nonDevRoles.some(t => roleRaw.includes(t))) return false;

  return true;
}

// TAG EXTRACTION HELPER
function extractTags(text) {
  const known = [
    // languages
    'JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'Ruby',
    'Java', 'C++', 'Swift', 'Kotlin', 'Elixir', 'Haskell', 'Scala',
    'PHP', 'Dart',
    // frontend
    'React', 'Vue', 'Angular', 'Next.js', 'Svelte', 'WebGL',
    // backend
    'Node', 'GraphQL', 'REST', 'PostgreSQL', 'MySQL', 'MongoDB',
    'Redis', 'Kafka', 'Django', 'Rails', 'Laravel', 'FastAPI',
    // infra
    'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform',
    'Linux', 'CI/CD', 'Serverless',
    // web3
    'Solana', 'Ethereum', 'Web3', 'Blockchain',
    // work style
    'Remote', 'Onsite', 'Hybrid', 'Fullstack', 'Frontend', 'Backend',
  ];

  return known
    .filter(t => {
      const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(text);
    });
}

fetchHNJobs();
export default fetchHNJobs;
