# Blog Slug Localization Migration

## What Changed

The `slug` field in the Blog content type has been changed from **non-localized** to **localized**. This allows each language version (English, Arabic, French) to have its own unique slug, enabling proper navigation to translated blog articles.

## Migration Steps

### Step 1: Stop Strapi
```bash
# Stop your running Strapi instance if it's running
# Press Ctrl+C in the terminal where Strapi is running
```

### Step 2: Delete Existing Blog Data

Since the slug structure has changed, existing blog entries need to be recreated. You have two options:

**Option A: Delete via Strapi Admin (Recommended)**
1. Start Strapi: `npm run develop`
2. Login to admin panel at `http://localhost:1337/admin`
3. Go to Content Manager → Blogs
4. Select all blog entries
5. Delete them using the bulk delete action
6. Stop Strapi (Ctrl+C)

**Option B: Delete via Database (Advanced)**
```bash
# For PostgreSQL
psql -U postgres -d strapi_db_leqta -c "DELETE FROM blogs;"
psql -U postgres -d strapi_db_leqta -c "DELETE FROM blogs_localizations_links;"
```

### Step 3: Rebuild and Restart Strapi

The schema change requires rebuilding the admin panel:

```bash
cd my-blog-cms

# Clean previous build
rm -rf .cache dist build

# Install dependencies (if needed)
npm install

# Start in development mode
npm run develop
```

### Step 4: Automatic Re-seeding

The seeder will automatically run 6 seconds after Strapi starts and will recreate all blog entries with localized slugs for each language.

Watch the console output for:
```
🌱 Starting Blogs seeding with i18n...
Created English Blog: "..." (ID: ...)
Created AR translation for: "..." (ID: ...)
Created FR translation for: "..." (ID: ...)
✅ Blogs seeding completed successfully
```

### Step 5: Verify

1. Check the Content Manager in Strapi admin
2. For each blog entry, you should see three locale versions (EN, AR, FR)
3. Each version should have its own unique slug based on the translated title
4. Test navigation on the frontend by visiting blog articles in different languages

## What This Fixes

✅ **Before:** All language versions shared the same English slug → navigation broken for Arabic/French
✅ **After:** Each language has its own slug → proper navigation for all languages

**Example:**
- English: `/en/blog/articles/complete-guide-digital-marketing-2024`
- Arabic: `/ar/blog/articles/الدليل-الشامل-لاستراتيجية-التسويق-الرقمي-في-2024`
- French: `/fr/blog/articles/guide-complet-strategie-marketing-numerique-2024`

## Troubleshooting

**Issue:** Blogs not appearing after seeding
**Solution:** Check the console for seeding errors. Ensure authors, categories, and tags were seeded first.

**Issue:** Slugs not generating for Arabic/French
**Solution:** Strapi auto-generates slugs from the `title` field. Ensure translations have the `title` field.

**Issue:** Old slugs still in use
**Solution:** Clear your database completely and restart Strapi to trigger re-seeding.

## Rollback (if needed)

If you need to revert to non-localized slugs:

1. Edit `my-blog-cms/src/api/blog/content-types/blog/schema.json`
2. Change line 34 from `"localized": true` to `"localized": false`
3. Edit `my-blog-cms/src/seeds/seeders/blogSeeder.ts`
4. Add `slug` back to the exclusion list on line 43
5. Follow migration steps again
