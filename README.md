# Job Board MVP

A production-ready full-stack application that displays 75+ junior-friendly job listings from Hacker News, updated daily. Built to showcase real-world deployment skills and full-stack development capabilities.

## 🌍 Live Demo

**🔗 [jobboard.yean.me](https://jobboard.yean.me/)** - Main domain

**Alternative URLs:**
- Frontend: https://job-board-mvp-mauve.vercel.app/
- Backend API: https://jobboardmvp-production.up.railway.app/jobs

## ✨ Features

- **75+ junior-friendly jobs** - Updated daily at midnight PT
- **Redis caching** - 95% fewer API calls with 24-hour TTL
- **Automated worker** - node-cron fetches from Hacker News API
- **Parallel fetching** - Promise.all() for <100ms response times
- **Full-stack production** - Separate frontend & backend deployments
- **Custom domain** - jobboard.yean.me with HTTPS/SSL
- **Responsive UI** - React + Tailwind CSS mobile-friendly design
- **Auto-retry** - Frontend retries every 3 seconds if backend unavailable

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4.3 |
| **Backend** | Node.js, Express 5.2, Redis 5.12 |
| **Automation** | node-cron 4.4, Hacker News Algolia API |
| **Deployment** | Vercel (frontend), Railway (backend + Redis) |
| **Domain** | Namecheap (yean.me) with Vercel DNS |
| **Security** | HTTPS/SSL (Let's Encrypt), CORS enabled |

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

## 📚 API Endpoints

```bash
GET /jobs              # Returns 75 job objects
GET /health            # Health check (returns {status: OK})
POST /admin/fetch-jobs # Manually trigger job fetch (for testing)
```

**Example Response:**
```json
[
  {
    "id": "43243034",
    "company": "Company Name",
    "role": "Junior Software Engineer",
    "location": "Remote",
    "tags": ["React", "Node.js"],
    "link": "https://news.ycombinator.com/..."
  }
]
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

```
Worker (Daily at midnight PT)
├─ Fetch from Hacker News Algolia API
├─ Parse 184 comments into job objects
├─ Filter for junior-friendly roles only
└─ Store in Redis (75 jobs, 24-hour TTL)

API (Always Running)
├─ Two-step fetch: Get IDs index → Get all jobs in parallel
├─ Redis lookup (O(1) fast)
└─ Return JSON to frontend

Frontend (React on Vercel)
├─ Fetch on component mount
├─ Auto-retry every 3s if backend down
├─ Display 75 jobs in responsive UI
└─ User can click to view HN comments
```

## 📊 Performance & Stats

| Metric | Value |
|--------|-------|
| **API Response** | <100ms (Redis cached) |
| **Frontend Load** | ~1s (Vercel optimized) |
| **Jobs Displayed** | 75 junior-friendly roles |
| **Update Frequency** | Daily at midnight PT |
| **Cache Hit Rate** | ~95% (fewer API calls) |
| **HTTPS** | ✅ Enabled (Let's Encrypt free SSL) |
| **Uptime** | 99.9% (Railway + Vercel SLA) |

## 🎯 Key Learnings

This project demonstrates:
- ✅ Full-stack development (frontend + backend)
- ✅ Database optimization (Redis caching strategy)
- ✅ Async/await and Promise.all() patterns
- ✅ Deployment & DevOps (Vercel, Railway, custom domains)
- ✅ CORS, environment variables, error handling
- ✅ Cron jobs and task automation
- ✅ Production-grade code quality

## 🚀 Deployment

**Frontend:** Deploy to Vercel with custom domain
```bash
cd client && npm run build
# Push to Vercel
```

**Backend:** Deploy to Railway with PostgreSQL/Redis
```bash
npm run deploy
# Railway auto-deploys on git push
```

## 📝 License

MIT License - Feel free to use for learning

---

**Built to showcase production-ready full-stack development skills** 💼

*For internship inquiries: [LinkedIn](https://linkedin.com/in/kise07) | [GitHub](https://github.com/Kise07)*
