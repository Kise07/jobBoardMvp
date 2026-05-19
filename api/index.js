import express from 'express';
import { createClient } from 'redis';
import cors from 'cors';
import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

const app = express();
const port = 8080;

// cors middleware
app.use(cors());

// Create and connect client
const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Handle connection events
client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Connected'));

await client.connect();

app.get('/jobs', async (req, res) => {
  try {
    // Get the job IDs index
    const jobIds = await client.get('hn:43243024:jobIds');

    if (!jobIds) {
      return res.status(404).send({ error: "No jobs data found" });
    }

    const ids = JSON.parse(jobIds);

    // Fetch individual jobs
    const jobs = await Promise.all(
      ids.map(id => client.get(`job:${id}`))
    );

    console.log(jobs.length);
    res.send(jobs.map(j => JSON.parse(j)));
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
