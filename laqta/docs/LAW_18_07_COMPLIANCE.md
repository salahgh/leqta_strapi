# Law 18-07 Compliance Implementation

## Overview

This document describes the implementation of Algerian Law No. 18-07 (Personal Data Protection Law) compliance features on the Leqta website.

**Law Reference:** Algerian Law No. 18-07 dated June 10, 2018, relating to the protection of natural persons with regard to the processing of personal data.

## Compliance Features Implemented

### 1. Cookie Consent Banner

**Location:** `laqta/components/ui/CookieConsent.tsx`

- Appears on first visit before any tracking
- Explicit consent required (not pre-checked)
- Three options: Accept All, Reject All, Manage Preferences
- Cookie preference management panel with granular control:
  - Necessary Cookies (always active)
  - Analytics Cookies (Google Analytics)
  - Marketing Cookies (Meta Pixel, TikTok Pixel)
- Law 18-07 reference displayed prominently
- Link to Privacy Policy
- User rights notice
- RTL support for Arabic
- Multilingual (EN/FR/AR)

**CMS Integration:** Content managed via Strapi `cookie-consent` single type with full i18n support.

### 2. Conditional Tracking Scripts

**Location:** `laqta/components/ui/TrackingScripts.tsx`

Tracking scripts are **only loaded after explicit consent**:
- **Google Analytics:** Loaded only if analytics consent given
- **Meta Pixel:** Loaded only if marketing consent given
- **TikTok Pixel:** Loaded only if marketing consent given

Environment variables required:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXX
NEXT_PUBLIC_TIKTOK_PIXEL_ID=XXXXXXXXXXXXXXXX
```

### 3. Form Consent Requirements

All forms collecting personal data now require explicit consent before submission:

#### Newsletter Form
**Location:** `laqta/components/ui/NewsletterForm.tsx`
- Consent checkbox with Privacy Policy link
- Form cannot be submitted without consent
- Compact checkbox design for both footer and blog variants

#### Partnership Form
**Location:** `laqta/src/app/[locale]/PartenerShipForm/page.tsx`
- Full consent section before submit button
- Data Controller Info component displayed
- Consent checkbox required for submission

#### Contact Form (Multi-step)
**Location:** `laqta/components/sections/contact/ProjectDetailsStep.tsx`
- Consent integrated in final step (Project Details)
- Data Controller Info displayed before submission
- Consent validation required to proceed

### 4. Reusable Consent Components

#### ConsentCheckbox
**Location:** `laqta/components/ui/ConsentCheckbox.tsx`
- Reusable checkbox with Privacy Policy link
- NOT pre-checked (Law 18-07 requirement)
- Touch-friendly (44px minimum target)
- RTL support for Arabic
- Two variants: `full` and `compact`

#### DataControllerInfo
**Location:** `laqta/components/ui/DataControllerInfo.tsx`
- Displays required legal information:
  - Data controller: Leqta (لقطة) – Algeria
  - Purpose of data collection
  - Data rights contact: data@leqta.com
  - Privacy Policy link
- Two variants: `full` and `compact`

### 5. Translations

All compliance text is available in three languages:

**English** (`laqta/messages/en.json`):
- `cookieConsent` section
- `formConsent` section

**French** (`laqta/messages/fr.json`):
- `cookieConsent` section
- `formConsent` section

**Arabic** (`laqta/messages/ar.json`):
- `cookieConsent` section
- `formConsent` section

### 6. CMS Seeder

**Location:** `my-blog-cms/src/seeds/`
- `data/cookieConsent.ts` - Cookie consent content for all locales
- `seeders/cookieConsentSeeder.ts` - Creates content in Strapi

## File Structure

```
laqta/
├── components/ui/
│   ├── ConsentCheckbox.tsx        # Reusable consent checkbox
│   ├── DataControllerInfo.tsx     # Data controller display
│   ├── CookieConsent.tsx          # Cookie consent banner
│   ├── CookieConsentWrapper.tsx   # Server component wrapper
│   ├── TrackingScripts.tsx        # Conditional script loader
│   └── NewsletterForm.tsx         # Updated with consent
├── components/sections/contact/
│   ├── ContactUs.tsx              # Updated interface
│   └── ProjectDetailsStep.tsx     # Updated with consent
├── src/app/[locale]/
│   ├── PartenerShipForm/page.tsx  # Updated with consent
│   └── layout.tsx                 # TrackingScripts added
├── messages/
│   ├── en.json                    # English translations
│   ├── fr.json                    # French translations
│   └── ar.json                    # Arabic translations
└── docs/
    └── LAW_18_07_COMPLIANCE.md    # This file

my-blog-cms/
└── src/seeds/
    ├── data/cookieConsent.ts      # Seed data
    └── seeders/
        ├── cookieConsentSeeder.ts # Seeder logic
        └── index.ts               # Updated with seeder
```

## Testing Checklist

### Cookie Consent
- [ ] Banner appears on first visit
- [ ] Banner does not appear after accepting/rejecting
- [ ] Clear localStorage, reload - banner reappears
- [ ] "Accept All" enables all tracking
- [ ] "Reject All" blocks all tracking
- [ ] Preference toggles work correctly
- [ ] Banner displays correctly in RTL (Arabic)

### Tracking Scripts
- [ ] No tracking scripts loaded before consent
- [ ] Google Analytics loads only with analytics consent
- [ ] Meta Pixel loads only with marketing consent
- [ ] TikTok Pixel loads only with marketing consent
- [ ] Scripts removed when consent withdrawn

### Forms
- [ ] Newsletter: Cannot submit without consent
- [ ] Partnership: Cannot submit without consent
- [ ] Contact: Cannot submit without consent
- [ ] Error messages display for unchecked consent
- [ ] Privacy Policy links work in all forms

### Multilingual
- [ ] All text displays correctly in English
- [ ] All text displays correctly in French
- [ ] All text displays correctly in Arabic
- [ ] RTL layout correct for Arabic

## Compliance Summary

| Requirement | Status |
|-------------|--------|
| Explicit consent before data processing | ✅ Implemented |
| Clear information about data collection | ✅ Implemented |
| Granular consent options | ✅ Implemented |
| Right to withdraw consent | ✅ Implemented |
| Data controller identification | ✅ Implemented |
| Purpose of processing clearly stated | ✅ Implemented |
| Contact for data rights | ✅ Implemented |
| Privacy Policy accessible | ✅ Implemented |
| Consent not pre-checked | ✅ Implemented |
| Multilingual support | ✅ Implemented |

## Data Controller Contact

For data protection inquiries:
- **Email:** data@leqta.com
- **Entity:** Leqta (لقطة) – Algeria

## Related Documentation

- Privacy Policy: `/PrivacyPolicy` page
- Cookie Policy: Within cookie consent banner
- Strapi Cookie Consent API: `api/cookie-consent`
