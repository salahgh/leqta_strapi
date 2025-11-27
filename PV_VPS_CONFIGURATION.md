# Procès-Verbal de Configuration VPS
## Projet Laqta - Infrastructure Serveur

**Date:** Novembre 2025
**Serveur:** server2.leqta.com (197.140.18.185)
**Système d'exploitation:** Debian/Ubuntu Linux
**Panel de gestion:** HestiaCP

---

## 1. Sécurisation du Serveur

### 1.1 Gestion des Utilisateurs
| Action | Détails |
|--------|---------|
| Changement mot de passe root | Mot de passe par défaut modifié |
| Création utilisateur | Nouvel utilisateur `saleh` créé |
| Désactivation root SSH | Connexion root via SSH désactivée |
| Authentification SSH | Clés SSH implémentées (recommandé) |
| Port SSH | Port SSH par défaut modifié |

### 1.2 Configuration Pare-feu

Ports configurés sur HestiaCP Firewall et Ecosnet Firewall:

| Port | Protocole | Service | Utilisé par |
|------|-----------|---------|-------------|
| 20 | TCP | FTP Data | vsftpd (transfert données) |
| 21 | TCP | FTP Control | vsftpd (connexion) |
| 22 | TCP | SSH | OpenSSH (accès distant sécurisé) |
| 25 | TCP | SMTP | Exim4 (envoi email) |
| 80 | TCP | HTTP | Nginx/Apache (web non sécurisé) |
| 110 | TCP | POP3 | Dovecot (réception email) |
| 143 | TCP | IMAP | Dovecot (réception email) |
| 443 | TCP | HTTPS | Nginx/Apache (web sécurisé) |
| 465 | TCP | SMTPS | Exim4 (envoi email sécurisé) |
| 587 | TCP | Submission | Exim4 (soumission email) |
| 993 | TCP | IMAPS | Dovecot (IMAP sécurisé) |
| 995 | TCP | POP3S | Dovecot (POP3 sécurisé) |
| 1337 | TCP | Strapi API | Strapi CMS Backend |
| 3000 | TCP | Next.js Dev | Application Laqta (développement) |
| 3306 | TCP | MySQL/MariaDB | Base de données |
| 3389 | TCP | RDP | Bureau distant Windows |
| 8080 | TCP | HTTP Alt | Proxy/applications secondaires |
| 8083 | TCP | HestiaCP | Panel d'administration |
| 12000-12100 | TCP | FTP Passive | vsftpd (mode passif) |

---

## 2. Environnement Bureau (XFCE)

### 2.1 Installation
- **Desktop Environment:** XFCE (environnement léger)
- **Accès:** Via Windows Remote Desktop (RDP)
- **Port:** 3389

### 2.2 Caractéristiques
- Interface graphique légère pour administration serveur
- Compatible avec clients RDP Windows natifs
- Consommation mémoire minimale

---

## 3. Serveur FTP (vsftpd)

### 3.1 Configuration Générale
- **Service:** vsftpd
- **Racine données:** `/srv/ftpdata`
- **Racine jail:** `/srv/jail`
- **Mode:** Chroot activé (utilisateurs isolés)

### 3.2 Comptes Utilisateurs

| Utilisateur | Mot de passe | Permissions | Répertoire |
|-------------|--------------|-------------|------------|
| `leqta` | *(à changer)* | Lecture/Écriture | `/srv/jail/leqta/upload` |
| `shohrati` | *(à changer)* | Lecture/Écriture | `/srv/jail/shohrati/upload` |
| `ftpadmin` | *(à changer)* | Admin (accès aux deux dossiers) | `/srv/jail/ftpadmin/` |

### 3.3 Structure des Répertoires
```
/srv/
├── ftpdata/
│   ├── leqta/          # Données utilisateur leqta
│   └── shohrati/       # Données utilisateur shohrati
└── jail/
    ├── leqta/
    │   └── upload/     # Point de montage (bind mount)
    ├── shohrati/
    │   └── upload/     # Point de montage (bind mount)
    └── ftpadmin/
        ├── leqta_folder/     # Accès admin aux fichiers leqta
        └── shohrati_folder/  # Accès admin aux fichiers shohrati
```

