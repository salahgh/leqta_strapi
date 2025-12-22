# FACTURE / INVOICE

---

| | |
|---|---|
| **N° Facture / Invoice #:** | INV-2024-LAQTA-001 |
| **Date:** | 16 Decembre 2024 |
| **Projet / Project:** | Laqta - Site Web Marketing Multilingue |

---

## Description du Projet / Project Description

Developpement complet d'un site web marketing multilingue pour une agence creative, incluant:
- Site frontend Next.js 15 avec support RTL
- CMS Strapi v5 avec gestion de contenu
- Support 3 langues (Anglais, Arabe, Francais)
- Integration CRM Odoo
- Stockage Supabase

---

## Details des Travaux / Work Details

### 1. Configuration et Mise en Place du Projet

| Description | Details | Heures |
|-------------|---------|--------|
| Initialisation Next.js 15 | App Router, TypeScript, configuration | 2 |
| Configuration Strapi v5 | Installation, plugins, securite | 2 |
| Configuration TypeScript | Types, interfaces, tsconfig | 1 |
| Configuration Tailwind CSS | Design tokens, theme personnalise | 2 |
| Configuration environnement | Variables, .env, deployment | 1 |

**Sous-total: 8 heures = 400 DA**

---

### 2. Developpement Backend (Strapi CMS)

| Description | Details | Heures |
|-------------|---------|--------|
| **Content Types (11 types)** | | |
| - Blog | 14 champs + 3 relations, i18n | 4 |
| - Author | 6 champs + relation blogs | 2 |
| - Category | 9 champs, couleurs, SEO | 3 |
| - Tag | 4 champs, relation blogs | 1 |
| - Service | 11 champs, gradients, icones | 3 |
| - Project | 12 champs, metriques, SEO | 3 |
| - Testimonial | 7 champs, avatar, rating | 2 |
| - FAQ | 5 champs, categories | 2 |
| - Mission | 6 champs, icones | 2 |
| - Newsletter | 5 champs, statuts | 2 |
| - Social Media | 7 champs | 1 |
| **Controllers personnalises** | 26 methodes dans 10 fichiers | 6 |
| **Routes personnalisees** | 23 endpoints dans 9 fichiers | 4 |
| **Configuration base de donnees** | PostgreSQL + MySQL dual setup | 2 |
| **Configuration i18n** | 3 locales (en, ar, fr) | 1 |
| **Systeme de seeding** | 11 seeders + data files | 2 |

**Sous-total: 40 heures = 2,000 DA**

---

### 3. Developpement Frontend - Composants (60 composants)

| Categorie | Composants | LOC | Heures |
|-----------|------------|-----|--------|
| **Composants UI (24)** | | 1,626 | |
| - Button, Badge, Breadcrumbs | Variants, tailles, etats | | 4 |
| - FormInput, SubmitButton | Validation, erreurs | | 4 |
| - ServiceCard | Gradients, marquee, animations | | 6 |
| - ProjectCard | Images, descriptions | | 3 |
| - Logo, Avatar, ProfileAvatar | Responsive, variantes | | 2 |
| - LanguageSelector | Dropdown, drapeaux | | 3 |
| - SEO, ErrorBoundary, ErrorFallback | Meta, gestion erreurs | | 4 |
| - NewsletterForm, EmailSubscription | Formik, API | | 4 |
| - Autres (BackToTop, NavLink, etc.) | | | 4 |
| **Composants Sections (11)** | | ~1,200 | |
| - HeroSection | Navigation, animations, CTAs | | 6 |
| - ServicesSection | Grid, API fetch, fallback | | 4 |
| - OurWorksSection | Alternating layout, images | | 4 |
| - Footer | Newsletter, social, multi-colonnes | | 4 |
| - AboutLaqta, YourPerfectPartner | Gradients, badges | | 4 |
| **Composants Contact (12)** | | 1,679 | |
| - ContactUs (orchestrateur) | Multi-step, state management | | 6 |
| - PersonalInfoStep, CompanyInfoStep | Forms, validation | | 4 |
| - SocialMediaStep, ProjectDetailsStep | Forms, review | | 4 |
| - StepperComponent, ActionButtons | Navigation, UI | | 3 |
| - SuccessStep | Confirmation, animation | | 2 |
| **Composants Testimonials (6)** | | 366 | |
| - TestimonialsClient | Carousel, touch, keyboard | | 6 |
| - TestimonialCard, StarRating | Display, rating | | 2 |
| - PaginationDots | Navigation | | 1 |
| **Composants FAQ (5)** | | 243 | |
| - FAQSection, FAQSectionClient | Accordion, toggle | | 3 |
| - FAQItem | Animation, RTL | | 1 |
| **Layout (1)** | | ~350 | |
| - Navigation | Responsive, drawer, scroll | | 5 |

