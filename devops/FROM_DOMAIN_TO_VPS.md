# From domain + VPS to live site

End-to-end path for **growwithsamah.com** — from buying the domain and a VPS to a working production site.

Related guides:

- Install packages / app / Nginx / SSL → [PRODUCTION_INSTALL.md](./PRODUCTION_INSTALL.md)
- Go-live checks → [CHECKLIST.md](./CHECKLIST.md)

---

## Target architecture


| Host                            | Role                             |
| ------------------------------- | -------------------------------- |
| `https://growwithsamah.com`     | Marketing site + admin (Next.js) |
| `https://www.growwithsamah.com` | Same site (redirect or alias)    |
| `https://api.growwithsamah.com` | Laravel API + storage            |


```
Internet
   │
   ├─ growwithsamah.com / www  →  Nginx  →  Next.js (:3000)
   └─ api.growwithsamah.com    →  Nginx  →  PHP-FPM (Laravel public/)
                                           └─ queue worker (emails)
```

---



## Phase 1 — Buy the domain (`growwithsamah.com`)

1. Open a registrar (Namecheap, Cloudflare Registrar, Google Domains / Squarespace, OVH, etc.).
2. Search for `growwithsamah.com` and purchase it (1+ years).
3. Turn on **auto-renew** so the domain does not expire.
4. Enable **WHOIS privacy / redacted contacts** if the registrar offers it.
5. Note where DNS is managed:
  - Either on the registrar’s nameservers, **or**
  - Prefer **Cloudflare DNS** (free) for easier DNS + later CDN/firewall.

You do **not** need hosting from the registrar. The VPS is the server.

### Domains you will use


| Record                  | Purpose        |
| ----------------------- | -------------- |
| `growwithsamah.com`     | Main website   |
| `www.growwithsamah.com` | Optional alias |
| `api.growwithsamah.com` | Laravel API    |


---



## Phase 2 — Buy / create the VPS



### Specs (minimum recommended)


| Resource | Suggestion                                                     |
| -------- | -------------------------------------------------------------- |
| OS       | **Ubuntu 24.04 LTS** (or 22.04)                                |
| CPU      | 2 vCPU                                                         |
| RAM      | **4 GB** (2 GB may work; 4 GB is safer for Node build + PHP)   |
| Disk     | **40–80 GB** SSD                                               |
| Location | Closest to your audience (e.g. EU if Morocco / Europe clients) |
| Access   | SSH key login (disable password login later)                   |


Providers: DigitalOcean, Hetzner, Linode/Akamai, Contabo, OVH, Vultr, etc.

### When creating the droplet / instance

1. Choose **Ubuntu 24.04**.
2. Add your **SSH public key**.
3. Create a non-root sudo user after first login (recommended).
4. Note the **public IPv4** (and IPv6 if you use it). This project: **`45.13.237.139`**.
5. Open firewall ports early (provider firewall **and**/or `ufw` on the VPS):


| Port    | Why                             |
| ------- | ------------------------------- |
| **22**  | SSH                             |
| **80**  | HTTP (Let’s Encrypt + redirect) |
| **443** | HTTPS                           |


```bash
# On the VPS (after first SSH login)
sudo apt update && sudo apt upgrade -y
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```



### First SSH login

```bash
ssh root@45.13.237.139
# or
ssh deploy@45.13.237.139
```

Create a deploy user (if you logged in as root):

```bash
adduser deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

Then log in as `deploy` for day-to-day work.

---



## Phase 3 — Point DNS at the VPS

### Your live values

| Item | Value |
|------|-------|
| VPS IPv4 | **`45.13.237.139`** |
| Domain | **`growwithsamah.com`** |
| DNS | Cloudflare (proxied) |

### Cloudflare DNS records (current)

| Record | Type | Points to | Proxy |
|--------|------|-----------|-------|
| `growwithsamah.com` (`@`) | A | `45.13.237.139` | Proxied ✅ |
| `www` | A | `45.13.237.139` | Proxied ✅ |
| `api` | A | `45.13.237.139` | Proxied ✅ **← add this if missing** |

```
Type: A
Name: api
IPv4: 45.13.237.139
Proxy: Proxied (orange cloud)
```

Without `api.growwithsamah.com`, the Laravel API and `/storage` images will not work in production.

### Cloudflare SSL/TLS (required when Proxied)

In Cloudflare → **SSL/TLS** → Overview:

1. Mode: **Full (strict)** once Certbot has issued certificates on the VPS  
2. Until Certbot is done, use **Full** (not “Flexible”) — Flexible breaks Laravel/`X-Forwarded-Proto` and causes redirect loops  
3. Optional: SSL/TLS → Edge Certificates → enable **Always Use HTTPS**

### Wait for DNS

```bash
# From your PC
nslookup growwithsamah.com
nslookup www.growwithsamah.com
nslookup api.growwithsamah.com
```

With Cloudflare proxy, public lookups may show Cloudflare IPs (not `45.13.237.139`). That is normal. SSH still uses the real IP:

```bash
ssh root@45.13.237.139
```

---



## Phase 4 — Install the stack on the VPS

Follow **[PRODUCTION_INSTALL.md](./PRODUCTION_INSTALL.md)** with these concrete hostnames.

### Env values for this brand

**Laravel** (`.env`):

```env
APP_NAME=GrowWithSamah
APP_URL=https://api.growwithsamah.com
FRONTEND_URL=https://growwithsamah.com
SESSION_DOMAIN=.growwithsamah.com
```

**Frontend** (`frontend/.env.production.local`):

```env
NEXT_PUBLIC_SITE_URL=https://growwithsamah.com
NEXT_PUBLIC_API_URL=https://api.growwithsamah.com
LARAVEL_API_URL=https://api.growwithsamah.com
NEXT_PUBLIC_USE_MOCK=false
```



### Nginx server names

Edit the copied configs so they match:

```nginx
# frontend
server_name growwithsamah.com www.growwithsamah.com;

