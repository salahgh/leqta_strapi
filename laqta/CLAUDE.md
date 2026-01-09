# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Laqta is a Next.js 16 marketing website for a creative agency offering content marketing and production services. The project uses React 19, Tailwind CSS for styling, and integrates with a Strapi CMS backend for dynamic content management.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **React**: React 19
- **Language**: TypeScript (with some legacy JSX files)
- **Styling**: Tailwind CSS 3.4 with custom design system
- **Forms**: Formik + Yup validation
- **CMS**: Strapi v5 (headless CMS at `http://localhost:1337`)
- **Internationalization**: next-intl with support for English (en), Arabic (ar), and French (fr)
- **Icons**: Lucide React

## Commands

### Development
```bash
npm run dev          # Start dev server on port 3000
npm run build        # Build for production
npm start            # Run production build on port 3001
npm run lint         # Run ESLint
```

### Strapi Backend
The project requires a local Strapi instance running on port 1337. Configure via `.env.local`:
```
NEXT_PUBLIC_STRAPI_URL_2=http://localhost:1337
```

## Architecture

### Directory Structure

```
├── src/
│   ├── app/[locale]/        # Next.js App Router with locale-based routing
│   │   ├── about/           # About page
│   │   ├── blog/            # Blog listing and articles
│   │   ├── services/        # Services page
│   │   ├── contact/         # Contact form
│   │   └── page.tsx         # Homepage
│   └── i18n/                # Internationalization configuration
├── components/
│   ├── icons/               # SVG icon components
│   ├── layout/              # Navigation, Footer, etc.
│   ├── sections/            # Page sections (HeroSection, ContactUs, etc.)
│   └── ui/                  # Reusable UI components (Button, FormInput, etc.)
├── lib/
│   ├── strapi.ts            # Strapi API client and TypeScript interfaces
│   └── utils.ts             # Utility functions
├── design/                  # Design tokens (partially implemented)
├── messages/                # Translation files for next-intl
└── public/                  # Static assets
```

### Routing & Internationalization

- Uses Next.js App Router with `[locale]` dynamic segment
- Middleware (`middleware.ts`) handles locale detection and routing
- Supported locales: `en` (default), `ar`, `fr`
- Locale routing configured in `src/i18n/routing.ts`
- Translation files stored in `messages/` directory

### Strapi CMS Integration

The `lib/strapi.ts` file provides typed API clients for:
- **Blogs**: Articles with categories, tags, authors, and featured images
- **Services**: Service offerings with descriptions and images
- **Works/Projects**: Portfolio items with categories and metrics
- **Testimonials**: Client testimonials
- **FAQs**: Frequently asked questions
- **Missions**: Company mission statements
- **Newsletter**: Email subscription management

All API functions support locale parameter for i18n content.

**Key API patterns:**
```typescript
// Fetch all items with pagination
await blogsApi.getAll({ page: 1, pageSize: 10, locale: 'en' });

// Fetch by slug
await blogsApi.getBySlug('article-slug', 'en');

// Fetch featured items
await worksApi.getFeatured({ pageSize: 6, locale: 'en' });

// Get full URL for uploaded files
utils.getFileUrl(image.url); // Prepends Strapi URL if needed
```

### Form Handling

Forms use Formik + Yup for validation:
1. Define validation schema with Yup
2. Use Formik's `useFormik` hook
3. Pass to `FormInput` components with error handling
4. Forms are located in respective page directories

### Design System

**Colors** (defined in `tailwind.config.js`):
- Primary: `#7F56D9` (purple gradient)
- Secondary: `#F4EBFF`
- Brand colors: blue, cyan, orange, yellow, green, red
- Neutral scale: 50-900

**Typography**:
- Primary font: Poppins
- Heading font: Gotham
- Custom sizes: `display-2xl` through `display-xs`, `body-xl` through `body-xs`

**Components**:
- `<Button>`: Variants (`primary`, `secondary`), sizes (`sm`, `md`, `lg`), supports icons
- `<FormInput>`: Text inputs and textareas with validation errors
- Consistent card components for services, projects, team members

## Key Patterns

### Component Organization
- **Layout components**: Structural (Navigation, Footer)
- **Section components**: Full-page sections (HeroSection, OurWorksSection)
- **UI components**: Reusable elements (Button, FormInput, Logo)

### TypeScript Usage
- Most components are TypeScript (.tsx)
- Some legacy JSX files remain (consider converting to .tsx)
- Strapi API responses are fully typed

### Styling Approach
- Use Tailwind utility classes exclusively
- Responsive: mobile-first with `md:`, `lg:`, etc.
- Custom design tokens in `tailwind.config.js`
- Avoid inline styles

## Configuration Notes

### Next.js Config (`next.config.ts`)
- `output: "standalone"` for Docker deployment
- TypeScript and ESLint errors ignored during builds (consider fixing)
- next-intl plugin configured
- Remote images allowed from Supabase storage

### Known Issues
- Build errors are currently ignored (`ignoreBuildErrors: true`)
- Some components need conversion from JSX to TSX
- Design token system in `design/tokens.ts` is not consistently used
- Standard `<img>` tags should be migrated to Next.js `<Image>` component

## Development Workflow

1. **Adding new pages**: Create in `src/app/[locale]/` with proper locale parameter
2. **CMS content**: Define TypeScript interfaces in `lib/strapi.ts` matching Strapi schema
3. **Translations**: Add keys to message files in `messages/[locale].json`
4. **Styling**: Follow existing Tailwind patterns, reference `DESIGN_SYSTEM.md`
5. **Forms**: Use Formik + Yup, follow patterns in contact/partnership forms

## Related Documentation

- `docs/DOCUMENTATION.md` - Detailed project documentation
- `DESIGN_SYSTEM.md` - Design system specifications (root)
- `docs/DEVELOPMENT_GUIDE.md` - Development best practices
- `docs/COMPONENTS.md` - Component documentation
- `docs/ENHANCEMENT_ROADMAP.md` - Future improvements
- `docs/COMPREHENSIVE_ANALYSIS_REPORT.md` - Full codebase analysis
- `docs/PHASE_1_IMPLEMENTATION_SUMMARY.md` - Phase 1 implementation details