### 3.4 Sécurité FTP
- Chroot jail pour isolation des utilisateurs
- Shell `/sbin/nologin` (pas d'accès SSH)
- Bind mounts pour persistence (`/etc/fstab`)
- Ports passifs: 12000-12100

---

## 4. Base de Données (MariaDB)

### 4.1 Configuration
- **Service:** MariaDB
- **Port:** 3306

### 4.2 Comptes

| Utilisateur | Base de données | Permissions |
|-------------|-----------------|-------------|
| `root` | Toutes | Administration complète |
| `mariadb_user` | `laqta_strapi` | Lecture/Écriture |

### 4.3 Accès phpMyAdmin
- **URL:** `https://server2.leqta.com:8083/phpmyadmin/`
- **Authentification:** Credentials MariaDB

---

## 5. Panel HestiaCP

### 5.1 Accès
- **URL:** `https://server2.leqta.com:8083`
- **URL Alternative:** `https://197.140.18.185:8083`
- **Port:** 8083

### 5.2 Services Gérés
- Domaines web (Nginx + Apache)
- Bases de données (MariaDB)
- Serveur mail (Exim4 + Dovecot)
- DNS
- Certificats SSL (Let's Encrypt)
- FTP
- Pare-feu

---

## 6. Serveur Mail

### 6.1 Configuration
- **MTA (envoi):** Exim4
- **MDA (réception):** Dovecot
- **Webmail:** `https://webmail.leqta.com`
- **Domaine mail:** `mail.leqta.com`

### 6.2 Enregistrements DNS Requis
| Type | Nom | Valeur |
|------|-----|--------|
| A | mail.leqta.com | 197.140.18.185 |
| A | webmail.leqta.com | 197.140.18.185 |
| MX | leqta.com | mail.leqta.com |
| TXT | leqta.com | SPF record |
| TXT | _dmarc.leqta.com | DMARC policy |

### 6.3 Certificats SSL
- Let's Encrypt activé pour `mail.leqta.com`
- Let's Encrypt activé pour `webmail.leqta.com`

### 6.4 Compte Mail
- **Utilisateur:** `mail_user`
- **Domaine:** `leqta.com`

---

## 7. Déploiement Applications

### 7.1 Strapi CMS (Backend)

| Paramètre | Valeur |
|-----------|--------|
| **Répertoire** | `/home/mail_user/web/leqta.com/strapi` |
| **Port** | 1337 |
| **URL** | `http://localhost:1337` |
| **Base de données** | MariaDB (`laqta_strapi`) |

#### Variables d'environnement Strapi
```env
STRAPI_URL=http://localhost:1337
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=laqta_strapi
DATABASE_USERNAME=mariadb_user
DATABASE_PASSWORD=********
```

### 7.2 Laqta (Frontend Next.js)

| Paramètre | Valeur |
|-----------|--------|
| **Framework** | Next.js 15 |
| **Port développement** | 3000 |
| **Port production** | 3001 |
| **API Backend** | `http://localhost:1337` |

#### Variables d'environnement Laqta
```env
NEXT_PUBLIC_STRAPI_URL_2=http://localhost:1337
```

---

## 8. Architecture Réseau

```
Internet
    │
    ▼
┌─────────────────────────────────────────────┐
│           Ecosnet Firewall                   │
│         (Ports autorisés)                    │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│           HestiaCP Firewall                  │
│         (Filtrage secondaire)                │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│              VPS Server                      │
│           197.140.18.185                     │
│                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │
│  │  Nginx  │  │ Apache  │  │  HestiaCP   │  │
│  │  :80    │  │ :8080   │  │   :8083     │  │
│  │  :443   │  │         │  │             │  │
│  └────┬────┘  └────┬────┘  └─────────────┘  │
│       │            │                         │
│       ▼            ▼                         │
│  ┌─────────────────────────────────────┐    │
│  │         Applications                 │    │
│  │  ┌─────────┐     ┌───────────────┐  │    │
│  │  │ Strapi  │────▶│    Laqta      │  │    │
│  │  │  :1337  │     │ :3000/:3001   │  │    │
│  │  └────┬────┘     └───────────────┘  │    │
│  │       │                              │    │
│  │       ▼                              │    │
│  │  ┌─────────┐                         │    │
│  │  │MariaDB  │                         │    │
│  │  │  :3306  │                         │    │
│  │  └─────────┘                         │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │         Services Mail               │    │
│  │  Exim4: 25, 465, 587                │    │
│  │  Dovecot: 110, 143, 993, 995        │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │         Autres Services             │    │
│  │  SSH: 22  │  FTP: 21  │  RDP: 3389  │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## 9. Maintenance et Surveillance

### 9.1 Commandes Utiles

```bash
# Statut des services
systemctl status hestia
systemctl status nginx
systemctl status apache2
systemctl status mariadb
systemctl status dovecot
systemctl status exim4
systemctl status vsftpd

# Logs
tail -f /var/log/hestia/nginx-error.log
tail -f /var/log/nginx/error.log
tail -f /var/log/apache2/error.log
tail -f /var/log/mail.log

# Redémarrage services
systemctl restart hestia
systemctl restart nginx
systemctl restart apache2
```

### 9.2 Sauvegardes
- Sauvegardes HestiaCP automatiques configurées
- Base de données: dumps MariaDB réguliers recommandés
- Fichiers: `/home/*/web/` et `/srv/ftpdata/`

---

## 10. Problèmes Connus et Solutions

### 10.1 HestiaCP 404 Error
**Cause:** Configuration `open_basedir` corrompue dans `/usr/local/hestia/nginx/conf/nginx.conf`

**Solution:**
```bash
sudo nano /usr/local/hestia/nginx/conf/nginx.conf
# Corriger la ligne open_basedir
sudo systemctl restart hestia
```

### 10.2 SSL Dovecot Error
**Cause:** Entrées OpenSSL invalides

**Solution:** Voir `HESTIACP_SSL_FIX.md`

---

## 11. Contacts et Responsabilités

| Rôle | Responsable |
|------|-------------|
| Administration serveur | - |
| Développement Laqta | - |
| Contenu CMS | - |

---

## 12. Annexes

### Documents Connexes
- `HESTIACP_SSL_FIX.md` - Guide correction SSL Dovecot
- `HESTIACP_PHPMYADMIN.md` - Configuration phpMyAdmin
- `FTP_SERVER_GUIDE.md` - Guide serveur FTP
- `ftp_config.bash` - Script configuration FTP
- `DEPLOYMENT.md` - Guide déploiement

---

**Document préparé par:** Claude AI
**Dernière mise à jour:** Novembre 2025
**Version:** 1.0
