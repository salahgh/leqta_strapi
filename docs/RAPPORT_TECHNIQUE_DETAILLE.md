# Rapport Technique Détaillé
## Travaux de Déploiement et Configuration VPS

**Période:** Novembre - Décembre 2025
**Serveur:** server2.leqta.com (197.140.18.185)
**OS:** Debian/Ubuntu Linux avec HestiaCP

---

# PARTIE A : PROJET LAQTA (leqta.com)

*Plateforme marketing multilingue - Next.js + Strapi CMS*

---

## A1. Déploiement Backend Strapi CMS

### Description
Strapi est un CMS headless open-source qui fournit l'API REST pour le contenu du site Laqta.

### Travaux Réalisés

#### Installation et Configuration
- Clonage du dépôt vers `/var/www/leqta/my-blog-cms`
- Installation des dépendances npm (Node.js 20.x)
- Configuration des variables d'environnement production

#### Variables d'Environnement Configurées
```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Sécurité (générés avec openssl rand -base64 32)
APP_KEYS=clé1,clé2,clé3,clé4
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
JWT_SECRET=...

# Base de données
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=laqta_strapi
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=***

# Stockage Supabase
SUPABASE_API_URL=https://xxx.supabase.co
SUPABASE_API_KEY=***
SUPABASE_BUCKET=uploads
```

#### Build et Démarrage
- Build du panneau admin Strapi
- Configuration processus PM2 avec auto-restart
- Health check endpoint: `/api/health`

### Accès
- **Admin Panel:** https://api.leqta.com/admin
- **API REST:** https://api.leqta.com/api/*

---

## A2. Déploiement Frontend Next.js

### Description
Application Next.js 15 avec App Router, support multilingue (EN/AR/FR), et intégration Strapi.

### Travaux Réalisés

#### Installation et Configuration
- Clonage vers `/var/www/leqta/laqta`
- Installation des dépendances npm
- Configuration next-intl pour i18n

#### Variables d'Environnement
```env
NEXT_PUBLIC_STRAPI_URL_2=https://api.leqta.com
NODE_ENV=production
```

#### Build Production
- Build optimisé Next.js
- Génération pages statiques
- Optimisation des assets

### Accès
- **Site Public:** https://leqta.com
- **Port Local:** 3000

---

## A3. Configuration PM2 (Laqta)

### Description
PM2 gère les processus Node.js avec auto-restart et monitoring.

### Configuration ecosystem.config.js
```javascript
module.exports = {
  apps: [
    {
      name: 'strapi',
      cwd: '/var/www/leqta/my-blog-cms',
      script: 'npm',
      args: 'run start',
      max_memory_restart: '1G',
      autorestart: true,
    },
    {
      name: 'laqta',
      cwd: '/var/www/leqta/laqta',
      script: 'npm',
      args: 'run start',
      max_memory_restart: '1G',
      autorestart: true,
    }
  ]
};
```

### Commandes Utiles
```bash
pm2 status          # Statut des processus
pm2 logs strapi     # Logs Strapi
pm2 logs laqta      # Logs Next.js
pm2 restart all     # Redémarrer tout
```

---

## A4. Configuration Nginx (Laqta)

### Description
Nginx agit comme proxy inverse pour router le trafic vers les applications Node.js.

### Configuration Frontend (leqta.com)
```nginx
server {
    listen 443 ssl http2;
    server_name leqta.com www.leqta.com;

    ssl_certificate /path/to/leqta.com.crt;
    ssl_certificate_key /path/to/leqta.com.key;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache fichiers statiques Next.js
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Configuration API (api.leqta.com)
```nginx
server {
    listen 443 ssl http2;
    server_name api.leqta.com;

    client_max_body_size 100M;  # Pour uploads médias

    location / {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_read_timeout 120s;
    }
}
```

---

## A5. Base de Données Laqta

### Création Base de Données
```sql
CREATE DATABASE laqta_strapi
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'strapi_user'@'localhost'
  IDENTIFIED BY 'mot_de_passe_securise';

