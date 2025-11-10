# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Strapi v5 headless CMS for a multilingual blog platform with support for English, Arabic, and French. The CMS includes content types for blogs, authors, categories, tags, testimonials, projects, services, FAQs, and missions.

## Development Commands

```bash
# Start development server with auto-reload
npm run develop

# Build admin panel
npm run build

# Start production server (no auto-reload)
npm run start

# Open Strapi console
npm run console

# Deploy to Strapi Cloud
npm run deploy

# Check for Strapi updates
npm run upgrade:dry
npm run upgrade
```

## Architecture

### Database Configuration

The project uses environment-based database configuration (`config/database.ts`):

**Development Environment:**
- **Database**: PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Database Name**: `strapi_db_leqta`
- **Username**: `postgres`
- **Password**: Set in `.env`
- **Auto-selected** when `NODE_ENV` is not `production`

**Production Environment:**
- **Database**: MariaDB
- **Port**: 3306
- **Credentials**: Retrieved from environment variables
- **Auto-selected** when `NODE_ENV=production`
- Set `DATABASE_CLIENT=mysql` explicitly in production

**Configuration Priority:**
1. `DATABASE_URL` connection string (if provided)
2. Individual connection parameters (HOST, PORT, NAME, USERNAME, PASSWORD)
3. SSL configuration via `DATABASE_SSL` env variables
4. Default schema is `public` for PostgreSQL

**Required Drivers:**
- `pg` - PostgreSQL driver (pre-installed)
- `mysql2` - MariaDB/MySQL driver (pre-installed)

### Internationalization (i18n)

The application is fully internationalized with three locales configured in `config/plugins.ts`:
- Default locale: English (`en`)
- Additional locales: Arabic (`ar`), French (`fr`)

All content types support localization. When working with content:
- Always specify `locale` parameter in queries
- Use `localizations` to link translated content
- Each locale entry is created as a separate entity linked to the default locale

### Seeding System

The project uses a modular seeding system located in `src/seeds/`:

**Seeding Architecture:**
- Seeders run automatically 6 seconds after application bootstrap (`src/index.ts`)
- Entry point: `src/seeds/seeders/index.ts` orchestrates all seeders
- Data files: `src/seeds/data/*.ts` contain the seed data
- Individual seeders: `src/seeds/seeders/*Seeder.ts` handle creation logic

**Seeding Order (critical for relations):**
1. Authors (required for blog relations)
2. Categories (required for blog relations)
3. Tags (required for blog relations)
4. Services
5. Projects
6. Testimonials
7. FAQs
8. Missions
9. Blogs (depends on authors, categories, tags)

**Seeding Pattern:**
- Each seeder checks for existing content using unique fields (slug, title, email)
- Base content created in English (`en`) locale first
- Translations created afterward and linked via `localizations`
- All entities published immediately with `publishedAt: new Date()`

### API Structure

Each content type follows standard Strapi folder structure in `src/api/[content-type]/`:
- `content-types/[name]/schema.json` - Content type definition
- `controllers/[name].ts` - Custom controller methods
- `services/[name].ts` - Business logic
- `routes/[name].ts` - Default CRUD routes
- `routes/custom-[name].ts` - Custom public endpoints

**Custom Routes Pattern:**
Custom routes are defined separately (e.g., `src/api/blog/routes/custom-blog.ts`) and typically:
- Set `auth: false` for public access
- Use custom controller methods for specialized queries
- Examples: find by title, find featured posts, find by category

### File Upload

File uploads configured to use Supabase Storage (`config/plugins.ts`):
- Provider: `strapi-provider-upload-supabase`
- Configuration via env variables: `SUPABASE_API_URL`, `SUPABASE_API_KEY`, `SUPABASE_BUCKET`, `SUPABASE_DIRECTORY`
- Size limit: 10MB

### Plugins

**Enabled plugins:**
- `i18n` - Internationalization
- `documentation` - Auto-generated OpenAPI docs at `/documentation`
- `upload` - File upload with Supabase provider
- `color-picker` - Custom field for color selection
- `users-permissions` - User authentication and authorization

## Content Types

The CMS includes these content types (all located in `src/api/`):
- **blog** - Blog posts with author, category, and tag relations
- **author** - Blog authors
- **category** - Blog categories
- **tag** - Blog tags
- **testimonial** - Customer testimonials
- **project** - Portfolio projects
- **service** - Services offered
- **faq** - Frequently asked questions
- **mission** - Mission statements
- **test** - Test content type

## Working with Content

When creating or querying content programmatically:

```typescript
// Create content with locale
await strapi.entityService.create('api::blog.blog', {
  data: {
    title: 'My Post',
    locale: 'en',
    publishedAt: new Date()
  }
});

// Query with locale filter
await strapi.entityService.findMany('api::blog.blog', {
  filters: { slug: 'my-slug' },
  locale: 'en'
});

// Create translation linked to original
await strapi.entityService.create('api::blog.blog', {
  data: translationData,
  locale: 'ar',
  localizations: originalEntryId
});
```

## Environment Variables

Key environment variables (see `.env.example`):

**Server Configuration:**
- `HOST`, `PORT` - Server host and port (default: 0.0.0.0:1337)

**Security Keys:**
- `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY`

**Database Configuration:**
- `NODE_ENV` - Environment mode (determines database client)
- `DATABASE_CLIENT` - Database type (`postgres` or `mysql`, auto-detected in dev/prod)
- `DATABASE_URL` - Full connection string (optional, recommended for PostgreSQL)
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME` - Connection details
- `DATABASE_USERNAME`, `DATABASE_PASSWORD` - Credentials
- `DATABASE_SSL`, `DATABASE_SCHEMA` - Additional options
- `DATABASE_POOL_MIN`, `DATABASE_POOL_MAX`, `DATABASE_CONNECTION_TIMEOUT` - Pool settings

**File Storage (Supabase):**
- `SUPABASE_API_URL`, `SUPABASE_API_KEY`, `SUPABASE_BUCKET`, `SUPABASE_DIRECTORY`

**Development Setup:**
```bash
# Copy .env.example to .env
cp .env.example .env

# Update with your PostgreSQL credentials:
DATABASE_NAME=strapi_db_leqta
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
```

## TypeScript Configuration

- Output directory: `dist/`
- Target: ES2019
- Module: CommonJS
- Excludes: `node_modules/`, `build/`, `dist/`, `.cache/`, `.tmp/`, `src/admin/`, `src/plugins/`, test files

## API Documentation

Auto-generated OpenAPI documentation available at `/documentation` when running in development mode. Configuration in `config/plugins.ts`.
