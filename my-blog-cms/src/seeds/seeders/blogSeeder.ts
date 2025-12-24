export const seedBlogs = async (strapi: any, blogsData: any[]) => {
    console.log('🌱 Starting Blogs seeding...');

    for (const blogData of blogsData) {
        try {
            // Check if blog already exists
            const existingBlogs = await strapi.documents('api::blog.blog').findMany({
                filters: { slug: blogData.base.slug },
                locale: 'en'
            });

            if (existingBlogs && existingBlogs.length > 0) {
                console.log(`⏭️ Blog "${blogData.base.title}" already exists, skipping`);
                continue;
            }

            // Create English (base) blog
            const enBlog = await strapi.documents('api::blog.blog').create({
                data: {
                    title: blogData.base.title,
                    slug: blogData.base.slug,
                    excerpt: blogData.base.excerpt,
                    content: blogData.base.content,
                    featured: blogData.base.featured,
                    read_time: blogData.base.read_time,
                    views: blogData.base.views || 0,
                    meta_title: blogData.base.meta_title,
                    meta_description: blogData.base.meta_description,
                    publishedAt: new Date()
                },
                locale: 'en'
            });

            console.log(`✅ Created EN blog: "${blogData.base.title}" (ID: ${enBlog.documentId})`);

            // Create Arabic translation
            if (blogData.translations.ar) {
                const arData = blogData.translations.ar;
                await strapi.documents('api::blog.blog').create({
                    data: {
                        title: arData.title,
                        slug: blogData.base.slug, // Use same slug for all locales
                        excerpt: arData.excerpt,
                        content: arData.content,
                        featured: arData.featured,
                        read_time: arData.read_time,
                        views: arData.views || 0,
                        meta_title: arData.meta_title,
                        meta_description: arData.meta_description,
                        publishedAt: new Date()
                    },
                    locale: 'ar'
                });
                console.log(`✅ Created AR blog: "${arData.title}"`);
            }

            // Create French translation
            if (blogData.translations.fr) {
                const frData = blogData.translations.fr;
                await strapi.documents('api::blog.blog').create({
                    data: {
                        title: frData.title,
                        slug: blogData.base.slug, // Use same slug for all locales
                        excerpt: frData.excerpt,
                        content: frData.content,
                        featured: frData.featured,
                        read_time: frData.read_time,
                        views: frData.views || 0,
                        meta_title: frData.meta_title,
                        meta_description: frData.meta_description,
                        publishedAt: new Date()
                    },
                    locale: 'fr'
                });
                console.log(`✅ Created FR blog: "${frData.title}"`);
            }

        } catch (error) {
            console.error(`❌ Error creating blog "${blogData.base.title}":`, error);
        }
    }

    console.log('✅ Blogs seeding completed');
};
