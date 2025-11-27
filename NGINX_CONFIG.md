# Nginx HTTPS Configuration for leqta.com (HestiaCP)

Step-by-step guide to configure nginx with HTTPS for your Next.js application using HestiaCP's existing SSL certificates.

---

## Step 1: Locate Your SSL Certificates

HestiaCP stores SSL certificates in this location:

```
/home/[username]/conf/web/[domain]/ssl/
```

**HestiaCP SSL File Names:**

| File | Description |
|------|-------------|
| `leqta.com.crt` | SSL Certificate (required) |
| `leqta.com.key` | Private Key (required) |
| `leqta.com.ca` | CA Bundle / Chain (optional) |
| `leqta.com.pem` | Combined certificate + chain |

**Full paths for leqta.com:**
```
/home/admin/conf/web/leqta.com/ssl/leqta.com.crt
/home/admin/conf/web/leqta.com/ssl/leqta.com.key
/home/admin/conf/web/leqta.com/ssl/leqta.com.ca
/home/admin/conf/web/leqta.com/ssl/leqta.com.pem
```

Verify your certificates exist:

```bash
ls -la /home/admin/conf/web/leqta.com/ssl/
```

If your username is different from `admin`, find the SSL files:

```bash
# Find all SSL directories for leqta.com
find /home -path "*/conf/web/leqta.com/ssl/*" -type f 2>/dev/null
```

Or search the entire system:

```bash
# Find all SSL files for leqta.com
find / -name "leqta.com.crt" 2>/dev/null
find / -name "leqta.com.key" 2>/dev/null
```

Expected output should show files like:
```
leqta.com.crt
leqta.com.key
leqta.com.ca
leqta.com.pem
```

Once you find the files, update the nginx configuration with the exact paths.

---

## Step 2: Verify Next.js is Running

Make sure your Next.js application is running on port 3000:

```bash
# Check if port 3000 is in use
netstat -tlnp | grep 3000

# Or using ss
ss -tlnp | grep 3000
```

If not running, start it:

```bash
cd /home/admin/web/leqta.com/laqta
npm run build
npm start
```

---

## Step 3: Create Nginx Configuration File

Create the nginx configuration file:

```bash
sudo nano /etc/nginx/conf.d/leqta.com.conf
```

Paste the following configuration:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name leqta.com www.leqta.com;

    location / {
        return 301 https://$host$request_uri;
    }
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name leqta.com www.leqta.com;

    # HestiaCP SSL Certificates
    ssl_certificate /home/admin/conf/web/leqta.com/ssl/leqta.com.crt;
    ssl_certificate_key /home/admin/conf/web/leqta.com/ssl/leqta.com.key;

    # SSL Configuration
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Modern SSL protocols
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS - enforce HTTPS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Logging
    access_log /var/log/nginx/leqta.com.access.log;
    error_log /var/log/nginx/leqta.com.error.log error;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Deny access to hidden files
    location ~ /\.(?!well-known\/|file) {
        deny all;
        return 404;
    }

    # Main application proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # WebSocket support (required for Next.js)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Forward headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;

        # Bypass cache for WebSocket
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }

    # Next.js static files - aggressive caching
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;

        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Next.js image optimization
    location /_next/image {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;

        expires 30d;
        add_header Cache-Control "public";
    }

    # Public static files
    location /static {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;

        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    # Static assets (images, fonts, etc.)
    location ~* \.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot|css|js)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;

        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    # API routes - no caching
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }
}
```

Save and exit (Ctrl+X, then Y, then Enter).

---

## Step 4: Disable HestiaCP Default Config for This Domain

HestiaCP may have its own nginx config for the domain. You need to either:

**Option A: Use HestiaCP's custom template system (Recommended)**

Create a custom nginx template in HestiaCP:

```bash
sudo nano /home/admin/conf/web/leqta.com/nginx.conf_custom
```

Add just the proxy settings (HestiaCP handles the server block):

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

location /_next/static {
    proxy_pass http://127.0.0.1:3000;
    expires 30d;
    add_header Cache-Control "public, immutable";
    access_log off;
}

location /_next/image {
    proxy_pass http://127.0.0.1:3000;
    expires 30d;
    add_header Cache-Control "public";
}

location /api {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
```

**Option B: Use standalone config (Step 3) and remove HestiaCP's config**

```bash
# Backup HestiaCP config
sudo mv /home/admin/conf/web/leqta.com/nginx.conf /home/admin/conf/web/leqta.com/nginx.conf.backup
```

---

## Step 5: Test Nginx Configuration

Verify the configuration is valid:

```bash
sudo nginx -t
```

