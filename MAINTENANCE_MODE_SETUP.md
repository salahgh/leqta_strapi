# Maintenance Mode Setup for leqta.com (Nginx + Next.js)

This guide sets up cookie-based maintenance mode that allows team members to bypass while showing a maintenance page to everyone else.

## Server Details

- **HestiaCP Username**: `mail_user`
- **Webroot**: `/home/mail_user/web/leqta.com/public_html`
- **Nginx Config**: `/home/mail_user/conf/web/leqta.com/nginx.ssl.conf`
- **Next.js**: Running on `127.0.0.1:3000`

## How It Works

1. All visitors see `maintenance.html` (503 response)
2. Team members visit `https://leqta.com/unlock?key=Lqt4T3am2024SecretBypass`
3. This sets a cookie that bypasses maintenance mode
4. Cookie works on **all pages** (browser sends it with every request)
5. Cookie expires after 7 days

---

## Step 1: Create Maintenance Page

```bash
sudo nano /home/mail_user/web/leqta.com/public_html/maintenance.html
```

Paste this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maintenance Mode - Laqta</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .container { max-width: 600px; }
        h1 { font-size: 3rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; opacity: 0.9; line-height: 1.6; }
        .icon { font-size: 5rem; margin-bottom: 2rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🔧</div>
        <h1>Under Maintenance</h1>
        <p>We're currently performing scheduled maintenance to improve your experience. We'll be back shortly!</p>
    </div>
</body>
</html>
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

---

## Step 2: Create Unlock Page

```bash
sudo mkdir -p /home/mail_user/web/leqta.com/public_html/unlock
sudo nano /home/mail_user/web/leqta.com/public_html/unlock/index.html
```

Paste this content:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Unlock Access</title>
    <script>
        const urlParams = new URLSearchParams(window.location.search);
        const key = urlParams.get('key');
        const SECRET_KEY = 'Lqt4T3am2024SecretBypass';
        if (key === SECRET_KEY) {
            const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
            document.cookie = `maintenance_bypass=lqta_team_access; expires=${expires}; path=/; secure; samesite=strict`;
            document.body.innerHTML = '<h1 style="color:green;font-family:sans-serif;text-align:center;margin-top:50px;">✓ Access Granted! Redirecting...</h1>';
            setTimeout(() => window.location.href = '/', 1500);
        } else {
            document.body.innerHTML = '<h1 style="color:red;font-family:sans-serif;text-align:center;margin-top:50px;">✗ Invalid Key</h1>';
        }
    </script>
</head>
<body></body>
</html>
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

---

## Step 3: Set Permissions

```bash
sudo chown mail_user:mail_user /home/mail_user/web/leqta.com/public_html/maintenance.html
sudo chown -R mail_user:mail_user /home/mail_user/web/leqta.com/public_html/unlock
```

---

## Step 4: Backup Nginx Config

```bash
sudo cp /home/mail_user/conf/web/leqta.com/nginx.ssl.conf /home/mail_user/conf/web/leqta.com/nginx.ssl.conf.backup
```

---

## Step 5: View Current Nginx Config

```bash
cat /home/mail_user/conf/web/leqta.com/nginx.ssl.conf
```

**Share the output** so I can provide the exact changes needed for your config.

---

## Step 6: Edit Nginx Config

```bash
sudo nano /home/mail_user/conf/web/leqta.com/nginx.ssl.conf
```

You need to add/modify these blocks inside your `server` block:

```nginx
    # ============================================
    # MAINTENANCE MODE - START
    # ============================================

    # Serve maintenance.html directly
    location = /maintenance.html {
        root /home/mail_user/web/leqta.com/public_html;
        internal;
    }

    # Serve unlock page directly (not proxied to Next.js)
    location /unlock {
        root /home/mail_user/web/leqta.com/public_html;
        try_files $uri $uri/ /unlock/index.html;
    }

    # Main location block with maintenance check
    location / {
        # If cookie NOT present, show maintenance page
        if ($cookie_maintenance_bypass != "lqta_team_access") {
            return 503;
        }

        # If cookie IS present, proxy to Next.js
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

    # Custom error page for 503
    error_page 503 @maintenance;

    location @maintenance {
        root /home/mail_user/web/leqta.com/public_html;
        rewrite ^(.*)$ /maintenance.html break;
    }

    # ============================================
    # MAINTENANCE MODE - END
    # ============================================
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

---

## Step 7: Test and Apply

```bash
# Test config syntax
sudo nginx -t

# If OK, reload Nginx
sudo systemctl reload nginx
```

---

## Team Access URL

Share this URL with team members (keep it secret!):

```
https://leqta.com/unlock?key=Lqt4T3am2024SecretBypass
```

---

## Testing

```bash
# Should return 503 (maintenance page)
curl -I https://leqta.com

# Should return 200/307 (with valid cookie)
curl -I --cookie "maintenance_bypass=lqta_team_access" https://leqta.com
```

---

## Disable Maintenance Mode

```bash
sudo nano /home/mail_user/conf/web/leqta.com/nginx.ssl.conf
```

Comment out the `if` block:

```nginx
    location / {
        # COMMENTED OUT - Maintenance mode disabled
        # if ($cookie_maintenance_bypass != "lqta_team_access") {
        #     return 503;
        # }

        proxy_pass http://127.0.0.1:3000;
        # ... rest of proxy settings ...
    }
```

Then reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## Restore from Backup

```bash
sudo cp /home/mail_user/conf/web/leqta.com/nginx.ssl.conf.backup /home/mail_user/conf/web/leqta.com/nginx.ssl.conf
sudo nginx -t && sudo systemctl reload nginx
```

---

## Quick Reference

| Action | Command/URL |
|--------|-------------|
| Team access URL | `https://leqta.com/unlock?key=Lqt4T3am2024SecretBypass` |
| Edit nginx config | `sudo nano /home/mail_user/conf/web/leqta.com/nginx.ssl.conf` |
| Test config | `sudo nginx -t` |
| Reload nginx | `sudo systemctl reload nginx` |
| Test as visitor | `curl -I https://leqta.com` |
| Test with cookie | `curl -I --cookie "maintenance_bypass=lqta_team_access" https://leqta.com` |
| View nginx logs | `sudo tail -f /var/log/nginx/domains/leqta.com.error.log` |