**Sous-total: 80 heures = 4,000 DA**

---

### 4. Developpement Pages (13 pages)

| Page | Fonctionnalites | Heures |
|------|-----------------|--------|
| Homepage (/) | 7 sections composites | 3 |
| About (/about) | Hero, Mission/Vision, Competitive Edge | 2 |
| Services (/services) | Plans, comparaisons | 2 |
| Services Detail (/services/[slug]) | Page dynamique | 2 |
| Blog Listing (/blog) | Featured, pagination, filtres | 3 |
| Blog All (/blog/all) | Archive, categories | 2 |
| Blog Article (/blog/articles/[slug]) | SEO, JSON-LD, TOC, progress | 4 |
| Contact (/contact) | Multi-step form | 2 |
| Partnership Form | Formulaire partenariat | 1 |
| Partners, Brands | Pages statiques | 1 |
| Works (/works/[slug]) | Portfolio detail | 2 |

**Sous-total: 24 heures = 1,200 DA**

---

### 5. Client API (lib/strapi.ts)

| Description | Details | Heures |
|-------------|---------|--------|
| Infrastructure fetch | Cache, revalidation, headers | 3 |
| blogsApi | 6 methodes (getAll, getBySlug, getFeatured, etc.) | 2 |
| servicesApi | 4 methodes | 1.5 |
| worksApi | 4 methodes | 1.5 |
| testimonialsApi | 3 methodes | 1 |
| faqsApi | 4 methodes | 1.5 |
| missionsApi | 3 methodes | 1 |
| categoriesApi, tagsApi | 2 methodes | 1 |
| newsletterApi | 2 methodes (subscribe, unsubscribe) | 1.5 |
| socialMediaApi, utils | Helpers | 1 |
| Interfaces TypeScript | 10+ types | 2 |

**Sous-total: 16 heures = 800 DA**

---

### 6. Systeme de Design

| Description | Details | Heures |
|-------------|---------|--------|
| Configuration Tailwind | Extend theme, plugins | 3 |
| Palette couleurs | Primary, secondary, accent, neutral | 2 |
| Typographie | Display scale, body scale, fonts | 2 |
| Spacing & Sizing | Custom scales, breakpoints | 2 |
| Animations | fade-in, slide-up, slide-down, marquee | 3 |
| Effets speciaux | Glassmorphism, gradients, glow | 2 |
| CSS Global | Variables, base styles | 2 |

**Sous-total: 16 heures = 800 DA**

---

### 7. Internationalisation (i18n)

| Description | Details | Heures |
|-------------|---------|--------|
| Configuration next-intl | Middleware, routing | 3 |
| Traductions Anglais | 221 cles, 32 namespaces | 5 |
| Traductions Arabe | 221 cles, revue RTL | 6 |
| Traductions Francais | 221 cles | 4 |
| Integration composants | useTranslations, locale params | 2 |

**Sous-total: 20 heures = 1,000 DA**

---

### 8. Support Arabe (RTL)

| Description | Details | Heures |
|-------------|---------|--------|
| CSS RTL global | Direction, alignement, marges | 2 |
| Police Alexandria | Google Fonts, titres | 1 |
| Police RH-ZAK | Telechargement, installation, @font-face | 2 |
| Composants RTL | FAQ, Testimonials, Blog, Forms | 4 |
| Carousel RTL | Navigation, swipe, keyboard | 2 |
| Hero Section | SVG arabe dynamique | 1 |

