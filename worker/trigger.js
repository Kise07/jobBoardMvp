import { config } from 'dotenv';
import fetchHNJobs from './tasks/fetch-HN.js';

const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
config({ path: envFile });
if (envFile !== '.env') {
  config({ path: '.env', override: false });
}

async function run() {
  console.log('Starting manual job fetch...');
  try {
    const jobs = await fetchHNJobs();
    console.log(`Successfully fetched and stored ${jobs.length} jobs.`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    process.exit(1);
  }
}

run();
