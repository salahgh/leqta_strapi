# FACTURE - Déploiement et Configuration Serveur VPS

**Numéro de Facture:** FACT-2025-001
**Date:** Décembre 2025
**Serveur:** VPS Ubuntu avec HestiaCP (server2.leqta.com - 197.140.18.185)

---

## Informations Client

**Client:** [Nom du Client]
**Projets:** Laqta Creative Agency + Shohraty + Infrastructure VPS

---

## Informations Développeur

**Développeur:** [Votre Nom]
**Fonction:** Développeur Logiciel Freelance
**Contact:** [Votre Email / Téléphone]

---

# SECTION A : Projet Laqta (leqta.com)

*Site web marketing multilingue avec CMS headless*

| # | Service | Description | Heures |
|---|---------|-------------|--------|
| A1 | **Déploiement Strapi CMS** | Installation backend, configuration environnement production, build admin panel, intégration Supabase Storage | 3 |
| A2 | **Déploiement Frontend Next.js** | Installation frontend Next.js 15, configuration i18n (EN/AR/FR), build production | 2.5 |
| A3 | **Configuration PM2** | Configuration gestionnaire processus, auto-restart, monitoring, logs | 1 |
| A4 | **Configuration Nginx (Laqta)** | Proxy inverse pour Next.js et Strapi API, support WebSocket, cache statique | 2 |
| A5 | **Base de Données Laqta** | Création base MariaDB `laqta_strapi`, utilisateur avec permissions | 1 |
| A6 | **Certificats SSL Laqta** | Let's Encrypt pour leqta.com, api.leqta.com, www.leqta.com | 1 |
| A7 | **Serveur Mail Laqta** | Configuration Exim4/Dovecot, SSL, DNS (MX, SPF, DMARC, DKIM) | 2.5 |
| A8 | **Webmail Laqta** | Configuration webmail.leqta.com avec Roundcube | 0.5 |
| A9 | **Mode Maintenance** | Système bypass par cookie, page maintenance, intégration Nginx | 1.5 |
| A10 | **Scripts Déploiement** | Scripts automatisés deploy.sh, setup.sh pour mises à jour | 2 |
| A11 | **Documentation Laqta** | Guides déploiement, configuration, dépannage | 2 |

### Sous-total Section A

| Élément | Valeur |
|---------|--------|
| **Heures Laqta** | 19 |
| **Taux Horaire** | _____ DA/€ |
| **Sous-total A** | _____ DA/€ |

---

# SECTION B : Projet Shohraty (shohraty.dz)

*Migration et hébergement site WordPress*

| # | Service | Description | Heures |
|---|---------|-------------|--------|
| B1 | **Migration WordPress** | Transfert fichiers (thèmes, plugins, uploads), restauration contenu | 2 |
| B2 | **Migration Base de Données** | Export/import base MySQL, mise à jour URLs, vérification intégrité | 1.5 |
| B3 | **Configuration wp-config.php** | Paramètres connexion BDD, clés sécurité, configuration URLs | 0.5 |
| B4 | **Configuration Nginx WordPress** | Règles réécriture permaliens, cache statique, sécurité fichiers | 1 |
| B5 | **Certificats SSL Shohraty** | Let's Encrypt pour shohraty.dz, www.shohraty.dz | 0.5 |
| B6 | **Serveur Mail Shohraty** | Configuration Exim4/Dovecot avec SSL pour mail.shohraty.dz | 2 |
| B7 | **DNS Mail Shohraty** | Configuration enregistrements MX, SPF, DMARC, DKIM | 1 |
| B8 | **Tests Post-Migration** | Vérification pages, liens, images, formulaires, plugins | 1 |

### Sous-total Section B

| Élément | Valeur |
|---------|--------|
| **Heures Shohraty** | 9.5 |
| **Taux Horaire** | _____ DA/€ |
| **Sous-total B** | _____ DA/€ |

---

# SECTION C : Infrastructure VPS Générale

*Configuration serveur et services partagés*

| # | Service | Description | Heures |
|---|---------|-------------|--------|
| C1 | **Configuration Initiale VPS** | Mises à jour système, installation Node.js 20.x, Git, outils compilation | 2 |
| C2 | **Installation HestiaCP** | Panneau de contrôle, gestion utilisateurs, configuration initiale | 2 |
| C3 | **Configuration MariaDB** | Installation serveur BDD, sécurisation, phpMyAdmin | 1.5 |
| C4 | **Serveur FTP (vsftpd)** | Installation, 3 comptes utilisateurs, chroot jail, isolation accès | 3 |
| C5 | **Bureau à Distance** | Installation XFCE, configuration xrdp, accès RDP port 3389 | 2 |
| C6 | **Pare-feu Ecosnet** | Configuration ports dans tableau de bord fournisseur VPS | 1.5 |
| C7 | **Pare-feu Local (UFW)** | Configuration règles iptables/UFW via HestiaCP | 1 |
| C8 | **Sécurisation Serveur** | Hardening SSH, fail2ban, permissions, bonnes pratiques | 1.5 |
| C9 | **Résolution Problèmes SSL** | Correction erreur Dovecot SSL, réparation OpenSSL config | 1.5 |
| C10 | **Documentation VPS** | Guides configuration serveur, procès-verbal, références | 2 |
| C11 | **Tests et Vérification** | Tests bout-en-bout, health checks, validation déploiement | 1.5 |

### Sous-total Section C

| Élément | Valeur |
|---------|--------|
| **Heures VPS** | 19.5 |
| **Taux Horaire** | _____ DA/€ |
| **Sous-total C** | _____ DA/€ |

---

# RÉCAPITULATIF GÉNÉRAL

| Section | Description | Heures | Montant |
|---------|-------------|--------|---------|
| **A** | Projet Laqta (leqta.com) | 19 | _____ DA/€ |
| **B** | Projet Shohraty (shohraty.dz) | 9.5 | _____ DA/€ |
| **C** | Infrastructure VPS Générale | 19.5 | _____ DA/€ |
| | | | |
| | **TOTAL HEURES** | **48** | |
| | **TOTAL HT** | | _____ DA/€ |
| | **TVA (19%)** | | _____ DA/€ |
| | **TOTAL TTC** | | _____ DA/€ |

---

## Livrables par Projet

### Projet Laqta
- Site Next.js 15 multilingue (EN/AR/FR)
- API Strapi CMS v5 avec panneau admin
- Serveur mail leqta.com avec SSL
- Scripts déploiement automatisé
- Mode maintenance avec bypass

### Projet Shohraty
- Site WordPress migré et fonctionnel
- Base de données restaurée
- Serveur mail shohraty.dz avec SSL
- Certificats SSL actifs

### Infrastructure VPS
- Serveur Ubuntu configuré avec HestiaCP
- Serveur FTP avec 3 comptes isolés
- Bureau à distance (XFCE/RDP)
- Pare-feu double couche (Ecosnet + local)
- Documentation complète

---

## Conditions de Paiement

- **Paiement Dû:** Dans les 15 jours suivant la date de facture
- **Mode de Paiement:** [Virement Bancaire / CCP / Espèces]
- **Retard de Paiement:** Intérêt mensuel de 1.5% sur les montants en retard

---

## Coordonnées Bancaires

**Banque:** [Nom de Votre Banque]
**Titulaire:** [Votre Nom]
**RIB:** [Votre RIB]

Ou **CCP:** [Votre Numéro CCP]

---

**Merci pour votre confiance !**

*Facture générée le 15 Décembre 2025*
