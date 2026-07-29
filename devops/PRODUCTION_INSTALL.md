# Production install guide

Target: **Ubuntu 22.04 / 24.04** (or similar Linux).  
Stack: **Nginx + PHP 8.3-FPM + MySQL + Node 20 + Composer**.

---

## 1. Server packages

```bash
sudo apt update
sudo apt install -y nginx mysql-server git unzip curl \
  php8.3-fpm php8.3-cli php8.3-mysql php8.3-xml php8.3-mbstring \
  php8.3-curl php8.3-zip php8.3-bcmath php8.3-gd php8.3-intl

# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

Create a MySQL database + user:

```sql
CREATE DATABASE samah_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'samah'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON samah_prod.* TO 'samah'@'localhost';
FLUSH PRIVILEGES;
```

---

## 2. Clone the app

```bash
sudo mkdir -p /var/www
sudo chown $USER:www-data /var/www
cd /var/www
git clone <YOUR_REPO_URL> Prt-Samah
cd Prt-Samah
```

---

## 3. Environment files

```bash
cp devops/env/laravel.production.example .env
cp devops/env/frontend.production.example frontend/.env.production.local
nano .env
nano frontend/.env.production.local
```

### Laravel must have

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://api.your-domain.com`
- `FRONTEND_URL=https://your-domain.com`
- `DB_*` for MySQL
- `MAIL_*` (SMTP that works — Office365 / etc.)
- `GROQ_API_KEY` (Samah AI)
- Fresh `APP_KEY` (generated in next step)

### Frontend must have

- `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
- `NEXT_PUBLIC_API_URL=https://api.your-domain.com`
- `LARAVEL_API_URL=https://api.your-domain.com` (server-side proxy to Laravel)
- `NEXT_PUBLIC_USE_MOCK=false`

---

## 4. Install (or use the script)

```bash
bash devops/scripts/install-prod.sh
```

Manual equivalent:

```bash
# API
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R ug+rwx storage bootstrap/cache

# Frontend
cd frontend
npm ci
npm run build
cd ..
```

Seed admin only on first install (change password immediately):

```bash
php artisan db:seed --class=AdminUserSeeder --force
```

---

## 5. Nginx

Copy and edit domain names:

```bash
sudo cp devops/nginx/api.conf /etc/nginx/sites-available/samah-api
sudo cp devops/nginx/frontend.conf /etc/nginx/sites-available/samah-web
sudo nano /etc/nginx/sites-available/samah-api
sudo nano /etc/nginx/sites-available/samah-web
sudo ln -sf /etc/nginx/sites-available/samah-api /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/samah-web /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

TLS (Let’s Encrypt):

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com
```

Point Laravel `public/` document root correctly (see `devops/nginx/api.conf`).

---

## 6. Process managers (systemd)

```bash
sudo cp devops/systemd/samah-queue.service /etc/systemd/system/
sudo cp devops/systemd/samah-frontend.service /etc/systemd/system/
sudo nano /etc/systemd/system/samah-queue.service
sudo nano /etc/systemd/system/samah-frontend.service
sudo systemctl daemon-reload
sudo systemctl enable --now samah-queue samah-frontend
sudo systemctl status samah-queue samah-frontend
```

**Queue worker is required** — booking + AI booking emails are queued.

---

## 7. Permissions

```bash
sudo chown -R www-data:www-data /var/www/Prt-Samah/storage /var/www/Prt-Samah/bootstrap/cache
sudo chmod -R ug+rwx /var/www/Prt-Samah/storage /var/www/Prt-Samah/bootstrap/cache
```

Deploy user should be in `www-data` group if you deploy without root.

---

## 8. Verify

- [ ] `https://your-domain.com` loads
- [ ] `https://api.your-domain.com/api/v1/services` returns JSON
- [ ] Admin login works (`/admin/login`)
- [ ] Booking form sends mail (check queue: `journalctl -u samah-queue -f`)
- [ ] Samah AI chat responds (needs `GROQ_API_KEY`)
- [ ] CORS: frontend origin matches `FRONTEND_URL`

---

## 9. Updates / redeploy

```bash
cd /var/www/Prt-Samah
bash devops/scripts/deploy.sh
```

---

## Notes

- Do **not** commit real `.env` files.
- Rotate any key that was ever committed (Groq, mail, DB).
- Prefer MySQL/PostgreSQL in production (not SQLite).
- Keep `php artisan queue:work` running via systemd forever.