# api
server_name api.growwithsamah.com;
```

Root for API stays:

```nginx
root /var/www/Prt-Samah/public;
```



### SSL for this domain

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx \
  -d growwithsamah.com \
  -d www.growwithsamah.com \
  -d api.growwithsamah.com
```

Certbot renews automatically via a systemd timer. Check:

```bash
sudo systemctl status certbot.timer
```

---



## Phase 5 — Email, AI, and admin

Still required after the site is reachable:


| Item             | Action                                                |
| ---------------- | ----------------------------------------------------- |
| SMTP             | Fill `MAIL_*` in Laravel `.env` (Office 365 or other) |
| Admin inbox      | Set `MAIL_ADMIN_ADDRESS`                              |
| Samah AI         | Set `GROQ_API_KEY`                                    |
| Queue            | `samah-queue` systemd unit **must** be running        |
| Frontend process | `samah-frontend` systemd unit **must** be running     |
| Admin user       | Seed once, then **change the default password**       |


```bash
sudo systemctl enable --now samah-queue samah-frontend
sudo systemctl status samah-queue samah-frontend
```

---



## Phase 6 — Verify go-live

Use [CHECKLIST.md](./CHECKLIST.md), with these URLs:

- [ ] `https://growwithsamah.com` loads
- [ ] `https://www.growwithsamah.com` loads (or redirects to apex)
- [ ] `https://api.growwithsamah.com/api/v1/services` returns JSON
- [ ] Admin: `https://growwithsamah.com/admin/login`
- [ ] Booking form creates a row + emails (watch `journalctl -u samah-queue -f`)
- [ ] Samah AI chat replies
- [ ] Project images load from `https://api.growwithsamah.com/storage/...`

---



## Suggested order (short)

1. Buy **growwithsamah.com**
2. Create Ubuntu VPS → note IP → open 22/80/443
3. DNS A records: `@`, `www`, `api` → VPS IP
4. Wait until DNS resolves
5. Install packages + clone repo ([PRODUCTION_INSTALL.md](./PRODUCTION_INSTALL.md))
6. Fill env with `growwithsamah.com` values above
7. Run `bash devops/scripts/install-prod.sh`
8. Enable Nginx sites + Certbot
9. Enable systemd queue + frontend
10. Smoke-test checklist

---



## Costs to expect (rough)


| Item              | Notes                                            |
| ----------------- | ------------------------------------------------ |
| Domain `.com`     | ~$10–15 / year                                   |
| VPS 2 vCPU / 4 GB | Often ~$6–20 / month depending on provider       |
| Groq API          | Usage-based (AI chat)                            |
| Email             | Included with Microsoft 365 / your SMTP provider |


---



## Security basics (do early)

- [ ] SSH key only (disable password auth when keys work)
- [ ] `ufw` enabled (22, 80, 443 only)
- [ ] `APP_DEBUG=false` in production
- [ ] Strong DB + admin passwords
- [ ] Never commit real `.env` files
- [ ] Rotate Groq / mail / DB secrets if they were ever in git

---



## Redeploy later

```bash
cd /var/www/Prt-Samah
bash devops/scripts/deploy.sh
sudo systemctl restart samah-frontend samah-queue
```

---



## Quick reference — hostnames

```
Site:   https://growwithsamah.com
WWW:    https://www.growwithsamah.com
API:    https://api.growwithsamah.com
Admin:  https://growwithsamah.com/admin/login
```