GRANT ALL PRIVILEGES ON laqta_strapi.*
  TO 'strapi_user'@'localhost';

FLUSH PRIVILEGES;
```

---

## A6. Certificats SSL Laqta

### Domaines Couverts
- leqta.com
- www.leqta.com
- api.leqta.com
- mail.leqta.com
- webmail.leqta.com

### Installation Let's Encrypt
```bash
sudo certbot --nginx -d leqta.com -d www.leqta.com -d api.leqta.com
```

### Renouvellement Automatique
- Timer certbot configuré
- Renouvellement tous les 90 jours

---

## A7. Serveur Mail Laqta

### Configuration Exim4 (SMTP)
- Port 25 (SMTP)
- Port 465 (SMTPS)
- Port 587 (Submission)

### Configuration Dovecot (IMAP/POP3)
- Port 993 (IMAPS)
- Port 995 (POP3S)
- Port 143 (IMAP)
- Port 110 (POP3)

### Enregistrements DNS Configurés
| Type | Nom | Valeur |
|------|-----|--------|
| A | mail.leqta.com | 197.140.18.185 |
| MX | leqta.com | mail.leqta.com (priorité 10) |
| TXT | leqta.com | v=spf1 a mx ip4:197.140.18.185 ~all |
| TXT | _dmarc.leqta.com | v=DMARC1; p=quarantine |
| TXT | default._domainkey | Clé DKIM |

---

## A8. Mode Maintenance

### Description
Système permettant de mettre le site en maintenance tout en permettant à l'équipe d'y accéder via un cookie.

### Fonctionnement
1. Visiteurs voient la page maintenance (503)
2. Équipe accède via: `https://leqta.com/unlock?key=SECRET_KEY`
3. Cookie de bypass valide 7 jours

### Fichiers Créés
- `/public_html/maintenance.html` - Page maintenance
- `/public_html/unlock/index.html` - Page déblocage

---

## A9. Scripts de Déploiement

### deploy.sh
Script automatisé pour les mises à jour :
```bash
#!/bin/bash
# Pull code, install deps, build, restart PM2
cd /var/www/leqta
git pull origin main
cd my-blog-cms && npm install && npm run build
cd ../laqta && npm install && npm run build
pm2 restart all
```

**Usage:**
```bash
./scripts/deploy.sh              # Déploiement complet
./scripts/deploy.sh --skip-build # Sans rebuild
```

---

# PARTIE B : PROJET SHOHRATY (shohraty.dz)

*Migration site WordPress existant*

---

## B1. Migration WordPress

### Description
Migration complète d'un site WordPress existant vers le nouveau serveur VPS.

### Travaux Réalisés

#### Transfert des Fichiers
- Thèmes WordPress (`/wp-content/themes/`)
- Plugins (`/wp-content/plugins/`)
- Uploads médias (`/wp-content/uploads/`)
- Fichiers core WordPress

#### Structure Répertoire
```
/home/mail_user/web/shohraty.dz/public_html/
├── wp-admin/
├── wp-content/
│   ├── themes/
│   ├── plugins/
│   └── uploads/
├── wp-includes/
├── wp-config.php
└── index.php
```

---

## B2. Migration Base de Données

### Export depuis Ancien Serveur
```bash
mysqldump -u user -p old_database > shohraty_backup.sql
```

### Import sur Nouveau Serveur
```bash
mysql -u shohraty_user -p shohraty_wp < shohraty_backup.sql
```

### Mise à Jour URLs
```sql
UPDATE wp_options SET option_value = 'https://shohraty.dz'
  WHERE option_name = 'siteurl';
UPDATE wp_options SET option_value = 'https://shohraty.dz'
  WHERE option_name = 'home';
```

---

## B3. Configuration wp-config.php

