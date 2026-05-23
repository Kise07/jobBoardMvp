import express from 'express';
import { createClient } from 'redis';
import cors from 'cors';
import * as dotenv from 'dotenv';
import job from '../worker/index.js'; // Start cron job

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv.config({ path: envFile });
// Fallback to .env if .env.local doesn't exist
if (envFile !== '.env') {
  dotenv.config({ path: '.env', override: false });
}

const app = express();
const port = process.env.PORT || 8080;

console.log('Starting Hacker News Jobs cron job...');
console.log(`Using Redis: ${process.env.REDIS_URL?.substring(0, 50)}...`);

// cors middleware
app.use(cors());

// Create and connect client
const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Handle connection events
client.on('error', (err) => {
  console.error('Redis Client Error', err);
  if (err.code === 'ECONNREFUSED') {
    console.error('⚠️  Redis connection failed. Check REDIS_URL environment variable.');
  }
});
client.on('connect', () => console.log('✅ Redis Connected'));

await client.connect();
console.log('✅ Connected to Redis at', process.env.REDIS_URL?.substring(0, 50) + '...');

// API Routes
app.get('/jobs', async (req, res) => {
  try {
    console.log('Fetching jobs...');
    
    // Get the job IDs index
    const jobIds = await client.get('hn:43243024:jobIds');

    if (!jobIds) {
      console.warn('No job IDs index found');
      return res.status(404).send({ error: "No jobs data found. Try running: node worker/tasks/fetch-HN.js" });
    }

    const ids = JSON.parse(jobIds);
    console.log(`Found ${ids.length} job IDs`);

    // Fetch individual jobs
    const jobData = await Promise.all(
      ids.map(id => client.get(`job:${id}`))
    );

    // Filter out null values and parse valid jobs
    const jobs = jobData
      .filter(j => j !== null && j !== undefined)
      .map((j, idx) => {
        try {
          return JSON.parse(j);
        } catch (parseErr) {
          console.error(`Error parsing job at index ${idx}:`, parseErr.message);
          return null;
        }
      })
      .filter(j => j !== null);

    console.log(`Returning ${jobs.length} jobs (out of ${ids.length} total)`);
    res.send(jobs);
  } catch (error) {
    console.error('Error in /jobs endpoint:', error);
    res.status(500).send({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.send({ status: 'OK' });
});

// Manual trigger to fetch jobs (admin endpoint for testing)
app.post('/admin/fetch-jobs', async (req, res) => {
  try {
    console.log('Manual job fetch triggered...');
    // Manually trigger the cron job's onTick function and wait for it
    const result = await job.fireOnTick();
    res.send({ success: true, message: 'Jobs fetch completed', result });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  console.log(`Jobs will be fetched daily at midnight Pacific Time`);
});
