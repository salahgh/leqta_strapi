export const seedTags = async (strapi: any, tagsData: any[]) => {
    try {
        console.log('🌱 Starting Tags seeding with i18n...');

        for (const tagData of tagsData) {
            const existingTag = await strapi.entityService.findMany('api::tag.tag', {
                filters: { slug: tagData.base.slug },
                locale: 'en'
            });

            if (existingTag.length > 0) {
                console.log(`Tag "${tagData.base.name}" already exists, skipping`);
                continue;
            }

            const enTag = await strapi.entityService.create('api::tag.tag', {
                data: {
                    ...tagData.base,
                    locale: 'en',
                    publishedAt: new Date()
                }
            });

            console.log(`Created English Tag: "${tagData.base.name}" (ID: ${enTag.id})`);

            for (const [localeCode, translation] of Object.entries(tagData.translations)) {
                const translationData = {
                    ...tagData.base,
                    // @ts-expect-error
                    ...translation,
                    publishedAt: new Date()
                };

                const translatedTag = await strapi.entityService.create('api::tag.tag', {
                    data: translationData,
                    locale: localeCode,
                    localizations: enTag.id
                });


            }
        }

        console.log('✅ Tags seeding completed successfully');
    } catch (error) {
        console.error('❌ Error in Tags seeding:', error);
        throw error;
    }
};