# VPS commands — growwithsamah.com

Copy-paste on the server: **`45.13.237.139`** (Ubuntu).

Before you start in Cloudflare, make sure this record exists:

| Type | Name | Points to | Proxy |
|------|------|-----------|-------|
| A | `api` | `45.13.237.139` | Proxied |

SSH in:

```bash
ssh root@45.13.237.139
```

---

## 1) Firewall + updates

```bash
apt update && apt upgrade -y
apt install -y ufw
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status
```

---

## 2) Install packages (Nginx, PHP 8.3, MySQL, Node 20, Composer)

```bash
apt install -y nginx mysql-server git unzip curl \
  php8.3-fpm php8.3-cli php8.3-mysql php8.3-xml php8.3-mbstring \
  php8.3-curl php8.3-zip php8.3-bcmath php8.3-gd php8.3-intl

# If php8.3 packages are missing on Ubuntu 24.04, enable the Ondřej PPA first:
# apt install -y software-properties-common
# add-apt-repository -y ppa:ondrej/php
# apt update
# then re-run the php8.3 apt install line above

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
composer --version
node -v
php -v
```

---

## 3) Create MySQL database

```bash
mysql -e "CREATE DATABASE samah_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER 'samah'@'localhost' IDENTIFIED BY 'CHANGE_THIS_DB_PASSWORD';"
mysql -e "GRANT ALL PRIVILEGES ON samah_prod.* TO 'samah'@'localhost'; FLUSH PRIVILEGES;"
```

Replace `CHANGE_THIS_DB_PASSWORD` with a strong password and keep it for `.env`.

---

## 4) Clone the repo

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/SpaceSpider05/Portfolio-samah.git Prt-Samah
cd /var/www/Prt-Samah
```

---

## 5) Env files

```bash
cd /var/www/Prt-Samah
cp devops/env/laravel.production.example .env
cp devops/env/frontend.production.example frontend/.env.production.local
nano .env
```

Fill at least:

```env
APP_NAME=GrowWithSamah
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.growwithsamah.com
FRONTEND_URL=https://growwithsamah.com
SESSION_DOMAIN=.growwithsamah.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=samah_prod
DB_USERNAME=samah
DB_PASSWORD=CHANGE_THIS_DB_PASSWORD

MAIL_MAILER=smtp
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_USERNAME=your@email.com
MAIL_PASSWORD=your-mail-password
MAIL_FROM_ADDRESS=your@email.com
MAIL_FROM_NAME="GrowWithSamah"
MAIL_ADMIN_ADDRESS=your@email.com

GROQ_API_KEY=your-groq-key
```

Frontend env is already correct if you copied the example:

```bash
cat frontend/.env.production.local
```

Should show:

```env
NEXT_PUBLIC_SITE_URL=https://growwithsamah.com
NEXT_PUBLIC_API_URL=https://api.growwithsamah.com
LARAVEL_API_URL=https://api.growwithsamah.com
NEXT_PUBLIC_USE_MOCK=false
```

---

## 6) Install + build the app

```bash
cd /var/www/Prt-Samah
chmod +x devops/scripts/*.sh
bash devops/scripts/install-prod.sh
php artisan db:seed --class=AdminUserSeeder --force
php artisan db:seed --class=PortfolioSeeder --force
php artisan db:seed --class=SiteSettingSeeder --force
```

Then change the admin password immediately (admin panel or tinker).

---

## 7) Nginx sites

```bash
cp /var/www/Prt-Samah/devops/nginx/frontend.conf /etc/nginx/sites-available/samah-web
cp /var/www/Prt-Samah/devops/nginx/api.conf /etc/nginx/sites-available/samah-api
ln -sf /etc/nginx/sites-available/samah-web /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/samah-api /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

---

## 8) SSL (Let’s Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx \
  -d growwithsamah.com \
  -d www.growwithsamah.com \
  -d api.growwithsamah.com
```

In Cloudflare → **SSL/TLS**: set mode to **Full (strict)** after this succeeds.

---

## 9) Systemd (Next.js + queue)

```bash
cp /var/www/Prt-Samah/devops/systemd/samah-frontend.service /etc/systemd/system/
cp /var/www/Prt-Samah/devops/systemd/samah-queue.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now samah-frontend samah-queue
systemctl status samah-frontend samah-queue --no-pager
```

Permissions:

```bash
chown -R www-data:www-data /var/www/Prt-Samah/storage /var/www/Prt-Samah/bootstrap/cache
chmod -R ug+rwx /var/www/Prt-Samah/storage /var/www/Prt-Samah/bootstrap/cache
# Next needs to read the built app
chown -R www-data:www-data /var/www/Prt-Samah/frontend
```

---

## 10) Smoke test

```bash
curl -I https://growwithsamah.com
curl -s https://api.growwithsamah.com/api/v1/services | head
systemctl is-active samah-frontend samah-queue nginx php8.3-fpm
```

Browser checks:

- https://growwithsamah.com
- https://api.growwithsamah.com/api/v1/services
- https://growwithsamah.com/admin/login

---

## Later updates / redeploy

```bash
cd /var/www/Prt-Samah
bash devops/scripts/deploy.sh
systemctl restart samah-frontend samah-queue
```
