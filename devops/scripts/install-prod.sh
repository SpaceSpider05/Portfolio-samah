#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "==> Samah production install"
echo "    Root: $ROOT"

if [[ ! -f .env ]]; then
  echo "Missing .env — copy devops/env/laravel.production.example to .env and fill secrets."
  exit 1
fi

if [[ ! -f frontend/.env.production.local && ! -f frontend/.env.local ]]; then
  echo "Missing frontend env — copy devops/env/frontend.production.example to frontend/.env.production.local"
  exit 1
fi

echo "==> Composer (API)"
composer install --no-dev --optimize-autoloader --no-interaction

if ! grep -q '^APP_KEY=base64:' .env; then
  echo "==> Generating APP_KEY"
  php artisan key:generate --force
fi

echo "==> Laravel optimize + migrate"
php artisan storage:link || true
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Frontend build"
cd frontend
if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi
npm run build
cd "$ROOT"

echo "==> Permissions (best-effort)"
if command -v sudo >/dev/null 2>&1; then
  sudo chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
  sudo chmod -R ug+rwx storage bootstrap/cache 2>/dev/null || true
else
  chmod -R ug+rwx storage bootstrap/cache || true
fi

echo ""
echo "Install complete."
echo "Next:"
echo "  1) Configure Nginx from devops/nginx/"
echo "  2) Enable systemd units from devops/systemd/"
echo "  3) Issue SSL with certbot"
echo "  4) Follow devops/CHECKLIST.md"
echo ""
echo "Optional first-time admin seed:"
echo "  php artisan db:seed --class=AdminUserSeeder --force"
echo "  (then change the default password immediately)"
