# Laqta Website - User Guide

## Overview

Laqta is a multilingual marketing website for a creative agency, built with Next.js 15 and Strapi CMS. The website supports three languages: English (default), Arabic, and French.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Content Management (Strapi CMS)](#content-management-strapi-cms)
3. [Managing Content Types](#managing-content-types)
4. [Multilingual Content](#multilingual-content)
5. [Design System](#design-system)
6. [Features Overview](#features-overview)

---

## Getting Started

### Prerequisites

- Node.js 20.x
- npm 10.x
- PostgreSQL (for development)

### Starting the Backend (Strapi CMS)

```bash
cd my-blog-cms
npm install
npm run develop
```

Access Strapi Admin: `http://localhost:1337/admin`

### Starting the Frontend (Next.js)

```bash
cd laqta
npm install
npm run dev
```

Access Website: `http://localhost:3000`

---

## Content Management (Strapi CMS)

### Accessing the Admin Panel

1. Navigate to `http://localhost:1337/admin`
2. Log in with your admin credentials
3. Use the Content Manager to manage all content

### Content Types Available

| Content Type | Description |
|--------------|-------------|
| **Blog** | Blog articles with categories, tags, and authors |
| **Service** | Service offerings with descriptions and images |
| **Project** | Portfolio/work items |
| **Testimonial** | Customer testimonials and reviews |
| **FAQ** | Frequently asked questions |
| **Mission** | Company mission statements |
| **Author** | Blog post authors |
| **Category** | Blog categories |
| **Tag** | Blog tags |
| **Newsletter** | Email subscriptions |

---

## Managing Content Types

### Services

Each service includes:
- **Title**: Service name (localized)
- **Description**: Service description (localized)
- **Icon Image**: Upload a logo/icon from CMS
- **Featured Image**: Main service image
- **Gradient Colors**:
  - `gradientFrom`: Starting color (color picker)
  - `gradientTo`: Ending color (color picker)
- **Tags**: Array of service tags (displayed as scrolling marquee)
- **Order**: Display order (lower numbers appear first)

**To add a service:**
1. Go to Content Manager → Services
2. Click "Create new entry"
3. Fill in all fields
4. Upload icon_image and featured_image
5. Set gradient colors using the color picker
6. Add tags as a JSON array: `["Tag 1", "Tag 2", "Tag 3"]`
7. Save and Publish

### Testimonials

Each testimonial includes:
- **Testimonial**: The quote text (localized)
- **Author**: Author name (localized)
- **Role**: Author's job title (localized)
- **Avatar**: Author's photo (**NOT localized** - upload once in English)
- **Company**: Company name (localized)
- **Rating**: 1-5 stars (NOT localized)
- **Featured**: Boolean flag (NOT localized)

**Important:** Avatar, Rating, and Featured are shared across all languages. Upload the avatar only in the English version.

**To add a testimonial:**
1. Go to Content Manager → Testimonials
2. Create the **English version first**
3. Upload the avatar image in English
4. Save and Publish
5. Create Arabic/French localizations (avatar will be inherited)

### Blog Articles

Each article includes:
- **Title**: Article title
- **Slug**: URL-friendly identifier
- **Excerpt**: Short summary
- **Content**: Rich text content
- **Header Image**: Featured image
- **Read Time**: Estimated reading time
- **Author**: Select from Authors
- **Category**: Select from Categories
- **Tags**: Select multiple tags
- **Featured**: Mark as featured article

**To add a blog post:**
1. Create Author, Category, and Tags first
2. Go to Content Manager → Blogs
3. Create new entry with all required fields
4. Link to author, category, and tags
5. Save and Publish

### FAQs

Each FAQ includes:
- **Question**: The question text (localized)
- **Answer**: The answer text (localized)
- **Category**: Optional category
- **Order**: Display order
- **Featured**: Show on homepage

---

## Multilingual Content

### Supported Languages

| Code | Language | Direction |
|------|----------|-----------|
| `en` | English | LTR (Left-to-Right) |
| `ar` | Arabic | RTL (Right-to-Left) |
| `fr` | French | LTR (Left-to-Right) |

### Creating Localized Content

1. **Create English version first** (default locale)
2. Save and Publish the English version
3. Click "Localization" in the right sidebar
4. Select "Arabic" or "French"
5. Translate the content
6. Save and Publish each localization

### Non-Localized Fields

Some fields are shared across all languages:
- **Images/Media**: Upload once, shared everywhere
- **Rating**: Same value for all languages
- **Featured flags**: Same for all languages
- **Order fields**: Same for all languages

---

## Design System

### Typography

#### English/French
- **Font**: Poppins (all text)

#### Arabic
- **Titles (h1-h6)**: Alexandria (Google Fonts)
- **Body text**: RH-ZAK (custom font)

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Navy | `#0D1137` | Headers, backgrounds |
| Primary Blue | `#1370AD` | Links, accents |
| Aqua | `#94D7E0` | Secondary elements |
| Yellow | `#EFD27E` | Highlights |
| Pink | `#E438D5` | Accents |

### Gradients

Service cards support custom gradients:
- Set `gradientFrom` and `gradientTo` in the CMS
- Gradient appears as an overlay above the image

---

## Features Overview

### Hero Section
- Displays localized SVG title (English or Arabic version)
- Animated elements with fade/slide effects
- CTA buttons: "Get Started" and "Contact Us"

### Services Section
- Grid layout of service cards
- Each card shows:
  - Gradient overlay (customizable colors)
  - Icon from CMS
  - Service title
  - Scrolling tags (marquee animation)
  - Laqta logo watermark

### Testimonials Carousel
- Auto-rotating testimonials (5-second interval)
- Navigation arrows (left/right)
- Pagination dots
- Swipe support on mobile
- Keyboard navigation (arrow keys)
- RTL-aware navigation

### Blog Section
- Featured articles grid
- Category filtering
- Tag filtering
- Search functionality
- Pagination
- Individual article pages with:
  - Table of contents
  - Reading progress indicator
  - Social sharing
  - Related articles

### FAQ Section
- Accordion-style expandable questions
- Smooth animations
- RTL-aligned for Arabic

### Contact Form
- Multi-step form wizard
- Form validation (Formik + Yup)
- Steps: Personal Info → Company Info → Project Details → Budget

### Footer
- Company information
- Navigation links
- Social media icons (right-aligned)
- Newsletter subscription

---

## RTL Support (Arabic)

The website fully supports Arabic with:

### Automatic RTL Layout
- Page direction automatically set to RTL for Arabic
- All layouts mirror correctly
- Text alignment adjusted

### Arabic Fonts
- **Titles**: Alexandria (clean, modern look)
- **Body**: RH-ZAK (optimized for readability)

### Component Adjustments
- FAQ toggle icons rotate correctly
- Testimonial carousel navigation adapted
- Blog article images mirror in RTL
- Form inputs align correctly

---

## Troubleshooting

### Images Not Loading
1. Check Strapi is running on port 1337
2. Verify `.env.local` has correct `NEXT_PUBLIC_STRAPI_URL_2`
3. Ensure images are published in Strapi

### Translations Not Showing
1. Verify content exists for the selected locale in Strapi
2. Check localizations are properly linked
3. Ensure all localized entries are published

### Arabic Fonts Not Loading
1. Verify font files exist in `laqta/public/fonts/`
   - `RH-ZAK.otf`
   - `RH-ZAK-Bold.otf`
2. Clear browser cache and Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

### Testimonial Avatars Not Showing for Arabic/French
1. Upload avatar in the **English** version first
2. The system will automatically use English avatars for other locales
3. Make sure English testimonials are published

---

## File Locations

### Frontend (laqta/)
```
laqta/
├── src/app/[locale]/     # Page routes
├── components/           # React components
├── lib/strapi.ts         # API client
├── styles/globals.css    # Global styles
├── public/fonts/         # Custom fonts
├── public/images/        # Static images
└── messages/             # Translation files
```

### Backend (my-blog-cms/)
```
my-blog-cms/
├── src/api/              # Content type definitions
├── config/               # Strapi configuration
└── public/uploads/       # Uploaded media
```

---

## Support

For technical issues or questions:
1. Check the `docs/` folder for additional documentation
2. Review `CLAUDE.md` files in each project directory
3. Check console logs for error messages

---

*Last updated: December 16, 2024*
