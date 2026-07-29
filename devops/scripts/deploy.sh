#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "==> Deploy Samah ($ROOT)"

git pull --ff-only

echo "==> API"
composer install --no-dev --optimize-autoloader --no-interaction
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:restart || true

echo "==> Frontend"
cd frontend
npm ci
npm run build
cd "$ROOT"

if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl restart samah-frontend || true
  sudo systemctl restart samah-queue || true
fi

echo "==> Deploy done"
