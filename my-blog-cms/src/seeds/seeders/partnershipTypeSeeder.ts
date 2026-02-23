export const seedPartnershipTypes = async (strapi: any, partnershipTypesData: any[]) => {
    try {
        console.log('🌱 Starting Partnership Types seeding with i18n...');

        for (const typeData of partnershipTypesData) {
            const existingType = await strapi.entityService.findMany('api::partnership-type.partnership-type', {
                filters: { slug: typeData.base.slug },
                locale: 'en'
            });

            if (existingType.length > 0) {
                console.log(`Partnership Type "${typeData.base.name}" already exists, skipping`);
                continue;
            }

            const enType = await strapi.entityService.create('api::partnership-type.partnership-type', {
                data: {
                    ...typeData.base,
                    locale: 'en',
                    publishedAt: new Date()
                }
            });

            console.log(`Created English Partnership Type: "${typeData.base.name}" (ID: ${enType.id})`);

            for (const [localeCode, translation] of Object.entries(typeData.translations)) {
                const translationData = {
                    ...typeData.base,
                    // @ts-expect-error
                    ...translation,
                    publishedAt: new Date()
                };

                await strapi.entityService.create('api::partnership-type.partnership-type', {
                    data: translationData,
                    locale: localeCode,
                    localizations: enType.id
                });
            }
        }

        console.log('✅ Partnership Types seeding completed successfully');
    } catch (error) {
        console.error('❌ Error in Partnership Types seeding:', error);
        throw error;
    }
};
