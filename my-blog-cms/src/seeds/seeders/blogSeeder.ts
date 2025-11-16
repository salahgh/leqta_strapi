export const seedBlogs = async (strapi, blogsData) => {
    try {
        console.log('🌱 Starting Blogs seeding with i18n...');

        // Get seeded authors, categories, and tags for relations
        const authors = await strapi.entityService.findMany('api::author.author', { locale: 'en' });
        const categories = await strapi.entityService.findMany('api::category.category', { locale: 'en' });
        const tags = await strapi.entityService.findMany('api::tag.tag', { locale: 'en' });

        for (const blogData of blogsData) {
            console.log(`Processing blog: "${blogData.base.title}" (Slug: ${blogData.base.slug})`);
            const existingBlog = await strapi.entityService.findMany('api::blog.blog', {
                filters: { slug: blogData.base.slug },
                locale: 'en'
            });

            if (existingBlog.length > 0) {
                console.log(`Blog "${blogData.base.title}" already exists, skipping`);
                continue;
            }

            // Add relations to blog data
            const blogWithRelations = {
                ...blogData.base,
                author: authors[Math.floor(Math.random() * authors.length)]?.id,
                category: categories[Math.floor(Math.random() * categories.length)]?.id,
                tags: tags.slice(0, 3).map(tag => tag.id)
            };

            const enBlog = await strapi.entityService.create('api::blog.blog', {
                data: {
                    ...blogWithRelations,
                    locale: 'en',
                    publishedAt: new Date()
                }
            });

            console.log(`Created English Blog: "${blogData.base.title}" (ID: ${enBlog.id})`);

            for (const [localeCode, translation] of Object.entries(blogData.translations)) {
                // Extract only localized fields (slug is now localized and will be auto-generated from title)
                const translationData: any = translation;
                const { featured_image, header_image, content_image, ...translatedFields } = translationData;

                const blogTranslationData = {
                    ...translatedFields,
                    // Keep relations from the base blog
                    author: blogWithRelations.author,
                    category: blogWithRelations.category,
                    tags: blogWithRelations.tags,
                    publishedAt: new Date()
                };

                const translatedBlog = await strapi.entityService.create('api::blog.blog', {
                    data: blogTranslationData,
                    locale: localeCode,
                    localizations: enBlog.id
                });

                console.log(`Created ${localeCode.toUpperCase()} translation for: "${translatedFields.title}" (ID: ${translatedBlog.id})`);
            }
        }

        console.log('✅ Blogs seeding completed successfully');
    } catch (error) {
        console.error('❌ Error in Blogs seeding:', error);
        throw error;
    }
};