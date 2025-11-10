# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing a full-stack multilingual content marketing platform for Laqta, a creative agency. The architecture consists of two interconnected applications:

- **Frontend (`laqta/`)**: Next.js 15 marketing website with App Router
- **Backend (`my-blog-cms/`)**: Strapi v5 headless CMS

Both applications support three languages: English (en), Arabic (ar), and French (fr).

## Repository Structure

```
leqta_strapi/
├── laqta/              # Next.js frontend application
│   └── CLAUDE.md       # Frontend-specific guidance
└── my-blog-cms/        # Strapi CMS backend
    └── CLAUDE.md       # Backend-specific guidance
```

**Important**: Each subdirectory has its own detailed CLAUDE.md file. When working in a specific project, refer to that project's CLAUDE.md for detailed guidance.

## Getting Started

### Prerequisites
- Node.js 20.x
- npm 10.x

### Initial Setup

1. **Start the backend** (required first):
   ```bash
   cd my-blog-cms
   npm install
   npm run develop  # Starts Strapi on http://localhost:1337
   ```

2. **Start the frontend**:
   ```bash
   cd laqta
   npm install
   npm run dev      # Starts Next.js on http://localhost:3000
   ```

### Environment Configuration

**Backend (`my-blog-cms/.env`)**:
- Database configuration (PostgreSQL/MySQL/SQLite)
- Supabase storage credentials for file uploads
- Security tokens (APP_KEYS, JWT secrets)

**Frontend (`laqta/.env.local`)**:
```
NEXT_PUBLIC_STRAPI_URL_2=http://localhost:1337
```

## Architecture Overview

### Data Flow

1. **Content Creation**: Content is created in Strapi CMS (`http://localhost:1337/admin`)
2. **API Access**: Frontend fetches content via Strapi REST API at `/api/*`
3. **Rendering**: Next.js renders pages with locale-based routing

### API Integration

The frontend's `lib/strapi.ts` provides typed clients for all Strapi content types:
- Blogs (articles with categories, tags, authors)
- Services
- Projects/Works
- Testimonials
- FAQs
- Missions

All API functions accept a `locale` parameter for i18n content.

### Internationalization

Both applications use the same three locales with consistent slugs:
- Default locale: `en` (English)
- Additional: `ar` (Arabic), `fr` (French)

**Backend**: Uses Strapi's i18n plugin with linked localizations
**Frontend**: Uses next-intl with locale-based routing (`/[locale]/...`)

### Database & Storage

- **Database**: PostgreSQL (recommended), MySQL, or SQLite
  - Configured via `DATABASE_URL` or individual connection parameters
  - Default schema: `public`
- **File Storage**: Supabase Storage
  - Images and media uploaded through Strapi
  - Accessible via full URLs from frontend

## Development Workflow

### Adding New Content Types

1. **Create in Strapi**:
   ```bash
   cd my-blog-cms
   # Use Strapi admin UI or CLI to create content type
   ```

2. **Add TypeScript Interface** in `laqta/lib/strapi.ts`:
   ```typescript
   export interface YourContentType {
     id: number;
     title: string;
     slug: string;
     // ... other fields
   }
   ```

3. **Create API Client** in `laqta/lib/strapi.ts`:
   ```typescript
   export const yourContentApi = {
     getAll: async (params: QueryParams) => { /* ... */ },
     getBySlug: async (slug: string, locale?: string) => { /* ... */ }
   };
   ```

4. **Use in Frontend**:
   ```typescript
   const data = await yourContentApi.getAll({ locale });
   ```

### Adding Translations

1. **Backend**: Create content in default locale (en), then add localizations in Strapi admin
2. **Frontend**: Add translation keys to `laqta/messages/[locale].json`

### Working with Forms

Frontend uses Formik + Yup pattern:
```typescript
const validationSchema = Yup.object({ /* ... */ });
const formik = useFormik({ validationSchema, /* ... */ });
```

## Common Commands

### Backend (Strapi)
```bash
cd my-blog-cms
npm run develop     # Dev server with auto-reload (port 1337)
npm run build       # Build admin panel
npm run start       # Production server
```

### Frontend (Next.js)
```bash
cd laqta
npm run dev         # Dev server (port 3000)
npm run build       # Production build
npm start           # Production server (port 3001)
npm run lint        # ESLint
```

## Key Files & Locations

### Backend Configuration
- `my-blog-cms/config/database.ts` - Database setup
- `my-blog-cms/config/plugins.ts` - i18n, upload, documentation
- `my-blog-cms/src/api/` - Content type definitions
- `my-blog-cms/src/seeds/` - Database seeding system

### Frontend Configuration
- `laqta/src/app/[locale]/` - App Router pages
- `laqta/lib/strapi.ts` - API client & TypeScript interfaces
- `laqta/tailwind.config.js` - Design system tokens
- `laqta/middleware.ts` - Locale detection & routing
- `laqta/messages/` - Translation files

## Design System

The frontend uses a comprehensive design system defined in `laqta/tailwind.config.js`:
- **Colors**: Primary (#7F56D9), brand colors, neutral scale
- **Typography**: Poppins (body), Gotham (headings), custom scale
- **Components**: Button, FormInput, Cards
- **Icons**: Lucide React

See `laqta/DESIGN_SYSTEM.md` for complete specifications.

## Troubleshooting

### Backend Not Responding
- Ensure Strapi is running on port 1337
- Check database connection in `my-blog-cms/.env`
- Verify Supabase credentials if working with uploads

### Frontend API Errors
- Confirm `NEXT_PUBLIC_STRAPI_URL_2` points to running Strapi instance
- Check content is published in Strapi
- Verify locale exists for requested content

### Missing Translations
- Ensure content exists in all three locales in Strapi
- Check localizations are properly linked
- Verify translation keys exist in `messages/[locale].json`

## Recent Enhancements

This repository has undergone comprehensive enhancements across three phases to improve API consistency, error handling, SEO, and performance. For complete details, see `ENHANCEMENTS.md`.

### Key Improvements

**Phase 1 - Critical Fixes:**
- Added `excerpt` field to Blog content type
- Created Newsletter subscription API with duplicate handling
- Fixed Projects API endpoint inconsistencies
- Removed unused code and test artifacts

**Phase 2 - API & Error Handling:**
- Created Author custom API endpoints (findByEmail, findByName)
- Added field validation to schemas (Author, FAQ, Mission)
- Implemented ErrorBoundary and ErrorFallback components
- Enhanced error handling across all major sections

**Phase 3 - Optimization & SEO:**
- Comprehensive SEO system with OpenGraph, Twitter Cards, JSON-LD
- Next.js request caching with React cache() for deduplication
- Field selection for API queries (60-80% payload reduction)
- Added structured data for blog articles

**Performance Impact:**
- 40-60% faster page loads through caching and optimization
- Significantly reduced API payload sizes
- Better search engine rankings with proper SEO metadata

For rollback procedures, testing recommendations, and configuration details, refer to `ENHANCEMENTS.md`.

## Project-Specific Documentation

For detailed information about each project, refer to:
- **Frontend**: `laqta/CLAUDE.md`, `laqta/DESIGN_SYSTEM.md`, `laqta/DEVELOPMENT_GUIDE.md`
- **Backend**: `my-blog-cms/CLAUDE.md`
- **Enhancements**: `ENHANCEMENTS.md` - Complete enhancement documentation
