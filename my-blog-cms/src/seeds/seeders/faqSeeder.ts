export const seedFAQs = async (strapi: any, faqsData: any[]) => {
    try {
        console.log('🌱 Starting FAQs seeding with i18n...');

        for (const faqData of faqsData) {
            const existingFaq = await strapi.entityService.findMany('api::faq.faq', {
                filters: { question: faqData.base.question },
                locale: 'en'
            });

            if (existingFaq.length > 0) {
                console.log(`FAQ "${faqData.base.question}" already exists, skipping`);
                continue;
            }

            const enFaq = await strapi.entityService.create('api::faq.faq', {
                data: {
                    ...faqData.base,
                    locale: 'en',
                    publishedAt: new Date()
                }
            });

            console.log(`Created English FAQ: "${faqData.base.question}" (ID: ${enFaq.id})`);

            for (const [localeCode, translation] of Object.entries(faqData.translations)) {
                const translationData = {
                    ...faqData.base,
                    // @ts-expect-error
                    ...translation,
                    publishedAt: new Date()
                };

                const translatedFaq = await strapi.entityService.create('api::faq.faq', {
                    data: translationData,
                    locale: localeCode,
                    localizations: enFaq.id
                });


            }
        }

        console.log('✅ FAQs seeding completed successfully');
    } catch (error) {
        console.error('❌ Error in FAQs seeding:', error);
        throw error;
    }
};