import express from 'express';
import { createClient } from 'redis';
import cors from 'cors';
import * as dotenv from 'dotenv';
import job from '../worker/index.js'; // Start cron job

// Load .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

console.log('Starting Hacker News Jobs cron job...');

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

app.get('/jobs', async (req, res) => {
  try {
    // Get the job IDs index
    const jobIds = await client.get('hn:43243024:jobIds');

    if (!jobIds) {
      return res.status(404).send({ error: "No jobs data found. Try running: node worker/tasks/fetch-HN.js" });
    }

    const ids = JSON.parse(jobIds);

    // Fetch individual jobs
    const jobs = await Promise.all(
      ids.map(id => client.get(`job:${id}`))
    );

    console.log(`Returning ${jobs.length} jobs`);
    res.send(jobs.map(j => JSON.parse(j)));
  } catch (error) {
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
    // Manually trigger the cron job's onTick function
    job.fireOnTick();
    res.send({ success: true, message: 'Jobs fetch triggered' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  console.log(`Jobs will be fetched daily at midnight Pacific Time`);
});
