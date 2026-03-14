# CI/CD Deployment Guide

## Architecture

| | Production | Staging |
|---|---|---|
| Branch | `main` | `staging` |
| Server path | `/var/www/leqta` | `/var/www/leqta-staging` |
| Frontend URL | `leqta.com` (port 3000) | `staging.leqta.com` (port 3001) |
| API URL | `api.leqta.com` (port 1337) | `staging-api.leqta.com` (port 1338) |
| PM2 names | `strapi`, `laqta` | `strapi-staging`, `laqta-staging` |
| Database | `strapi` (shared) | `strapi` (shared) |

## Branching Strategy

```
feature/xyz  -->  staging  -->  main
                    |            |
              deploy-staging   deploy-production
                    |            |
           staging.leqta.com   leqta.com
```

1. Create `feature/*` branches from `staging`
2. Merge feature branches into `staging` via PR
3. Deploy staging and test at `staging.leqta.com`
4. Merge `staging` into `main` via PR
5. Deploy production

## VPS Initial Setup

### 1. Create the staging branch

```bash
git checkout main
git pull origin main
git checkout -b staging
git push -u origin staging
```

### 2. DNS Records

Add A records pointing to your server IP:

```
staging.leqta.com       A    <SERVER_IP>
staging-api.leqta.com   A    <SERVER_IP>
```

### 3. HestiaCP Subdomains

```bash
# Add staging frontend domain
v-add-web-domain mail_user staging.leqta.com

# Add staging API domain
v-add-web-domain mail_user staging-api.leqta.com

# Enable SSL with Let's Encrypt
v-add-letsencrypt-domain mail_user staging.leqta.com
v-add-letsencrypt-domain mail_user staging-api.leqta.com

# Verify domains were created
v-list-web-domains mail_user
```

### 4. Clone the Staging Repository

```bash
sudo mkdir -p /var/www/leqta-staging
sudo chown -R $USER:$USER /var/www/leqta-staging
git clone https://github.com/salahgh/leqta_strapi.git /var/www/leqta-staging
cd /var/www/leqta-staging
git checkout staging
```

### 5. Create Staging .env Files

**Strapi** (`/var/www/leqta-staging/my-blog-cms/.env`):

```env
HOST=0.0.0.0
PORT=1338
NODE_ENV=production
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=<your_password>
# ... other keys (APP_KEYS, JWT_SECRET, etc.)
```

**Next.js** (`/var/www/leqta-staging/laqta/.env.local`):

```env
NEXT_PUBLIC_STRAPI_URL_2=https://staging-api.leqta.com
```

### 6. Nginx Reverse Proxy (Staging)

**`staging.leqta.com`** — proxy to Next.js on port 3001:

```nginx
server {
    listen 443 ssl http2;
    server_name staging.leqta.com;

    ssl_certificate     /path/to/ssl/staging.leqta.com.pem;
    ssl_certificate_key /path/to/ssl/staging.leqta.com.key;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**`staging-api.leqta.com`** — proxy to Strapi on port 1338:

```nginx
server {
    listen 443 ssl http2;
    server_name staging-api.leqta.com;

    ssl_certificate     /path/to/ssl/staging-api.leqta.com.pem;
    ssl_certificate_key /path/to/ssl/staging-api.leqta.com.key;

    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:1338;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

After editing, test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 7. First Deploy + PM2 Startup

```bash
# Run the staging deploy script
chmod +x /var/www/leqta-staging/scripts/deploy-staging.sh
/var/www/leqta-staging/scripts/deploy-staging.sh

# Configure PM2 to start on boot
pm2 startup systemd
# Run the sudo command it outputs
pm2 save
```

### 8. Verify

```bash
# Check all PM2 processes
pm2 status

# Test local endpoints
curl -sf http://localhost:1337/_health && echo "Prod Strapi OK"
curl -sf http://localhost:3000 > /dev/null && echo "Prod Next.js OK"
curl -sf http://localhost:1338/_health && echo "Staging Strapi OK"
curl -sf http://localhost:3001 > /dev/null && echo "Staging Next.js OK"

# Test external URLs
curl -I https://staging.leqta.com
curl -I https://staging-api.leqta.com
```

## Deploy Commands

```bash
# Full staging deploy
/var/www/leqta-staging/scripts/deploy-staging.sh

# Full production deploy
/var/www/leqta/scripts/deploy-production.sh

# Skip npm install + build (config-only changes)
./scripts/deploy-staging.sh --skip-build

# Deploy only Strapi
./scripts/deploy-production.sh --strapi-only

# Deploy only Next.js
./scripts/deploy-production.sh --laqta-only
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| PM2 process not starting | Check logs: `pm2 logs strapi-staging --lines 50` |
| Port already in use | Kill existing process: `pm2 delete strapi-staging` or `lsof -i :1338` |
| .env files missing after deploy | They should be auto-restored; check `/tmp/leqta-staging-env-backup/` |
| Nginx 502 Bad Gateway | App not running — check `pm2 status` and restart if needed |
| Build fails (out of memory) | Add swap: `sudo fallocate -l 2G /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile` |
| HestiaCP overwrites Nginx config | Re-apply after domain edits, or use HestiaCP custom templates |
