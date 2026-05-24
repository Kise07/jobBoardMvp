// worker/fetch-hn-jobs.js
import { createClient } from 'redis';

const HN_ITEM_ID = '43243024';

async function fetchHNJobs() {
  const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
  const client = createClient({ url: REDIS_URL });
  client.on('error', (err) => console.error('Redis error:', err));
  await client.connect();

  const res = await fetch(`https://hn.algolia.com/api/v1/items/${HN_ITEM_ID}`);
  const thread = await res.json();

  const jobs = (thread.children || [])
    .filter(c => c.text && !c.deleted && !c.dead)
    .map(c => parseJob(c.text, c.id))
    .filter(isValidJob);

  console.log(`Parsed ${jobs.length} valid jobs`);

  // Store each job individually
  for (const job of jobs) {
    await client.set(`job:${job.id}`, JSON.stringify(job), { EX: 60 * 60 * 24 });
  }

  // Store the index of all job IDs
  await client.set(
    `hn:${HN_ITEM_ID}:jobIds`,
    JSON.stringify(jobs.map(j => j.id)),
    { EX: 60 * 60 * 24 }
  );

  console.log(`Stored ${jobs.length} jobs in Redis`);
  await client.disconnect();
  return jobs;
}

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

  const looksLikeUrl = /^https?:\/\/|^www\.|\.com\b|\.ai\b|\.co\b|\.io\b|\.dev\b/i;
  const skipPart = /^(full.?time|part.?time|fully.?remote|remote|onsite|hybrid|contract|intern|multiple|various|equity|us\s*&\s*global|citizenship|https?:\/\/)/i;
  const looksLikeLocation = /^in person\s+in\b|\b(NYC|SF|Boston|London|Berlin|Paris|Stockholm|Munich|Amsterdam|Barcelona|Vienna|Dubai|Singapore|Seattle|Austin|Denver|Chicago|Mumbai|Hyderabad|Prague|Malaysia|India|Germany|France|Australia|Canada|Europe|timezone|US only|EU only|San Francisco|New York|Mountain View|Palo Alto|Los Angeles|New England|San Diego|Boulder|Pittsburgh|Toronto|Vancouver)\b|\b[A-Z]{2},\s*[A-Z]{2}\b/i;
  const looksLikeSalary = /^\$|^\d+[kK]|\d+k\s*\+/i;
  const looksLikeNoise = /^[√✓✗×•\-–—]|^hiring:/i;

  let company = null;
  let role = null;
  let location = null;

  for (const p of parts) {
    if (!company) {
      if (p.split(' ').length <= 6 && !looksLikeUrl.test(p) && !skipPart.test(p) && !looksLikeSalary.test(p) && !looksLikeLocation.test(p) && !looksLikeNoise.test(p))
        company = p;
      continue;
    }
    if (!role) {
      if (!looksLikeUrl.test(p) && !skipPart.test(p) && !looksLikeSalary.test(p) && !looksLikeLocation.test(p) && !looksLikeNoise.test(p) && p.length <= 80)
        role = p;
      continue;
    }
    if (!location) {
      if (!looksLikeUrl.test(p) && !skipPart.test(p) && !looksLikeSalary.test(p) && p.length <= 80)
        location = p;
      break;
    }
  }

  const salaryMatch = text.match(
    /\$\s*(\d{2,3})[kK](?:\s*[-–]\s*\$?\s*(\d{2,3})[kK])?|\$\s*(\d{3,})\s*(?!M|B|T|[kK]?\s*(million|billion|trillion|ARR|raise|raised|funding|revenue|valuation))/i
  );

  return {
    id,
    company,
    role,
    location,
    remote: /remote|work from home|wfh/i.test(text),
    visa: /visa/i.test(text),
    salary: salaryMatch ? salaryMatch[0].trim() : null,
    tags: extractTags(text),
    raw: text.slice(0, 400),
    url: `https://news.ycombinator.com/item?id=${id}`,
  };
}

function isValidJob(job) {
  if (!job.company || !job.role) return false;
  if (job.company.split(' ').length > 6) return false;
  if (job.role.length > 80) return false;
  if (job.company[0] === job.company[0].toLowerCase()) return false;
  return true;
}

function extractTags(text) {
  const known = [
    'JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'Ruby',
    'Java', 'C\\+\\+', 'Swift', 'Kotlin', 'Elixir', 'Haskell', 'Scala', 'PHP', 'Dart',
    'React', 'Vue', 'Angular', 'Next\\.js', 'Svelte', 'WebGL',
    'Node', 'GraphQL', 'REST', 'PostgreSQL', 'MySQL', 'MongoDB',
    'Redis', 'Kafka', 'Django', 'Rails', 'Laravel', 'FastAPI',
    'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'Serverless',
    'Solana', 'Ethereum', 'Web3', 'Blockchain',
    'Remote', 'Onsite', 'Hybrid', 'Fullstack', 'Frontend', 'Backend',
  ];

  return known
    .filter(t => new RegExp(`\\b${t}\\b`, 'i').test(text))
    .map(t => t.replace(/\\\+/g, '+').replace(/\\\./g, '.'));
}

export default fetchHNJobs;
