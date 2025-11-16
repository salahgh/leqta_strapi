/**
 * Helper Script: Delete All Blogs
 *
 * This script deletes all blog entries from all locales.
 * Use this before re-seeding to fix slug localization.
 *
 * Run with: node scripts/delete-all-blogs.js
 */

const strapi = require('@strapi/strapi');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function deleteAllBlogs() {
    console.log('🗑️  Blog Deletion Script\n');
    console.log('⚠️  WARNING: This will delete ALL blog entries from ALL locales!');
    console.log('⚠️  This action cannot be undone!\n');

    const answer = await askQuestion('Are you sure you want to continue? (yes/no): ');

    if (answer.toLowerCase() !== 'yes') {
        console.log('\n❌ Deletion cancelled. No changes made.');
        rl.close();
        process.exit(0);
    }

    console.log('\n⏳ Loading Strapi...\n');

    try {
        const app = await strapi({ distDir: './dist' }).load();
        const locales = ['en', 'ar', 'fr'];

        let totalDeleted = 0;

        for (const locale of locales) {
            console.log(`\n📍 Processing locale: ${locale.toUpperCase()}`);
            console.log('='.repeat(50));

            const blogs = await app.entityService.findMany('api::blog.blog', {
                locale,
                fields: ['id', 'title'],
                pagination: { limit: 1000 }
            });

            if (blogs.length === 0) {
                console.log(`   No blogs found in ${locale.toUpperCase()}`);
                continue;
            }

            console.log(`   Found ${blogs.length} blog(s) to delete...\n`);

            for (const blog of blogs) {
                try {
                    await app.entityService.delete('api::blog.blog', blog.id, {
                        locale
                    });
                    console.log(`   ✅ Deleted: ${blog.title} (ID: ${blog.id})`);
                    totalDeleted++;
                } catch (error) {
                    console.log(`   ❌ Error deleting blog ${blog.id}: ${error.message}`);
                }
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log(`\n✅ Deletion complete!`);
        console.log(`   Total blogs deleted: ${totalDeleted}\n`);

        console.log('💡 Next Steps:');
        console.log('   1. Restart Strapi: npm run develop');
        console.log('   2. Wait 6 seconds for automatic re-seeding');
        console.log('   3. Verify in admin panel or run: node scripts/check-blog-slugs.js\n');

        await app.destroy();
        rl.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error);
        rl.close();
        process.exit(1);
    }
}

// Run the deletion
deleteAllBlogs();