### Paramètres Configurés
```php
// Base de données
define('DB_NAME', 'shohraty_wp');
define('DB_USER', 'shohraty_user');
define('DB_PASSWORD', '***');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8mb4');

// URLs
define('WP_HOME', 'https://shohraty.dz');
define('WP_SITEURL', 'https://shohraty.dz');

// Sécurité (clés uniques générées)
define('AUTH_KEY', '...');
define('SECURE_AUTH_KEY', '...');
define('LOGGED_IN_KEY', '...');
// etc.

// SSL
define('FORCE_SSL_ADMIN', true);
```

---

## B4. Configuration Nginx WordPress

### Configuration Serveur
```nginx
server {
    listen 443 ssl http2;
    server_name shohraty.dz www.shohraty.dz;

    root /home/mail_user/web/shohraty.dz/public_html;
    index index.php index.html;

    ssl_certificate /path/to/shohraty.dz.crt;
    ssl_certificate_key /path/to/shohraty.dz.key;

    # Permaliens WordPress
    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Protection fichiers sensibles
    location ~ /\.(htaccess|htpasswd) {
        deny all;
    }

    location = /wp-config.php {
        deny all;
    }

    # Cache statique
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

---

## B5. Certificats SSL Shohraty

### Domaines Couverts
- shohraty.dz
- www.shohraty.dz

### Installation
```bash
sudo certbot --nginx -d shohraty.dz -d www.shohraty.dz
```

---

## B6-B7. Serveur Mail Shohraty

### Configuration Mail avec SSL
- Création domaine mail dans HestiaCP
- Certificats Let's Encrypt pour mail.shohraty.dz
- Configuration Exim4/Dovecot

### Enregistrements DNS
| Type | Nom | Valeur |
|------|-----|--------|
| A | mail.shohraty.dz | 197.140.18.185 |
| MX | shohraty.dz | mail.shohraty.dz (priorité 10) |
| TXT | shohraty.dz | v=spf1 a mx ip4:197.140.18.185 ~all |
| TXT | _dmarc.shohraty.dz | v=DMARC1; p=quarantine |

---

## B8. Tests Post-Migration

### Vérifications Effectuées
- [x] Pages principales accessibles
- [x] Images et médias affichés correctement
- [x] Liens internes fonctionnels
- [x] Formulaires de contact opérationnels
- [x] Plugins activés et fonctionnels
- [x] Panneau admin accessible
- [x] SSL actif et valide

---

# PARTIE C : INFRASTRUCTURE VPS GÉNÉRALE

*Services partagés et configuration serveur*

---

## C1. Configuration Initiale VPS

### Mises à Jour Système
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential
```

### Installation Node.js 20.x
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Vérification
```bash
node -v  # v20.x.x
npm -v   # 10.x.x
```

---

## C2. Installation HestiaCP

### Description
HestiaCP est un panneau de contrôle web open-source pour gérer le serveur.

### Services Gérés
- Nginx + Apache (serveur web)
- MariaDB (base de données)
- Exim4 + Dovecot (mail)
- vsftpd (FTP)
- Bind (DNS)
- Let's Encrypt (SSL)

### Accès
- **URL:** https://server2.leqta.com:8083
- **Alternative:** https://197.140.18.185:8083

---

## C3. Configuration MariaDB

### Sécurisation
```bash
sudo mysql_secure_installation
```
- Mot de passe root défini
- Utilisateurs anonymes supprimés
- Base test supprimée
- Connexion root distante désactivée

### phpMyAdmin
- **URL:** https://server2.leqta.com:8083/phpmyadmin/
- Configuré via Apache alias

---

## C4. Serveur FTP (vsftpd)

### Description
Serveur FTP avec isolation des utilisateurs via chroot jail.

### Comptes Créés
| Utilisateur | Accès | Répertoire |
|-------------|-------|------------|
| leqta | Lecture/Écriture | `/srv/jail/leqta/upload` |
| shohrati | Lecture/Écriture | `/srv/jail/shohrati/upload` |
| ftpadmin | Admin (tous) | `/srv/jail/ftpadmin/` |

