# DevOps — Production

Everything you need to install and run **Prt-Samah** (Laravel API + Next.js frontend) in production.

## Contents

| Path | Purpose |
|------|---------|
| [FROM_DOMAIN_TO_VPS.md](./FROM_DOMAIN_TO_VPS.md) | Buy domain (`growwithsamah.com`) + VPS → DNS → go-live |
| [PRODUCTION_INSTALL.md](./PRODUCTION_INSTALL.md) | Full production install guide |
| [CHECKLIST.md](./CHECKLIST.md) | Go-live checklist |
| [env/laravel.production.example](./env/laravel.production.example) | Laravel `.env` template (no secrets) |
| [env/frontend.production.example](./env/frontend.production.example) | Next.js env template |
| [nginx/api.conf](./nginx/api.conf) | Nginx vhost for Laravel API |
| [nginx/frontend.conf](./nginx/frontend.conf) | Nginx vhost / reverse proxy for Next.js |
| [systemd/samah-queue.service](./systemd/samah-queue.service) | Queue worker (emails / jobs) |
| [systemd/samah-frontend.service](./systemd/samah-frontend.service) | Next.js `node` process |
| [scripts/install-prod.sh](./scripts/install-prod.sh) | One-shot install script (Linux) |
| [scripts/deploy.sh](./scripts/deploy.sh) | Pull + build + migrate deploy script |

## Architecture (prod)

```
Internet
   │
   ├─ https://growwithsamah.com      → Nginx → Next.js (port 3000)
   └─ https://api.growwithsamah.com  → Nginx → PHP-FPM (Laravel public/)
                                           └─ queue worker (systemd)
```

## Quick start

1. Follow **[FROM_DOMAIN_TO_VPS.md](./FROM_DOMAIN_TO_VPS.md)** (domain + VPS + DNS).
2. On the server, install the app:

```bash
cd /var/www
git clone <YOUR_REPO_URL> Prt-Samah
cd Prt-Samah
cp devops/env/laravel.production.example .env
cp devops/env/frontend.production.example frontend/.env.production.local
# Edit both files with growwithsamah.com + secrets
bash devops/scripts/install-prod.sh
```

Then install Nginx + systemd units from `devops/nginx` and `devops/systemd` (see FROM_DOMAIN_TO_VPS + PRODUCTION_INSTALL).

## Never commit

- Real `.env` / `.env.production.local`
- API keys (`GROQ_API_KEY`, `MAIL_PASSWORD`, DB passwords)
- `APP_KEY`
