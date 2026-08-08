# Job Board MVP

A full-stack job board that aggregates 190+ job listings from Hacker News "Who is hiring?" threads, updated daily.

**Live:** [jobboard.yean.me](https://jobboard.yean.me/)

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** Redis (Upstash)
- **Cron:** node-cron (daily at midnight PT)
- **Deploy:** Vercel (frontend), Render (backend)

## Quick Start

```bash
# Backend
npm install
npm run dev          # http://localhost:8080

# Frontend (new terminal)
cd client
npm install
npm run dev          # http://localhost:5173

# Seed data
npm run worker:run
```

## API Endpoints

| Method | Route               | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/jobs`             | Returns all job listings |
| GET    | `/health`           | Health check             |
| POST   | `/admin/fetch-jobs` | Trigger manual job fetch |

## Project Structure

```
jobBoardMvp/
├── api/            # Express server
├── client/         # React frontend
├── worker/         # Cron job + job fetcher
└── package.json
```

## How It Works

1. **Worker** fetches HN thread daily via Algolia API, parses comments into structured job objects (company, role, location, salary, tags)
2. **API** serves jobs from Redis with 24h TTL
3. **Frontend** fetches on mount, auto-retries every 3s if backend is down

## Environment Variables

| Variable       | Description      | Local                        | Production                              |
| -------------- | ---------------- | ---------------------------- | --------------------------------------- |
| `REDIS_URL`    | Redis connection | `redis://localhost:6379`     | Upstash `rediss://` URL                 |
| `HN_THREAD_ID` | HN thread ID     | `49156683`                   | `49156683`                              |
| `PORT`         | Server port      | `8080`                       | `10000` (Render)                        |
| `VITE_API_URL` | Backend URL      | `http://localhost:8080/jobs` | `https://jobboardmvp.onrender.com/jobs` |

## License

MIT

---

[Built by Kise](https://github.com/Kise07) | [LinkedIn](https://linkedin.com/in/kise07)
