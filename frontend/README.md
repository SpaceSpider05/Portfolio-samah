# Samah Portfolio — Frontend

Next.js 15 app for the public site and admin UI. The Laravel API lives in the repo root.

For **full project install** (API + frontend), see the root [README.md](../README.md).

## Quick start

```bash
# From repo root — API must be running on :8000
cd frontend
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run clean` | Remove `.next` cache |

## Env

Copy `.env.example` → `.env.local`. Keep `NEXT_PUBLIC_USE_MOCK=false` when the Laravel API is available.

Mock mode is **opt-in only** (`NEXT_PUBLIC_USE_MOCK=true`) and is disabled in production builds. API failures no longer fall back to fake portfolio data.