### Structure
```
/srv/
├── ftpdata/           # Données réelles
│   ├── leqta/
│   └── shohrati/
└── jail/              # Jails chroot
    ├── leqta/upload/
    ├── shohrati/upload/
    └── ftpadmin/
```

### Configuration vsftpd
```conf
listen=YES
anonymous_enable=NO
local_enable=YES
write_enable=YES
chroot_local_user=YES
allow_writeable_chroot=NO
local_root=/srv/jail/%u
pasv_enable=YES
pasv_min_port=12000
pasv_max_port=12100
```

---

## C5. Bureau à Distance (XFCE + xrdp)

### Description
Interface graphique pour administration serveur via Remote Desktop Protocol (RDP).

### Installation
```bash
# Environnement bureau XFCE
sudo apt install xfce4 xfce4-goodies -y

# Serveur RDP
sudo apt install xrdp -y

# Configuration
echo "xfce4-session" > ~/.xsession

# Activation service
sudo systemctl enable xrdp
sudo systemctl start xrdp
```

### Accès
- **Protocole:** RDP
- **Port:** 3389
- **Adresse:** 197.140.18.185:3389
- **Client Windows:** mstsc.exe (Bureau à distance)

### Avantages
- Interface graphique légère
- Compatible clients RDP Windows natifs
- Administration visuelle du serveur
- Accès aux outils graphiques

---

## C6. Pare-feu Ecosnet

### Description
Configuration des ports au niveau du fournisseur VPS (Ecosnet) via leur tableau de bord.

### Ports Ouverts

| Port | Service | Description |
|------|---------|-------------|
| 20-21 | FTP | Transfert fichiers |
| 22 | SSH | Accès distant sécurisé |
| 25, 465, 587 | SMTP | Envoi emails |
| 80, 443 | HTTP/HTTPS | Sites web |
| 110, 143 | POP3/IMAP | Réception emails |
| 993, 995 | IMAPS/POP3S | Emails sécurisés |
| 1337 | Strapi | API Backend |
| 3000 | Next.js | Frontend |
| 3306 | MySQL | Base de données |
| 3389 | RDP | Bureau à distance |
| 8083 | HestiaCP | Panneau admin |
| 12000-12100 | FTP Passif | Mode passif |

---

## C7. Pare-feu Local (UFW/HestiaCP)

### Configuration Double Couche
```
Internet → Ecosnet Firewall → HestiaCP/UFW → Services
```

### Règles Configurées
```bash
# SSH
ufw allow 22/tcp

# Web
ufw allow 80/tcp
ufw allow 443/tcp

# Mail
ufw allow 25/tcp
ufw allow 465/tcp
ufw allow 587/tcp
ufw allow 993/tcp
ufw allow 995/tcp

# FTP
ufw allow 21/tcp
ufw allow 12000:12100/tcp

# RDP
ufw allow 3389/tcp

# HestiaCP
ufw allow 8083/tcp
```

---

## C8. Sécurisation Serveur

### Mesures Implémentées

#### SSH Hardening
- Connexion root désactivée
- Authentification par clé recommandée
- Port SSH par défaut modifié (optionnel)

#### Fail2ban
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

#### Permissions
- Fichiers .env protégés (chmod 600)
- Répertoires web avec permissions appropriées
- Utilisateurs avec privilèges minimaux

---

## C9. Résolution Problèmes SSL Dovecot

### Problème Rencontré
```
Error: Failed to initialize SSL server context:
Can't load SSL certificate: error:0A00008B:SSL routines::unknown command
```

### Cause
Entrées invalides dans `/etc/ssl/openssl.cnf` ajoutées par HestiaCP.

### Solution
```bash
# Éditer le fichier
sudo nano /etc/ssl/openssl.cnf

# Supprimer ou commenter ces lignes:
# [system_default]
# system_default = hestia_openssl_sect
# [hestia_openssl_sect]

# Redémarrer Dovecot
sudo systemctl restart dovecot
```

---

## C10. Documentation Créée

### Liste des Documents

