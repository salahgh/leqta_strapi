# Rapport Technique Détaillé
## Déploiement et Configuration Serveur VPS Laqta & Shohraty

**Projet:** Plateforme Agence Créative Laqta + Migration WordPress Shohraty
**Période:** Novembre - Décembre 2025
**Serveur:** server2.leqta.com (197.140.18.185)
**OS:** Debian/Ubuntu Linux avec HestiaCP

---

## Table des Matières

1. [Configuration Initiale VPS](#1-configuration-initiale-vps)
2. [Panneau de Contrôle HestiaCP](#2-panneau-de-contrôle-hestiacp)
3. [Configuration Base de Données](#3-configuration-base-de-données)
4. [Déploiement Applications Laqta](#4-déploiement-applications-laqta)
5. [Migration WordPress Shohraty](#5-migration-wordpress-shohraty)
6. [Configuration Serveur Web](#6-configuration-serveur-web)
7. [Implémentation SSL/HTTPS](#7-implémentation-sslhttps)
8. [Configuration Serveur FTP](#8-configuration-serveur-ftp)
9. [Configuration Serveur Mail](#9-configuration-serveur-mail)
10. [Interface Bureau à Distance](#10-interface-bureau-à-distance)
11. [Configuration Pare-feu Ecosnet](#11-configuration-pare-feu-ecosnet)
12. [Implémentation Sécurité](#12-implémentation-sécurité)
13. [Automatisation et Scripts](#13-automatisation-et-scripts)
14. [Dépannage et Corrections](#14-dépannage-et-corrections)
15. [Documentation Créée](#15-documentation-créée)

---

## 1. Configuration Initiale VPS

### Tâches Accomplies

#### Mises à Jour Système et Prérequis
- Mise à jour des paquets système (`apt update && apt upgrade`)
- Installation des outils de compilation pour les modules Node natifs
- Installation de Git pour le contrôle de version et le déploiement
- Configuration des locales et du fuseau horaire système

#### Installation Node.js 20.x
- Installation de Node.js 20.x via le dépôt NodeSource
- Vérification de l'installation npm 10.x
- Configuration des permissions du répertoire global npm

#### Gestionnaire de Processus PM2
- Installation globale de PM2 pour la gestion des processus
- Configuration du script de démarrage PM2 pour auto-restart au redémarrage serveur
- Mise en place du monitoring et de la journalisation des processus

#### Détails Techniques
```bash
# Installation Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Configuration PM2
sudo npm install -g pm2
pm2 startup systemd
```

---

## 2. Panneau de Contrôle HestiaCP

### Tâches Accomplies

#### Configuration du Panneau
- Configuration de l'accès admin HestiaCP sur le port 8083
- Création des comptes utilisateurs avec permissions appropriées
- Configuration des templates serveur web pour applications Node.js

#### Services Gérés
- Nginx (serveur web principal)
- Apache (traitement backend)
- MariaDB (serveur de base de données)
- Exim4 (agent de transfert mail)
- Dovecot (serveur IMAP/POP3)
- vsftpd (serveur FTP)

#### Configuration d'Accès
- URL: https://server2.leqta.com:8083
- Alternative: https://197.140.18.185:8083
- Sécurisé avec certificat SSL

---

## 3. Configuration Base de Données

### Tâches Accomplies

#### Configuration MariaDB
- Création base de données production: `laqta_strapi`
- Création base de données WordPress: `shohraty_wp`
- Création utilisateurs base de données avec privilèges limités
- Configuration encodage UTF-8 (utf8mb4_unicode_ci)
- Configuration accès phpMyAdmin via HestiaCP

#### Mesures de Sécurité
- Utilisateurs base de données restreints à localhost uniquement
- Suppression utilisateurs anonymes et base de données test
- Mot de passe root sécurisé
- Accès distant base de données désactivé

#### Accès phpMyAdmin
- URL: https://server2.leqta.com:8083/phpmyadmin/
- Configuration alias Apache pour phpMyAdmin
- Ajout règle pare-feu pour port 8083

---

## 4. Déploiement Applications Laqta

### Backend Strapi CMS

#### Étapes d'Installation
1. Clonage du dépôt vers `/var/www/leqta/my-blog-cms`
2. Installation des dépendances npm
3. Configuration des variables d'environnement production:
   - Connexion base de données (MariaDB)
   - Clés de sécurité (APP_KEYS, secrets JWT)
   - Intégration stockage Supabase
4. Build du panneau admin Strapi
5. Configuration processus PM2

#### Configuration
```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=laqta_strapi
```

### Frontend Next.js

#### Étapes d'Installation
1. Clonage du dépôt vers `/var/www/leqta/laqta`
2. Installation des dépendances npm
3. Configuration des variables d'environnement:
   - URL API Strapi
   - Intégration Odoo (si applicable)
4. Build du bundle production
5. Configuration processus PM2

#### Configuration Écosystème PM2
Création de `ecosystem.config.js` avec:
- Noms de processus: `strapi` et `laqta`
- Auto-restart en cas d'échec
- Limites mémoire (1GB par processus)
- Configuration fichiers de log
- Délai de restart avec backoff exponentiel

---

## 5. Migration WordPress Shohraty

### Tâches Accomplies

#### Migration Site Web
- Création du domaine shohraty.dz dans HestiaCP
- Configuration du répertoire web `/home/mail_user/web/shohraty.dz/public_html`
- Transfert des fichiers WordPress (thèmes, plugins, uploads)
- Migration de la base de données MySQL/MariaDB

#### Configuration Base de Données
```sql
-- Création base de données WordPress
CREATE DATABASE shohraty_wp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Création utilisateur
CREATE USER 'shohraty_user'@'localhost' IDENTIFIED BY 'mot_de_passe_securise';

-- Attribution des privilèges
GRANT ALL PRIVILEGES ON shohraty_wp.* TO 'shohraty_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Configuration wp-config.php
- Mise à jour des informations de connexion base de données
- Configuration des clés de sécurité WordPress
- Configuration URL du site (WP_HOME, WP_SITEURL)
- Activation du mode debug si nécessaire

#### Vérifications Post-Migration
- Test de toutes les pages du site
- Vérification des liens et images
- Test des formulaires de contact
- Vérification des plugins et thèmes

---

## 6. Configuration Serveur Web

### Proxy Inverse Nginx

#### Configuration Frontend Laqta (leqta.com)
- Proxy pass vers localhost:3000
- Support WebSocket pour Next.js HMR
- Cache fichiers statiques (_next/static, images)
- Compression Gzip activée
- En-têtes de sécurité (X-Frame-Options, X-Content-Type-Options, etc.)

#### Configuration API Backend (api.leqta.com)
- Proxy pass vers localhost:1337
- Taille upload max: 50-100MB pour les médias
- Timeouts étendus pour le panneau admin
- Support WebSocket pour admin Strapi

#### Configuration WordPress (shohraty.dz)
- Configuration PHP-FPM pour WordPress
- Règles de réécriture pour permaliens
- Cache des fichiers statiques
- Protection des fichiers sensibles (.htaccess, wp-config.php)

#### Optimisations de Performance
```nginx
# Cache fichiers statiques
location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}

# Compression Gzip
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript;
```

---

## 7. Implémentation SSL/HTTPS

### Tâches Accomplies

#### Certificats Let's Encrypt
- Installation de Certbot avec plugin Nginx
- Obtention de certificats pour:
  - leqta.com
  - www.leqta.com
  - api.leqta.com
  - mail.leqta.com
  - webmail.leqta.com
  - shohraty.dz
  - www.shohraty.dz
  - mail.shohraty.dz

#### Renouvellement Automatique
- Timer Certbot configuré pour renouvellement automatique
- Test avec `certbot renew --dry-run`
- Renouvellement certificat tous les 90 jours

#### Enforcement HTTPS
- Redirection HTTP vers HTTPS configurée
- En-tête HSTS activé
- Protocoles TLS modernes (TLSv1.2, TLSv1.3)
- Suites de chiffrement fortes

---

## 8. Configuration Serveur FTP

### Configuration vsftpd

#### Comptes Utilisateurs Créés
| Utilisateur | Objectif | Accès |
|-------------|----------|-------|
| leqta | Uploads client | `/srv/jail/leqta/upload` |
| shohrati | Uploads client | `/srv/jail/shohrati/upload` |
| ftpadmin | Accès admin | Les deux dossiers |

#### Fonctionnalités de Sécurité
- Chroot jail pour isolation des utilisateurs
- Pas d'accès SSH (shell: /sbin/nologin)
- Bind mounts pour persistance des données
- Mode passif configuré (ports 12000-12100)

#### Structure des Répertoires
```
/srv/
├── ftpdata/          # Stockage réel des données
│   ├── leqta/
│   └── shohrati/
└── jail/             # Jails Chroot
    ├── leqta/upload/
    ├── shohrati/upload/
    └── ftpadmin/
```

#### Fichiers de Configuration
- `/etc/vsftpd.conf` - Configuration principale
- `/etc/vsftpd.userlist` - Utilisateurs autorisés
- `/etc/fstab` - Persistance des bind mounts

---

## 9. Configuration Serveur Mail

### Domaine leqta.com

#### Composants Configurés

##### Exim4 (SMTP)
- Ports: 25, 465 (SMTPS), 587 (Submission)
- Chiffrement SSL/TLS activé
- Enregistrement SPF configuré
- Signature DKIM activée

##### Dovecot (IMAP/POP3)
- Ports: 110 (POP3), 143 (IMAP), 993 (IMAPS), 995 (POP3S)
- Certificats SSL configurés
- Configuration SSL par domaine

#### Enregistrements DNS Configurés (leqta.com)
| Type | Nom | Objectif |
|------|-----|----------|
| A | mail.leqta.com | IP serveur mail |
| A | webmail.leqta.com | Accès webmail |
| MX | leqta.com | Routage mail |
| TXT | leqta.com | Enregistrement SPF |
| TXT | _dmarc.leqta.com | Politique DMARC |
| TXT | default._domainkey | Clé DKIM |

### Domaine shohraty.dz

#### Configuration Mail avec SSL
- Création du domaine mail dans HestiaCP
- Génération certificats Let's Encrypt pour mail.shohraty.dz
- Configuration Exim4 pour le domaine
- Configuration Dovecot avec SSL par domaine

#### Enregistrements DNS Configurés (shohraty.dz)
| Type | Nom | Objectif |
|------|-----|----------|
| A | mail.shohraty.dz | IP serveur mail |
| MX | shohraty.dz | Routage mail (priorité 10) |
| TXT | shohraty.dz | Enregistrement SPF |
| TXT | _dmarc.shohraty.dz | Politique DMARC |
| TXT | default._domainkey | Clé DKIM |

#### Accès Webmail
- URL leqta.com: https://webmail.leqta.com
- Interface webmail Roundcube

---

## 10. Interface Bureau à Distance

### Installation Environnement de Bureau XFCE

#### Tâches Accomplies
- Installation de l'environnement de bureau XFCE (léger et performant)
- Installation du serveur xrdp pour accès RDP
- Configuration du port 3389 pour Remote Desktop Protocol
- Test de connexion depuis Windows Remote Desktop

#### Commandes d'Installation
```bash
# Installation XFCE
sudo apt update
sudo apt install xfce4 xfce4-goodies -y

# Installation xrdp
sudo apt install xrdp -y

# Configuration xrdp pour utiliser XFCE
echo "xfce4-session" > ~/.xsession

# Activation et démarrage du service
sudo systemctl enable xrdp
sudo systemctl start xrdp
```

#### Accès Bureau à Distance
- **Protocole:** RDP (Remote Desktop Protocol)
- **Port:** 3389
- **Client:** Bureau à distance Windows (mstsc.exe)
- **Adresse:** 197.140.18.185:3389

#### Avantages
- Interface graphique pour administration serveur
- Compatible avec clients RDP Windows natifs
- Consommation mémoire minimale
- Accès aux outils graphiques (navigateur, éditeurs, etc.)

---

## 11. Configuration Pare-feu Ecosnet

### Tâches Accomplies

#### Configuration dans le Tableau de Bord Ecosnet
Accès au pare-feu du fournisseur VPS (Ecosnet) pour ouvrir les ports nécessaires au niveau infrastructure.

#### Ports Configurés dans Ecosnet

| Port | Protocole | Service | Description |
|------|-----------|---------|-------------|
| 20 | TCP | FTP Data | Transfert données FTP |
| 21 | TCP | FTP Control | Connexion FTP |
| 22 | TCP | SSH | Accès distant sécurisé |
| 25 | TCP | SMTP | Envoi email |
| 80 | TCP | HTTP | Web non sécurisé |
| 110 | TCP | POP3 | Réception email |
| 143 | TCP | IMAP | Réception email |
| 443 | TCP | HTTPS | Web sécurisé |
| 465 | TCP | SMTPS | Envoi email sécurisé |
| 587 | TCP | Submission | Soumission email |
| 993 | TCP | IMAPS | IMAP sécurisé |
| 995 | TCP | POP3S | POP3 sécurisé |
| 1337 | TCP | Strapi API | Backend CMS Strapi |
| 3000 | TCP | Next.js | Application Laqta |
| 3306 | TCP | MySQL/MariaDB | Base de données |
| 3389 | TCP | RDP | Bureau distant |
| 8080 | TCP | HTTP Alt | Applications secondaires |
| 8083 | TCP | HestiaCP | Panneau d'administration |
| 12000-12100 | TCP | FTP Passif | Mode passif vsftpd |

#### Double Couche de Sécurité
```
Internet
    │
    ▼
┌─────────────────────────────────────────┐
│         Pare-feu Ecosnet                 │
│      (Ports autorisés - Niveau ISP)      │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│         Pare-feu HestiaCP                │
│     (Filtrage secondaire - Niveau OS)    │
└─────────────────────────────────────────┘
    │
    ▼
         Serveur VPS
```

---

## 12. Implémentation Sécurité

### Configuration Pare-feu Local

#### Ports Configurés (HestiaCP/UFW)
| Port | Service | Statut |
|------|---------|--------|
| 22 | SSH | Ouvert |
| 80 | HTTP | Ouvert |
| 443 | HTTPS | Ouvert |
| 21 | FTP | Ouvert |
| 25, 465, 587 | SMTP | Ouvert |
| 110, 143, 993, 995 | IMAP/POP3 | Ouvert |
| 1337 | API Strapi | Interne |
| 3000 | Next.js | Interne |
| 3389 | RDP | Ouvert |
| 8083 | HestiaCP | Ouvert |

#### Mesures de Sécurité
- Authentification par clé SSH recommandée
- Connexion SSH root désactivée
- Fail2ban pour protection contre force brute
- Règles UFW/iptables configurées

### Sécurité Applications
- Fichiers d'environnement protégés (.env non dans git)
- Utilisateur base de données avec privilèges minimaux
- Clés sécurité Strapi générées avec `openssl rand -base64 32`
- En-têtes de sécurité HTTP activés

---

## 13. Automatisation et Scripts

### Scripts Créés

#### deploy.sh
**Objectif:** Déploiement automatisé pour les mises à jour
**Fonctionnalités:**
- Pull du dernier code depuis GitHub
- Sauvegarde et restauration des fichiers .env
- Installation des dépendances
- Build des deux applications
- Redémarrage des processus PM2
- Vérification santé pour Strapi

**Utilisation:**
```bash
./scripts/deploy.sh              # Déploiement complet
./scripts/deploy.sh --skip-build # Sans build (plus rapide)
```

#### setup.sh
**Objectif:** Configuration initiale du serveur
**Fonctionnalités:**
- Installation Node.js et PM2
- Création des répertoires projet
- Génération des templates .env

#### ftp_config.bash
**Objectif:** Configuration serveur FTP
**Fonctionnalités:**
- Création utilisateurs FTP
- Configuration des jails chroot
- Configuration des bind mounts

#### Scripts de Sauvegarde
- Sauvegarde base de données avec mysqldump
- Nettoyage automatique des anciennes sauvegardes
- Tâche cron pour sauvegardes planifiées

---

## 14. Dépannage et Corrections

### Problèmes Résolus

#### Erreur SSL Dovecot
**Problème:** `Can't load SSL certificate: error:0A00008B:SSL routines::unknown command`

**Cause:** Configuration OpenSSL corrompue avec entrées HestiaCP invalides

**Solution:**
1. Édition de `/etc/ssl/openssl.cnf`
2. Suppression/commentaire des lignes problématiques:
   ```
   [system_default]
   system_default = hestia_openssl_sect
   [hestia_openssl_sect]
   ```
3. Redémarrage de Dovecot

#### Erreur 404 HestiaCP
**Problème:** Panneau HestiaCP affichant des erreurs 404

**Cause:** Configuration `open_basedir` corrompue

**Solution:** Correction de `/usr/local/hestia/nginx/conf/nginx.conf`

#### Correction Navigation Blog
- Documenté dans `docs/troubleshooting/FIX_BLOG_NAVIGATION.md`
- Problème de routage frontend résolu

---

## 15. Documentation Créée

### Guides de Déploiement
| Fichier | Objectif |
|---------|----------|
| DEPLOYMENT.md | Guide complet déploiement HestiaCP |
| VPS_DEPLOYMENT_GUIDE.md | Déploiement VPS Linux depuis zéro |
| SERVER_DEPLOYMENT.md | Référence rapide déploiement |

### Guides Configuration Serveur
| Fichier | Objectif |
|---------|----------|
| NGINX_CONFIG.md | Configuration proxy inverse Nginx HTTPS |
| FTP_SERVER_GUIDE.md | Configuration et utilisation serveur FTP |
| GUI_FTP_SERVER_GUIDE.md | Guide configuration client FTP |
| PV_VPS_CONFIGURATION.md | Procès-verbal configuration serveur complet |

### Guides HestiaCP
| Fichier | Objectif |
|---------|----------|
| HESTIACP_SSL_FIX.md | Dépannage SSL/Dovecot |
| HESTIACP_PHPMYADMIN.md | Configuration phpMyAdmin |
| HESTIACP_MAIL_LOGS.md | Référence logs serveur mail |

### Guides Additionnels
| Fichier | Objectif |
|---------|----------|
| MAINTENANCE_MODE_SETUP.md | Mode maintenance basé sur cookies |
| wordpress-installation-guide.md | Référence installation WordPress |

---

## Résumé Technique

### Architecture Déployée

```
Internet
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│                  Pare-feu Ecosnet                        │
└─────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│                 Serveur VPS Ubuntu                       │
│                  197.140.18.185                          │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Nginx (80/443)                       │   │
│  │           Proxy Inverse + SSL                     │   │
│  └──────────────────────────────────────────────────┘   │
│       │              │                │                  │
│       ▼              ▼                ▼                  │
│  ┌─────────┐  ┌───────────┐  ┌──────────────────┐       │
│  │ Next.js │  │  Strapi   │  │    WordPress     │       │
│  │  :3000  │  │   :1337   │  │   (PHP-FPM)      │       │
│  │ (Laqta) │  │ (Backend) │  │  (shohraty.dz)   │       │
│  └─────────┘  └─────┬─────┘  └────────┬─────────┘       │
│                     │                  │                 │
│                     ▼                  ▼                 │
│              ┌─────────────────────────────┐            │
│              │         MariaDB             │            │
│              │          :3306              │            │
│              │  laqta_strapi | shohraty_wp │            │
│              └─────────────────────────────┘            │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Services Mail                        │   │
│  │  Exim4: 25, 465, 587                             │   │
│  │  Dovecot: 110, 143, 993, 995                     │   │
│  │  Domaines: leqta.com, shohraty.dz                │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Autres Services                      │   │
│  │  SSH: 22 │ FTP: 21 │ RDP: 3389 │ HestiaCP: 8083 │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Aperçu de la Stack Technique
- **OS:** Debian/Ubuntu Linux
- **Panneau de Contrôle:** HestiaCP
- **Serveur Web:** Nginx + Apache
- **Base de Données:** MariaDB
- **Backend:** Strapi CMS v5 (Node.js)
- **Frontend:** Next.js 15 (React)
- **CMS:** WordPress (shohraty.dz)
- **Gestionnaire de Processus:** PM2
- **SSL:** Let's Encrypt (Certbot)
- **FTP:** vsftpd
- **Mail:** Exim4 + Dovecot
- **Bureau à Distance:** XFCE + xrdp

---

## Résumé Identifiants et Accès

| Service | URL/Accès | Notes |
|---------|-----------|-------|
| HestiaCP | https://server2.leqta.com:8083 | Panneau de contrôle |
| Admin Strapi | https://api.leqta.com/admin | Admin CMS |
| Frontend Laqta | https://leqta.com | Site web public |
| WordPress | https://shohraty.dz | Site WordPress |
| Admin WordPress | https://shohraty.dz/wp-admin | Admin WordPress |
| phpMyAdmin | https://server2.leqta.com:8083/phpmyadmin | Base de données |
| Webmail Laqta | https://webmail.leqta.com | Accès email |
| FTP | ftp://server2.leqta.com:21 | Transfert fichiers |
| SSH | ssh user@197.140.18.185 | Accès serveur |
| Bureau à Distance | 197.140.18.185:3389 | RDP Windows |

---

## Référence Rapide Commandes de Maintenance

```bash
# Commandes PM2
pm2 status              # Vérifier statut
pm2 logs                # Voir tous les logs
pm2 logs strapi         # Logs Strapi
pm2 logs laqta          # Logs Frontend
pm2 restart all         # Redémarrer services
pm2 monit               # Monitoring temps réel

# Commandes Nginx
sudo nginx -t                    # Tester config
sudo systemctl reload nginx      # Appliquer changements

# Sauvegarde Base de Données
mysqldump -u strapi_user -p laqta_strapi > backup_laqta.sql
mysqldump -u shohraty_user -p shohraty_wp > backup_shohraty.sql

# Test Renouvellement SSL
sudo certbot renew --dry-run

# Déploiement
cd /var/www/leqta && ./scripts/deploy.sh

# Redémarrage Services Mail
sudo systemctl restart exim4
sudo systemctl restart dovecot

# Accès Bureau à Distance
# Depuis Windows: mstsc.exe -> 197.140.18.185:3389
```

---

**Document préparé par:** [Votre Nom]
**Date:** Décembre 2025
**Version:** 1.0
