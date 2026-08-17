# Job Board MVP

A full-stack job board that aggregates junior-friendly job listings from Hacker News "Who is hiring?" threads, updated daily.

**Live:** [jobboard.yean.me](https://jobboard.yean.me/)

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion)
- **Backend:** Node.js, Express 5
- **Database:** Redis (Upstash)
- **Cron:** Daily at midnight PT
- **Deploy:** Vercel (frontend), Render (backend)

## Quick Start

```bash
# Backend
npm install
npm run dev          # http://localhost:8080

# Frontend (new terminal)
cd client-next
npm install
npm run dev          # http://localhost:3000

# Seed data
npm run worker:run
```

## API Endpoints

| Method | Route       | Description              |
| ------ | ----------- | ------------------------ |
| GET    | `/jobs`     | Returns all job listings |
| GET    | `/health`   | Health check             |

## Project Structure

```
jobBoardMvp/
├── api/            # Express server
├── client-next/    # Next.js frontend
├── worker/         # Cron job + job fetcher
└── package.json
```

## How It Works

1. **Worker** fetches HN thread daily via Algolia API, parses comments into structured job objects (company, role, location, tags, and salary when disclosed)
2. **API** serves jobs from Redis with 24h TTL, rate-limited to 100 req/15min
3. **Frontend** uses Next.js Server Components to fetch jobs server-side, eliminating client-side API calls

## Environment Variables

| Variable       | Description      | Local                        | Production                              |
| -------------- | ---------------- | ---------------------------- | --------------------------------------- |
| `REDIS_URL`    | Redis connection | `redis://localhost:6379`     | Upstash `rediss://` URL                 |
| `HN_THREAD_ID` | HN thread ID     | `49156683`                   | `49156683`                              |
| `PORT`         | Server port      | `8080`                       | `10000` (Render)                        |

## License

MIT

---

[Built by Kise](https://github.com/Kise07) | [LinkedIn](https://linkedin.com/in/kise07)
