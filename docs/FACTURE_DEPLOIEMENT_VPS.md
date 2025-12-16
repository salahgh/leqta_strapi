# FACTURE - Déploiement et Configuration Serveur VPS

**Numéro de Facture:** FACT-LAQTA-2025-001
**Date:** Décembre 2025
**Projet:** Plateforme Laqta & Migration WordPress Shohraty

---

## Informations Client

**Client:** Laqta Creative Agency
**Projet:** Déploiement Full-Stack (Next.js + Strapi CMS + WordPress)
**Serveur:** VPS Ubuntu avec HestiaCP (server2.leqta.com - 197.140.18.185)

---

## Informations Développeur

**Développeur:** [Votre Nom]
**Fonction:** Développeur Logiciel Freelance
**Contact:** [Votre Email / Téléphone]

---

## Services Rendus

| # | Service | Description | Heures |
|---|---------|-------------|--------|
| 1 | **Configuration Initiale VPS** | Mises à jour système, installation Node.js 20.x, outils de compilation, configuration Git | 2 |
| 2 | **Configuration HestiaCP** | Installation panneau de contrôle, gestion utilisateurs, sécurisation du panneau | 2 |
| 3 | **Configuration Base de Données MariaDB** | Configuration serveur de base de données, création utilisateurs, permissions, accès phpMyAdmin | 1.5 |
| 4 | **Déploiement Strapi CMS** | Installation backend, configuration environnement, build production, configuration PM2 | 3 |
| 5 | **Déploiement Frontend Next.js** | Installation frontend, configuration environnement, build production, configuration PM2 | 2.5 |
| 6 | **Configuration Proxy Inverse Nginx** | Configuration proxy pour les deux applications, support WebSocket, règles de cache | 2 |
| 7 | **Configuration SSL/HTTPS** | Certificats Let's Encrypt, renouvellement automatique, redirection HTTP vers HTTPS | 1.5 |
| 8 | **Configuration Serveur FTP** | Installation vsftpd, configuration chroot jail, configuration multi-utilisateurs avec accès isolé | 3 |
| 9 | **Configuration Serveur Mail (leqta.com)** | Configuration Exim4 + Dovecot, enregistrements DNS (MX, SPF, DMARC), configuration webmail | 3 |
| 10 | **Renforcement Sécurité** | Règles pare-feu (UFW/iptables), sécurisation SSH, fail2ban, permissions utilisateurs | 2 |
| 11 | **Gestion Processus PM2** | Configuration auto-restart, scripts de démarrage, configuration monitoring | 1 |
| 12 | **Système Mode Maintenance** | Système bypass par cookie, page maintenance, intégration Nginx | 1.5 |
| 13 | **Scripts de Déploiement** | Scripts de déploiement automatisé (deploy.sh, setup.sh), scripts de sauvegarde | 2 |
| 14 | **Résolution Problèmes SSL** | Correction erreur SSL Dovecot, réparation configuration OpenSSL, vérification chaîne certificats | 1.5 |
| 15 | **Migration WordPress (shohraty.dz)** | Migration site WordPress complet, configuration base de données, restauration fichiers | 3 |
| 16 | **Configuration Mail (shohraty.dz)** | Serveur mail avec SSL, enregistrements DNS, certificats Let's Encrypt | 2 |
| 17 | **Interface Bureau à Distance** | Installation environnement XFCE, configuration serveur RDP (xrdp), accès distant Windows | 2 |
| 18 | **Configuration Pare-feu Ecosnet** | Configuration règles pare-feu dans tableau de bord Ecosnet, ouverture ports requis | 1.5 |
| 19 | **Documentation** | Guides complets pour déploiement, configuration serveur, dépannage | 4 |
| 20 | **Tests et Vérification** | Tests bout-en-bout, vérifications santé, vérification performances | 2 |

---

## Résumé

| Élément | Valeur |
|---------|--------|
| **Total Heures** | 42 |
| **Taux Horaire** | _____ DA / € |
| **Sous-total** | _____ DA / € |
| **TVA (si applicable)** | _____ DA / € |
| **Total à Payer** | _____ DA / € |

---

## Livrables Complétés

### Infrastructure
- Serveur VPS Ubuntu prêt pour la production
- Panneau de contrôle HestiaCP configuré
- Serveur base de données MariaDB avec phpMyAdmin
- Serveur web Nginx avec proxy inverse
- Certificats SSL (renouvellement automatique)
- Interface bureau à distance (XFCE via RDP)

### Applications Déployées
- Strapi CMS v5 (API Backend sur port 1337)
- Frontend Next.js 15 (sur port 3000/3001)
- WordPress (shohraty.dz)
- Les deux gérés par PM2 avec auto-restart

### Services Additionnels
- Serveur FTP avec 3 comptes utilisateurs (accès isolé)
- Serveur mail pour leqta.com (SMTP/IMAP/POP3 avec SSL)
- Serveur mail pour shohraty.dz (SMTP/IMAP/POP3 avec SSL)
- Pipeline de déploiement automatisé
- Système de mode maintenance
- Pare-feu Ecosnet configuré

### Documentation
- 14+ fichiers de documentation complets
- Guides de configuration serveur
- Guides de dépannage
- Scripts d'automatisation de déploiement

---

## Domaines Configurés

| Domaine | Services | SSL |
|---------|----------|-----|
| leqta.com | Site web (Next.js) | Oui |
| api.leqta.com | API Strapi | Oui |
| mail.leqta.com | Serveur mail | Oui |
| webmail.leqta.com | Webmail | Oui |
| shohraty.dz | Site WordPress | Oui |
| mail.shohraty.dz | Serveur mail | Oui |

---

## Documentation Livrée

| Document | Objectif |
|----------|----------|
| DEPLOYMENT.md | Guide complet de déploiement VPS |
| VPS_DEPLOYMENT_GUIDE.md | Étapes détaillées déploiement Linux |
| SERVER_DEPLOYMENT.md | Déploiement serveur rapide |
| NGINX_CONFIG.md | Configuration Nginx HTTPS |
| FTP_SERVER_GUIDE.md | Guide utilisation serveur FTP |
| HESTIACP_SSL_FIX.md | Guide dépannage SSL |
| HESTIACP_PHPMYADMIN.md | Configuration phpMyAdmin |
| HESTIACP_MAIL_LOGS.md | Référence logs serveur mail |
| PV_VPS_CONFIGURATION.md | Procès-verbal configuration serveur |
| MAINTENANCE_MODE_SETUP.md | Implémentation mode maintenance |
| wordpress-installation-guide.md | Guide installation WordPress |

---

## Conditions de Paiement

- **Paiement Dû:** Dans les 15 jours suivant la date de facture
- **Mode de Paiement:** [Virement Bancaire / CCP / Espèces]
- **Retard de Paiement:** Intérêt mensuel de 1.5% sur les montants en retard

---

## Notes

1. Tous les identifiants serveur ont été partagés de manière sécurisée via [méthode]
2. Accès au panneau HestiaCP: https://server2.leqta.com:8083
3. Support inclus pendant 30 jours après déploiement pour les problèmes liés au déploiement
4. Travaux supplémentaires ou modifications seront facturés séparément

---

## Coordonnées Bancaires

**Banque:** [Nom de Votre Banque]
**Titulaire du Compte:** [Votre Nom]
**RIB:** [Votre RIB]
**Numéro de Compte:** [Votre Numéro]

Ou

**CCP:** [Votre Numéro CCP]

---

**Merci pour votre confiance !**

---

*Cette facture a été générée le 15 Décembre 2025*
