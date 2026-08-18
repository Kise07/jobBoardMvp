import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import { createClient } from "redis";

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.local";
dotenv.config({ path: envFile });
// Fallback to .env if .env.local doesn't exist
if (envFile !== ".env") {
  dotenv.config({ path: ".env", override: false });
}

const app = express();
const port = process.env.PORT || 8080;

console.log("Starting Hacker News Jobs cron job...");
console.log(`Using Redis: ${process.env.REDIS_URL?.substring(0, 50)}...`);

// cors middleware
app.use(
  cors({
    origin: [
      "https://job-board-mvp-f4n8.vercel.app", // Production (Vercel)
      "http://localhost:3000", // Local dev (Next.js)
      "http://localhost:3001", // Local dev (alternate port)
    ],
  }),
);

const jobsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

app.use("/jobs", jobsLimiter);

// Create and connect client
const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Handle connection events
client.on("error", (err) => {
  console.error("Redis Client Error", err);
  if (err.code === "ECONNREFUSED") {
    console.error(
      "⚠️  Redis connection failed. Check REDIS_URL environment variable.",
    );
  }
});

client.on("connect", () => console.log("✅ Redis Connected"));

await client.connect();
console.log(
  "✅ Connected to Redis at",
  process.env.REDIS_URL?.substring(0, 50) + "...",
);

// API Routes
app.get("/jobs", async (req, res) => {
  const threadId = process.env.HN_THREAD_ID;

  try {
    console.log("Fetching jobs...");

    // Get the job IDs index
    const jobIds = await client.get(`hn:${threadId}:jobIds`);

    if (!jobIds) {
      console.warn("No job IDs index found");
      return res.status(404).send({
        error: "No jobs data found. Try running: node worker/tasks/fetch-HN.js",
      });
    }

    const ids = JSON.parse(jobIds);
    console.log(`Found ${ids.length} job IDs`);

    // Fetch individual jobs
    const jobData = await Promise.all(ids.map((id) => client.get(`job:${id}`)));

    // Filter out null values and parse valid jobs
    const jobs = jobData
      .filter((j) => j !== null && j !== undefined)
      .map((j, idx) => {
        try {
          return JSON.parse(j);
        } catch (parseErr) {
          console.error(`Error parsing job at index ${idx}:`, parseErr.message);
          return null;
        }
      })
      .filter((j) => j !== null);

    console.log(`Returning ${jobs.length} jobs (out of ${ids.length} total)`);
    res.send(jobs);
  } catch (error) {
    console.error("Error in /jobs endpoint:", error);
    res.status(500).send({ error: error.message });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.send({ status: "OK" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  console.log(`Jobs will be fetched daily at midnight Pacific Time`);
});
