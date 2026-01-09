# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing a full-stack multilingual content marketing platform for Laqta, a creative agency. The architecture consists of two interconnected applications:

- **Frontend (`laqta/`)**: Next.js 16 marketing website with App Router and React 19
- **Backend (`my-blog-cms/`)**: Strapi v5 headless CMS

Both applications support three languages: English (en), Arabic (ar), and French (fr).

**Important**: Each subdirectory has its own detailed CLAUDE.md file. When working in a specific project, refer to that project's CLAUDE.md for detailed guidance.

## Commands

### Backend (Strapi) - Port 1337
```bash
cd my-blog-cms
npm run develop     # Dev server with auto-reload
npm run build       # Build admin panel
npm run start       # Production server
npm run console     # Open Strapi console
npm run upgrade:dry # Check for Strapi updates
```

### Frontend (Next.js) - Port 3000
```bash
cd laqta
npm run dev         # Dev server
npm run build       # Production build
npm start           # Production server
npm run lint        # ESLint
```

### Production (PM2)
```bash
pm2 start ecosystem.config.js              # Start both apps
pm2 start ecosystem.config.js --only strapi # Start only Strapi
pm2 start ecosystem.config.js --only laqta  # Start only Next.js
```

## Environment Configuration

**Backend (`my-blog-cms/.env`)**:
- Database: PostgreSQL (dev) or MariaDB (production)
- Supabase storage credentials for file uploads
- Security tokens (APP_KEYS, JWT secrets)

**Frontend (`laqta/.env.local`)**:
```
NEXT_PUBLIC_STRAPI_URL_2=http://localhost:1337
```

## Architecture

### Data Flow
1. Content created in Strapi CMS (`http://localhost:1337/admin`)
2. Frontend fetches via Strapi REST API at `/api/*`
3. Next.js renders with locale-based routing (`/[locale]/...`)

### API Integration
The frontend's `laqta/lib/strapi.ts` provides typed clients for all Strapi content types (blogs, services, projects, testimonials, FAQs, missions). All API functions accept a `locale` parameter.

```typescript
// Usage pattern
await blogsApi.getAll({ page: 1, pageSize: 10, locale: 'en' });
await blogsApi.getBySlug('article-slug', 'en');
```

### Internationalization
- Locales: `en` (default), `ar` (Arabic), `fr` (French)
- Backend: Strapi i18n plugin with linked localizations
- Frontend: next-intl with `[locale]` routing segment
- UI translations: `laqta/messages/[locale].json`

### Database
- **Development**: PostgreSQL on localhost:5432 (database: `strapi_db_leqta`)
- **Production**: MariaDB on localhost:3306 (auto-selected when `NODE_ENV=production`)

### File Storage
Supabase Storage for images and media uploaded through Strapi.

## Key Files

| Purpose | Location |
|---------|----------|
| Strapi API client & types | `laqta/lib/strapi.ts` |
| App Router pages | `laqta/src/app/[locale]/` |
| Locale routing | `laqta/middleware.ts`, `laqta/src/i18n/routing.ts` |
| UI translations | `laqta/messages/` |
| Design tokens | `laqta/tailwind.config.js` |
| Database config | `my-blog-cms/config/database.ts` |
| Content types | `my-blog-cms/src/api/` |
| Seeding system | `my-blog-cms/src/seeds/` |
| PM2 config | `ecosystem.config.js` |

## Development Patterns

### Adding Content Types
1. Create in Strapi admin UI
2. Add TypeScript interface in `laqta/lib/strapi.ts`
3. Create API client functions in same file
4. Use in frontend components

### Adding Translations
1. Backend: Create content in `en`, add localizations in Strapi admin
2. Frontend: Add keys to `laqta/messages/[locale].json`

### Forms
Uses Formik + Yup:
```typescript
const validationSchema = Yup.object({ /* ... */ });
const formik = useFormik({ validationSchema, /* ... */ });
```

### Backend Seeding
Seeders run 6s after bootstrap (`my-blog-cms/src/index.ts`). Order matters for relations: Authors → Categories → Tags → Services → Projects → Testimonials → FAQs → Missions → Blogs.

## Design System

Defined in `laqta/tailwind.config.js`:
- **Colors**: Primary (#7F56D9), brand colors, neutral scale
- **Typography**: Poppins (body), Gotham (headings)
- **Icons**: Lucide React

See `laqta/DESIGN_SYSTEM.md` for complete specifications.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend not responding | Check Strapi running on 1337, verify database connection |
| Frontend API errors | Confirm `NEXT_PUBLIC_STRAPI_URL_2`, check content is published |
| Missing translations | Ensure content exists in all locales, check localizations are linked |

## Documentation

- **Frontend details**: `laqta/CLAUDE.md`
- **Backend details**: `my-blog-cms/CLAUDE.md`
- **Enhancements**: `ENHANCEMENTS.md`
- **Deployment**: `docs/deployment/`
- **Server config**: `docs/server/`
