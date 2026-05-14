import { createClient } from 'redis';

const HN_ITEM_ID = '43243024';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

async function fetchHNJobs() {
  const client = createClient({ url: REDIS_URL });

  client.on('error', (err) => console.error('Redis error:', err));
  await client.connect();

  const res = await fetch(`https://hn.algolia.com/api/v1/items/${HN_ITEM_ID}`);
  const thread = await res.json();

  const jobs = (thread.children || [])
    .filter(c => c.text && !c.deleted && !c.dead)
    .map(c => parseJob(c.text, c.id));

  console.log('got', jobs.length, 'jobs - storing in Redis....');

  // Store each job individually by ID
  for (const job of jobs) {
    await client.set(
      `job:${job.id}`,
      JSON.stringify(job),
      { EX: 60 * 60 * 24 } // expire after 24 hours
    );
  }

  // Also store the full list as an index
  await client.set(
    `hn:${HN_ITEM_ID}:jobIds`,
    JSON.stringify(jobs.map(j => j.id)),
    { EX: 60 * 60 * 24 }
  );

  console.log('stored', jobs.length, 'jobs in Redis');

  await client.disconnect();
  return jobs;
}

function parseJob(html, id) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').trim();
  const parts = text.split('|').map(s => s.trim());

  return {
    id,
    company: parts[0] || null,
    role: parts[1] || null,
    location: parts[2] || null,
    remote: /remote/i.test(text),
    salary: text.match(/\$[\d,]+[kK]?(?:\s*[--]\s*\$[\d,]+[kK]?)?/)?.[0] || null,
    tags: extractTags(text),
    raw: text.slice(0, 300),
    url: `https://news.ycombinator.com/item?id=${id}`,
  };
}

function extractTags(text) {
  const known = ['React', 'TypeScript', 'Node', 'Python', 'Rust', 'Go', 'Solana', 'Web3', 'Fullstack', 'Frontend', 'Backend', 'Remote', 'Onsite', 'Hybrid'];
  return known.filter(t => new RegExp(t, 'i').test(text));
}

fetchHNJobs();
export default fetchHNJobs;
