# Job Board MVP

A full-stack web application that displays junior-friendly job listings from Hacker News, updated daily.

## 🌍 Live Demo

**Frontend:** https://job-board-mvp-mauve.vercel.app/

**Backend API:** https://jobboardmvp-production.up.railway.app/jobs

## ✨ Features

- 75+ job listings updated daily
- Automatic filtering for junior/entry-level roles
- Real-time caching with Redis
- Responsive UI with React + Tailwind CSS
- RESTful API with Node.js/Express

## 🛠️ Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS
**Backend:** Node.js, Express, Redis
**Deployment:** Vercel (frontend), Railway (backend + database)

## 🚀 Quick Start

### Local Development

**Backend:**
```bash
npm install
npm run dev
# http://localhost:8080
```

**Frontend:**
```bash
cd client
npm install
npm run dev
# http://localhost:5173
```

## 📚 API

```
GET /jobs          # Get all 75 jobs
GET /health        # Health check
POST /admin/fetch-jobs  # Trigger job fetch
```

## 📁 Project Structure

```
jobBoardMvp/
├── api/            # Express backend
├── client/         # React frontend
├── worker/         # Cron job scheduler
└── package.json
```

## 🔄 How It Works

1. **Daily at midnight PT** - Cron job fetches from Hacker News API
2. **Parses & filters** - Extracts junior-friendly job posts
3. **Stores in Redis** - Caches for 24 hours
4. **Frontend displays** - React app fetches from backend, shows jobs

## 📊 Stats

- **Build time:** ~3 minutes
- **API response:** <100ms
- **Jobs cached:** 75
- **Update frequency:** Daily

## 🤝 Contributing

Pull requests welcome!

---

Made with ❤️ for junior developers