| Fichier | Description |
|---------|-------------|
| DEPLOYMENT.md | Guide déploiement HestiaCP complet |
| VPS_DEPLOYMENT_GUIDE.md | Guide déploiement VPS Linux |
| SERVER_DEPLOYMENT.md | Référence rapide déploiement |
| NGINX_CONFIG.md | Configuration Nginx HTTPS |
| FTP_SERVER_GUIDE.md | Guide serveur FTP |
| GUI_FTP_SERVER_GUIDE.md | Guide client FTP |
| PV_VPS_CONFIGURATION.md | Procès-verbal configuration |
| HESTIACP_SSL_FIX.md | Dépannage SSL Dovecot |
| HESTIACP_PHPMYADMIN.md | Configuration phpMyAdmin |
| HESTIACP_MAIL_LOGS.md | Référence logs mail |
| MAINTENANCE_MODE_SETUP.md | Mode maintenance |
| wordpress-installation-guide.md | Guide WordPress |

---

# ANNEXES

## Architecture Globale

```
                         Internet
                            │
                            ▼
              ┌─────────────────────────────┐
              │     Pare-feu Ecosnet        │
              └─────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────┐
│                    Serveur VPS Ubuntu                      │
│                    197.140.18.185                          │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │                 Nginx (80/443)                      │   │
│  │              Proxy Inverse + SSL                    │   │
│  └────────────────────────────────────────────────────┘   │
│         │                │                │                │
│         ▼                ▼                ▼                │
│  ┌───────────┐   ┌───────────┐   ┌───────────────┐        │
│  │  Next.js  │   │  Strapi   │   │   WordPress   │        │
│  │  :3000    │   │   :1337   │   │   (PHP-FPM)   │        │
│  │  Laqta    │   │  Backend  │   │  Shohraty.dz  │        │
│  └───────────┘   └─────┬─────┘   └───────┬───────┘        │
│                        │                  │                │
│                        ▼                  ▼                │
│              ┌─────────────────────────────────┐          │
│              │          MariaDB :3306          │          │
│              │  laqta_strapi  │  shohraty_wp   │          │
│              └─────────────────────────────────┘          │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │                  Services Mail                      │   │
│  │  Exim4 (SMTP) + Dovecot (IMAP/POP3)                │   │
│  │  leqta.com  │  shohraty.dz                         │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │                 Autres Services                     │   │
│  │  FTP:21 │ SSH:22 │ RDP:3389 │ HestiaCP:8083       │   │
│  └────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

---

## Récapitulatif Accès

| Service | URL/Accès |
|---------|-----------|
| HestiaCP | https://server2.leqta.com:8083 |
| Laqta (site) | https://leqta.com |
| Strapi Admin | https://api.leqta.com/admin |
| Shohraty (site) | https://shohraty.dz |
| WordPress Admin | https://shohraty.dz/wp-admin |
| phpMyAdmin | https://server2.leqta.com:8083/phpmyadmin |
| Webmail | https://webmail.leqta.com |
| FTP | ftp://server2.leqta.com:21 |
| SSH | ssh user@197.140.18.185 |
| Bureau à Distance | 197.140.18.185:3389 (RDP) |

---

## Commandes de Maintenance

```bash
# === PM2 ===
pm2 status                    # Statut processus
pm2 logs                      # Tous les logs
pm2 restart all               # Redémarrer tout

# === Nginx ===
sudo nginx -t                 # Tester config
sudo systemctl reload nginx   # Recharger

# === Base de Données ===
mysqldump -u user -p db > backup.sql  # Sauvegarde

# === SSL ===
sudo certbot renew --dry-run  # Test renouvellement

# === Services ===
sudo systemctl status nginx
sudo systemctl status mariadb
sudo systemctl status dovecot
sudo systemctl status exim4
sudo systemctl status vsftpd
sudo systemctl status xrdp
```

---

**Document préparé par:** [Votre Nom]
**Date:** Décembre 2025
**Version:** 1.0
