# Production go-live checklist

## Before deploy

- [ ] Domains ready (`your-domain.com`, `api.your-domain.com`)
- [ ] DNS A/AAAA records pointed at the server
- [ ] MySQL database + user created
- [ ] SMTP credentials tested
- [ ] Groq API key created (for Samah AI)
- [ ] Repo access on the server (deploy key / HTTPS token)

## Env

- [ ] `.env` copied from `devops/env/laravel.production.example`
- [ ] `APP_DEBUG=false`
- [ ] `APP_ENV=production`
- [ ] `APP_URL` / `FRONTEND_URL` are HTTPS
- [ ] `frontend/.env.production.local` copied from `devops/env/frontend.production.example`
- [ ] `NEXT_PUBLIC_USE_MOCK=false`
- [ ] No secrets in git

## App

- [ ] `composer install --no-dev`
- [ ] `php artisan key:generate`
- [ ] `php artisan migrate --force`
- [ ] `php artisan storage:link`
- [ ] `php artisan config:cache && route:cache && view:cache`
- [ ] `npm ci && npm run build` in `frontend/`
- [ ] Admin password changed from default

## Runtime

- [ ] Nginx sites enabled + `nginx -t` OK
- [ ] SSL certificates installed
- [ ] `samah-queue` systemd active
- [ ] `samah-frontend` systemd active
- [ ] PHP-FPM running
- [ ] Storage writable by `www-data`

## Smoke tests

- [ ] Home page loads
- [ ] Portfolio / services load from API
- [ ] Book a call → DB row + emails
- [ ] AI chat works
- [ ] AI `/book` creates booking with source `ai_agent`
- [ ] Admin → Bookings / AI Conversations work
- [ ] Follow-up email from AI conversation sends
