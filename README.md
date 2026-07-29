# Samah Portfolio

Premium digital-marketing portfolio monorepo:

- **Laravel 13 API** (root) — Sanctum auth, portfolio content, bookings, media
- **Next.js 15 frontend** (`frontend/`) — marketing site + admin panel

## Requirements

- PHP **8.3+**
- Composer
- Node.js **20+** and npm
- SQLite (default) or MySQL/PostgreSQL

## Install (full project)

Run these from the **repository root**.

### 1. Backend (Laravel API)

```bash
composer install
copy .env.example .env
php artisan key:generate
```

> On macOS/Linux use `cp .env.example .env` instead of `copy`.

If you use the default SQLite database:

```bash
# Windows (PowerShell)
New-Item -ItemType File -Force database/database.sqlite

# macOS / Linux
touch database/database.sqlite
```

Then migrate, seed, and link storage:

```bash
php artisan migrate --seed
php artisan storage:link
```

Optional: adjust `.env` (`APP_URL`, `FRONTEND_URL`, `MAIL_*`, `DB_*`, `GROQ_API_KEY` for Samah AI).

Default local API URL: `http://127.0.0.1:8000`  
Default seeded admin (change after first login):

- Email: `admin@samah.studio`
- Password: `admin123`

Samah AI setup details: see [`docs/SAMAH_AI.md`](docs/SAMAH_AI.md).

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
copy .env.example .env.local
```

> On macOS/Linux: `cp .env.example .env.local`

Confirm `frontend/.env.local` contains:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
LARAVEL_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_USE_MOCK=false
```

### 3. Run locally (two terminals)

**Terminal A — API**

```bash
php artisan serve
```

**Terminal B — Frontend**

```bash
cd frontend
npm run dev
```

Open:

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- API: [http://127.0.0.1:8000](http://127.0.0.1:8000)

Optional queue worker (**required** for booking emails — they are queued):

```bash
php artisan queue:work
```

## Email (booking notifications)

Two emails are sent on every successful booking:

1. **Client** — confirmation: we received your booking and will reply within 24 hours  
2. **Admin** — new book-a-call alert (to `MAIL_ADMIN_ADDRESS` or Admin → Settings → booking notify email)

### Local (log driver)

Keep `MAIL_MAILER=log` in `.env`. Messages are written to `storage/logs/laravel.log` (no real inbox).

### Production / real SMTP (Brevo free)

In root `.env`:

```env
MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=your-login@smtp-brevo.com
MAIL_PASSWORD=your-smtp-key
MAIL_FROM_ADDRESS=hello@samah.studio
MAIL_FROM_NAME="Samah"
MAIL_ADMIN_ADDRESS=admin@samah.studio
QUEUE_CONNECTION=database
```

Use `MAIL_SCHEME=null` on port **587**. Use `MAIL_SCHEME=smtps` only if you switch to port **465**.

Verify `MAIL_FROM_ADDRESS` as a sender in the Brevo dashboard, then run:

```bash
php artisan config:clear
php artisan serve
php artisan queue:work
```

Templates live in:

- `resources/views/emails/booking-confirmation.blade.php` (client)
- `resources/views/emails/booking-admin.blade.php` (admin)

## One-shot install (PowerShell)

From the repo root:

```powershell
composer install
Copy-Item .env.example .env -ErrorAction SilentlyContinue
php artisan key:generate
New-Item -ItemType File -Force database/database.sqlite | Out-Null
php artisan migrate --seed
php artisan storage:link
Set-Location frontend
npm install
Copy-Item .env.example .env.local -ErrorAction SilentlyContinue
Set-Location ..
```

Then start API + frontend as above.

## One-shot install (macOS / Linux)

```bash
composer install
cp -n .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
cd frontend
npm install
cp -n .env.example .env.local
cd ..
```

## Useful commands

| Area | Command | Purpose |
|------|---------|---------|
| API | `php artisan serve` | Start Laravel on `:8000` |
| API | `php artisan migrate --seed` | Reset schema + seed |
| API | `php artisan migrate:fresh --seed` | Drop DB, remigrate, seed |
| API | `php artisan test` | Run Pest tests |
| API | `php artisan storage:link` | Public media symlinks |
| Frontend | `cd frontend && npm run dev` | Next.js dev server |
| Frontend | `cd frontend && npm run build` | Production build |
| Frontend | `cd frontend && npm start` | Serve production build |
| Frontend | `cd frontend && npm run lint` | ESLint |

## Project structure

```
Prt-Samah/
├── app/                 # Laravel domain (models, API, mail)
├── routes/api.php       # Public + admin API routes
├── database/            # Migrations & seeders
├── storage/app/public   # Uploaded media (after storage:link)
├── frontend/            # Next.js marketing site + admin
│   ├── app/             # App Router pages
│   ├── components/      # UI sections
│   └── services/api/    # API client
└── README.md
```

## Environment notes

| Variable | Where | Notes |
|----------|-------|-------|
| `APP_URL` | root `.env` | Must match Laravel URL (media absolute URLs) |
| `FRONTEND_URL` | root `.env` | CORS / Sanctum — usually `http://localhost:3000` |
| `MAIL_*` | root `.env` | Use real SMTP in production (`log` is local only) |
| `NEXT_PUBLIC_API_URL` | `frontend/.env.local` | Browser → Laravel |
| `LARAVEL_API_URL` | `frontend/.env.local` | Server-side Next → Laravel |
| `NEXT_PUBLIC_USE_MOCK` | `frontend/.env.local` | Local UI-only mock. Ignored in production. Never falls back on API errors. |

## Production checklist (short)

1. Set `APP_DEBUG=false` and a strong admin password
2. Configure real `APP_URL`, `FRONTEND_URL`, CORS, and mail
3. Run `php artisan migrate --force` and `php artisan storage:link`
4. Build frontend: `cd frontend && npm run build && npm start`
5. Point `NEXT_PUBLIC_API_URL` / `LARAVEL_API_URL` at the live API
6. Add your production media host to `frontend/next.config.ts` `remotePatterns`

## License

MIT