Expected output:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

## Step 6: Reload Nginx

Apply the configuration:

```bash
sudo systemctl reload nginx
```

Or use HestiaCP command:

```bash
v-restart-web
```

---

## Step 7: Verify Everything is Working

Test your site:

```bash
# Check HTTPS is working
curl -I https://leqta.com

# Check HTTP redirects to HTTPS
curl -I http://leqta.com
```

Visit https://leqta.com in your browser to confirm.

---

## Step 8: Run Next.js as a Service (Production)

Create a systemd service to keep Next.js running:

```bash
sudo nano /etc/systemd/system/nextjs-leqta.service
```

Paste (update paths as needed):

```ini
[Unit]
Description=Next.js Leqta Frontend
After=network.target

[Service]
Type=simple
User=admin
WorkingDirectory=/home/admin/web/leqta.com/laqta
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable nextjs-leqta
sudo systemctl start nextjs-leqta
```

Check status:

```bash
sudo systemctl status nextjs-leqta
```

---

## HestiaCP SSL Certificate Reference

### File Locations

| File | Path | Description |
|------|------|-------------|
| Certificate | `/home/admin/conf/web/leqta.com/ssl/leqta.com.crt` | Main SSL certificate |
| Private Key | `/home/admin/conf/web/leqta.com/ssl/leqta.com.key` | Private key (keep secure) |
| CA Bundle | `/home/admin/conf/web/leqta.com/ssl/leqta.com.ca` | Certificate authority chain |
| Combined PEM | `/home/admin/conf/web/leqta.com/ssl/leqta.com.pem` | Certificate + chain combined |

### Which Files to Use in Nginx

For nginx, use either:

**Option 1: Separate certificate and key**
```nginx
ssl_certificate /home/admin/conf/web/leqta.com/ssl/leqta.com.crt;
ssl_certificate_key /home/admin/conf/web/leqta.com/ssl/leqta.com.key;
```

**Option 2: Combined PEM file**
```nginx
ssl_certificate /home/admin/conf/web/leqta.com/ssl/leqta.com.pem;
ssl_certificate_key /home/admin/conf/web/leqta.com/ssl/leqta.com.key;
```

### Auto-Renewal

HestiaCP automatically renews Let's Encrypt certificates. No manual renewal needed.

Debug logs location: `/var/log/hestia/LE-admin-leqta.com.log`

---

## Troubleshooting

### 502 Bad Gateway

```bash
# Check if Next.js is running
sudo systemctl status nextjs-leqta

# Check port 3000
netstat -tlnp | grep 3000

# View Next.js logs
sudo journalctl -u nextjs-leqta -f
```

### SSL Certificate Errors

```bash
# Check certificate files exist
ls -la /home/admin/conf/web/leqta.com/ssl/

# Verify certificate is valid
openssl x509 -in /home/admin/conf/web/leqta.com/ssl/leqta.com.crt -text -noout

# Check certificate expiry date
openssl x509 -in /home/admin/conf/web/leqta.com/ssl/leqta.com.crt -noout -enddate
```

### Config Conflicts with HestiaCP

```bash
# Check all nginx configs being loaded
nginx -T | grep "leqta.com"

# Restart HestiaCP nginx
v-restart-web
```

### View Logs

```bash
# Nginx error log
sudo tail -f /var/log/nginx/leqta.com.error.log

# Nginx access log
sudo tail -f /var/log/nginx/leqta.com.access.log

# Next.js logs
sudo journalctl -u nextjs-leqta -f

# HestiaCP Let's Encrypt log
cat /var/log/hestia/LE-admin-leqta.com.log
```

---

## Summary Checklist

- [ ] SSL certificates exist at `/home/admin/conf/web/leqta.com/ssl/`
- [ ] Verified `leqta.com.crt` and `leqta.com.key` files present
- [ ] Next.js running on port 3000
- [ ] Nginx config created (standalone or HestiaCP custom)
- [ ] No config conflicts with HestiaCP
- [ ] Nginx config tested with `nginx -t`
- [ ] Nginx reloaded
- [ ] HTTPS working in browser
- [ ] Next.js running as systemd service

---

## Sources

- [HestiaCP SSL Certificates Documentation](https://hestiacp.com/docs/server-administration/ssl-certificates)
- [HestiaCP Forum - SSL Certificate Path](https://forum.hestiacp.com/t/where-i-can-find-the-ssl-certificate-path-crt/4367)
- [HestiaCP GitHub - v-add-web-domain-ssl](https://github.com/hestiacp/hestiacp/blob/main/bin/v-add-web-domain-ssl)
