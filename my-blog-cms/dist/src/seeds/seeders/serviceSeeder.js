"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedServices = void 0;
const seedServices = async (strapi, servicesData) => {
    try {
        console.log('🌱 Starting Services seeding with i18n...');
        for (const serviceData of servicesData) {
            const existingService = await strapi.entityService.findMany('api::service.service', {
                filters: { title: serviceData.base.title },
                locale: 'en'
            });
            if (existingService.length > 0) {
                console.log(`Service "${serviceData.base.title}" already exists, skipping`);
                continue;
            }
            const enService = await strapi.entityService.create('api::service.service', {
                data: {
                    ...serviceData.base,
                    locale: 'en',
                    publishedAt: new Date()
                }
            });
            console.log(`Created English Service: "${serviceData.base.title}" (ID: ${enService.id})`);
            for (const [localeCode, translation] of Object.entries(serviceData.translations)) {
                const translationData = {
                    ...serviceData.base,
                    // @ts-expect-error
                    ...translation,
                    publishedAt: new Date()
                };
                const translatedService = await strapi.entityService.create('api::service.service', {
                    data: translationData,
                    locale: localeCode,
                    localizations: enService.id
                });
            }
        }
        console.log('✅ Services seeding completed successfully');
    }
    catch (error) {
        console.error('❌ Error in Services seeding:', error);
        throw error;
    }
};
exports.seedServices = seedServices;