**Sous-total: 12 heures = 600 DA**

---

### 9. Formulaires et Validation

| Description | Details | Heures |
|-------------|---------|--------|
| Configuration Formik | Setup, helpers | 2 |
| Schemas Yup | Validation rules, messages | 3 |
| Contact Form | 5 etapes, state management | 6 |
| Newsletter Form | Subscription, API | 2 |
| Messages validation | 15+ messages par langue | 3 |

**Sous-total: 16 heures = 800 DA**

---

### 10. SEO et Performance

| Description | Details | Heures |
|-------------|---------|--------|
| generateMetadata | Pages dynamiques | 2 |
| OpenGraph, Twitter Cards | Images, descriptions | 1.5 |
| JSON-LD | Structured data articles | 1.5 |
| React cache() | Deduplication requetes | 1 |
| Image optimization | Next/Image, Supabase | 1 |
| Static generation | generateStaticParams | 1 |

**Sous-total: 8 heures = 400 DA**

---

### 11. Integrations Tierces

| Description | Details | Heures |
|-------------|---------|--------|
| Odoo CRM | XML-RPC client, auth, leads | 6 |
| Supabase Storage | Configuration, upload | 3 |
| Google Fonts | Poppins, Alexandria | 1 |
| API Routes Next.js | /api/odoo/contact, /api/health | 2 |

**Sous-total: 12 heures = 600 DA**

---

### 12. Tests et Debogage

| Description | Details | Heures |
|-------------|---------|--------|
| Tests manuels | Toutes les pages, tous les locales | 6 |
| Correction bugs | Images, RTL, carousel, fonts | 6 |
| Tests responsifs | Mobile, tablet, desktop | 2 |
| Tests cross-browser | Chrome, Firefox, Safari | 2 |

**Sous-total: 16 heures = 800 DA**

---

### 13. Documentation

| Description | Details | Heures |
|-------------|---------|--------|
| Guide utilisateur | CMS, features, troubleshooting | 4 |
| Documentation technique | Architecture, API | 2 |
| CLAUDE.md | Instructions projet | 2 |

**Sous-total: 8 heures = 400 DA**

---

## Resume / Summary

| Categorie | Heures | Montant |
|-----------|--------|---------|
| Configuration et Mise en Place | 8 | 400 DA |
| Developpement Backend (Strapi) | 40 | 2,000 DA |
| Developpement Composants (60) | 80 | 4,000 DA |
| Developpement Pages (13) | 24 | 1,200 DA |
| Client API | 16 | 800 DA |
| Systeme de Design | 16 | 800 DA |
| Internationalisation (3 langues) | 20 | 1,000 DA |
| Support Arabe (RTL) | 12 | 600 DA |
| Formulaires et Validation | 16 | 800 DA |
| SEO et Performance | 8 | 400 DA |
| Integrations Tierces | 12 | 600 DA |
| Tests et Debogage | 16 | 800 DA |
| Documentation | 8 | 400 DA |

---

## TOTAL

| | |
|---|---|
| **Total Heures:** | 276 heures |
| **Taux Horaire:** | 50 DA/heure |
| **TOTAL A PAYER:** | **13,800 DA** |

---

## Livrables Inclus / Deliverables

1. Code source complet (Frontend + Backend)
2. 60 composants React reutilisables
3. 11 types de contenu Strapi configures
4. Support 3 langues avec RTL
5. Systeme de design Tailwind personnalise
6. Integration CRM Odoo
7. Documentation complete

---

## Statistiques du Projet / Project Statistics

| Metrique | Valeur |
|----------|--------|
| Lignes de code (Frontend) | ~5,700 LOC |
| Lignes de code (API Client) | 1,033 LOC |
| Composants React | 60 |
| Pages | 13 |
| Types de contenu Strapi | 11 |
| Endpoints API personnalises | 25+ |
| Cles de traduction | 663 (221 x 3 langues) |
| Fichiers de configuration | 15+ |

---

*Facture generee le 16 Decembre 2024*
