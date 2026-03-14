# Pricing - Added Features

**Date**: 17/02/2026
**Project**: LEQTA - Marketing Website

---

## 1. Cookie Consent Banner (Law 18-07) - Frontend

| Task | Amount (DZD) |
|------|--------------|
| Cookie consent banner (accept, reject, privacy policy link) | 2 000 |
| Consent state persistence (localStorage) | 1 000 |
| Dynamic consent checkbox (newsletter, contact form) | 2 000 |
| Data controller information notice | 1 000 |
| **Subtotal** | **5 000** |

## 2. Cookie Consent Banner (Law 18-07) - Strapi Backend

| Task | Amount (DZD) |
|------|--------------|
| Cookie Consent single type (17 localized fields: titles, descriptions, button texts, cookie categories) | 4 000 |
| Custom routes and controllers | 1 000 |
| i18n configuration (EN/AR/FR) | 1 000 |
| **Subtotal** | **6 000** |

## 3. Service Page - Frontend

| Task | Amount (DZD) |
|------|--------------|
| Services listing page (responsive grid, animations) | 3 000 |
| Service detail page (hero, featured image, rich text content) | 5 000 |
| Video support (uploaded video + YouTube/Vimeo embed) | 2 000 |
| Pricing plans section (ServicePlanCard, responsive grid) | 2 000 |
| ServiceCard component (gradient styling, tags, icons) | 2 000 |
| Homepage services section (top 3 featured, CTA) | 2 000 |
| Frontend Strapi API client + TypeScript types | 2 000 |
| i18n translations (EN/AR/FR) | 2 000 |
| Floating CTA button (scroll-to-target, auto-hide on section visibility) | 2 000 |
| **Subtotal** | **22 000** |

## 4. Service Page - Strapi Backend

| Task | Amount (DZD) |
|------|--------------|
| Plan content type (pricing plans with sections, features, custom pricing) | 1 000 |
| Plan-Section component (repeatable sections with feature points) | 1 000 |
| Service-Plan many-to-many relation | 1 000 |
| **Subtotal** | **3 000** |

## 5. Work Page - Free of Charge

### Frontend
- Works listing page (responsive grid, animations)
- Project detail page (hero, featured image, rich text markdown, metrics)
- ProjectCard component (image, category badge, alternating left/right layout)
- WorkContent client component (styled markdown rendering)
- Frontend Strapi API client + TypeScript types (worksApi)
- i18n translations (EN/AR/FR)

### Strapi Backend
- Project content type (title, slug, category, description, content, metrics, SEO fields, i18n)
- Custom controller (findByTitle, findByCategory, findFeatured, findBySlug)
- Custom routes (4 public endpoints)

## 6. CMS-Managed Tracking Pixels (GA, Meta, TikTok)

| Task | Amount (DZD) |
|------|--------------|
| Tracking Pixel single type in Strapi (6 fields: 3 pixel IDs + 3 enable/disable toggles) | 2 000 |
| Custom controller, service, and routes (public GET endpoint) | 1 000 |
| Cache revalidation lifecycle hooks (auto-invalidate Next.js cache on CMS update) | 1 000 |
| Frontend API client + TypeScript types (trackingPixelApi) | 1 000 |
| TrackingScripts update (CMS config prop with env variable fallback) | 1 000 |
| TrackingScriptsWrapper server component + layout integration | 1 000 |
| **Subtotal** | **7 000** |

## 7. Coming Soon Page - Free of Charge

- ComingSoon reusable component
- Animated countdown timer
- i18n translations (EN/AR/FR)

## 8. Maintenance Mode - Free of Charge

- Maintenance mode toggle and page
- Admin-controlled activation

---

**Total: 43 000 DZD**
