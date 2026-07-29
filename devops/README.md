# DevOps — Production

Everything you need to install and run **Prt-Samah** (Laravel API + Next.js frontend) in production.

## Contents

| Path | Purpose |
|------|---------|
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
   ├─ https://your-domain.com      → Nginx → Next.js (port 3000)
   └─ https://api.your-domain.com  → Nginx → PHP-FPM (Laravel public/)
                                           └─ queue worker (systemd)
```

## Quick start

On a fresh Ubuntu/Debian server (as deploy user with sudo):

```bash
cd /var/www
git clone <YOUR_REPO_URL> Prt-Samah
cd Prt-Samah
cp devops/env/laravel.production.example .env
cp devops/env/frontend.production.example frontend/.env.production.local
# Edit both files with real secrets/domains
bash devops/scripts/install-prod.sh
```

Then install Nginx + systemd units from `devops/nginx` and `devops/systemd` (paths inside those files).

## Never commit

- Real `.env` / `.env.production.local`
- API keys (`GROQ_API_KEY`, `MAIL_PASSWORD`, DB passwords)
- `APP_KEY`
