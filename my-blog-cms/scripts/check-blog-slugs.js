/**
 * Diagnostic Script: Check Blog Slug Localization
 *
 * This script checks if blog entries have localized slugs for all languages.
 * Run with: node scripts/check-blog-slugs.js
 */

const strapi = require('@strapi/strapi');

async function checkBlogSlugs() {
    console.log('🔍 Checking blog slug localization...\n');

    try {
        const app = await strapi({ distDir: './dist' }).load();
        const locales = ['en', 'ar', 'fr'];

        console.log('Checking blogs across all locales:\n');

        for (const locale of locales) {
            console.log(`\n📍 Locale: ${locale.toUpperCase()}`);
            console.log('='.repeat(50));

            const blogs = await app.entityService.findMany('api::blog.blog', {
                locale,
                fields: ['id', 'title', 'slug'],
                pagination: { limit: 100 }
            });

            if (blogs.length === 0) {
                console.log(`❌ No blogs found for locale "${locale}"`);
                continue;
            }

            console.log(`Found ${blogs.length} blog(s):\n`);

            let hasIssues = false;
            blogs.forEach((blog, index) => {
                const status = blog.slug ? '✅' : '❌';
                console.log(`${index + 1}. ${status} ID: ${blog.id}`);
                console.log(`   Title: ${blog.title || 'N/A'}`);
                console.log(`   Slug: ${blog.slug || 'NULL/MISSING'}`);

                if (!blog.slug) {
                    hasIssues = true;
                    console.log(`   ⚠️  ISSUE: Slug is missing for this locale!`);
                }
                console.log();
            });

            if (hasIssues) {
                console.log(`\n⚠️  WARNING: Found blogs without slugs in ${locale.toUpperCase()} locale!`);
            } else {
                console.log(`\n✅ All blogs have slugs in ${locale.toUpperCase()} locale.`);
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('\n📊 Summary:');

        // Get total count per locale
        const enCount = await app.entityService.count('api::blog.blog', { locale: 'en' });
        const arCount = await app.entityService.count('api::blog.blog', { locale: 'ar' });
        const frCount = await app.entityService.count('api::blog.blog', { locale: 'fr' });

        console.log(`   EN: ${enCount} blog(s)`);
        console.log(`   AR: ${arCount} blog(s)`);
        console.log(`   FR: ${frCount} blog(s)`);

        if (enCount === arCount && arCount === frCount) {
            console.log('\n✅ All locales have the same number of blogs (good!)');
        } else {
            console.log('\n⚠️  WARNING: Locales have different blog counts!');
            console.log('   This suggests missing translations.');
        }

        console.log('\n💡 Next Steps:');
        if (arCount === 0 || frCount === 0 || enCount !== arCount || arCount !== frCount) {
            console.log('   1. Stop Strapi');
            console.log('   2. Delete all blog entries via admin or database');
            console.log('   3. Restart Strapi to trigger automatic re-seeding');
            console.log('   4. Run this script again to verify');
        } else {
            console.log('   Run the migration steps in MIGRATION_INSTRUCTIONS.md');
        }

        console.log('\n✅ Diagnostic complete!\n');

        await app.destroy();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Run the check
checkBlogSlugs();
