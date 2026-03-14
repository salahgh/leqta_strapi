export const seedPartners = async (strapi: any, partnersData: any[]) => {
    try {
        console.log('🌱 Starting Partners seeding with i18n...');

        for (const partnerData of partnersData) {
            const existingPartner = await strapi.entityService.findMany('api::partner.partner', {
                filters: { slug: partnerData.base.slug },
                locale: 'en'
            });

            if (existingPartner.length > 0) {
                console.log(`Partner "${partnerData.base.name}" already exists, skipping`);
                continue;
            }

            const enPartner = await strapi.entityService.create('api::partner.partner', {
                data: {
                    ...partnerData.base,
                    locale: 'en',
                    publishedAt: new Date()
                }
            });

            console.log(`Created English Partner: "${partnerData.base.name}" (ID: ${enPartner.id})`);

            for (const [localeCode, translation] of Object.entries(partnerData.translations)) {
                const translationData = {
                    ...partnerData.base,
                    // @ts-expect-error
                    ...translation,
                    publishedAt: new Date()
                };

                await strapi.entityService.create('api::partner.partner', {
                    data: translationData,
                    locale: localeCode,
                    localizations: enPartner.id
                });
            }
        }

        console.log('✅ Partners seeding completed successfully');
    } catch (error) {
        console.error('❌ Error in Partners seeding:', error);
        throw error;
    }
};
