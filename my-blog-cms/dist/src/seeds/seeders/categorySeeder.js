"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCategories = void 0;
const seedCategories = async (strapi, categoriesData) => {
    try {
        console.log('🌱 Starting Categories seeding with i18n...');
        for (const categoryData of categoriesData) {
            const existingCategory = await strapi.entityService.findMany('api::category.category', {
                filters: { slug: categoryData.base.slug },
                locale: 'en'
            });
            if (existingCategory.length > 0) {
                console.log(`Category "${categoryData.base.name}" already exists, skipping`);
                continue;
            }
            const enCategory = await strapi.entityService.create('api::category.category', {
                data: {
                    ...categoryData.base,
                    locale: 'en',
                    publishedAt: new Date()
                }
            });
            console.log(`Created English Category: "${categoryData.base.name}" (ID: ${enCategory.id})`);
            for (const [localeCode, translation] of Object.entries(categoryData.translations)) {
                const translationData = {
                    ...categoryData.base,
                    // @ts-expect-error
                    ...translation,
                    publishedAt: new Date()
                };
                const translatedCategory = await strapi.entityService.create('api::category.category', {
                    data: translationData,
                    locale: localeCode,
                    localizations: enCategory.id
                });
            }
        }
        console.log('✅ Categories seeding completed successfully');
    }
    catch (error) {
        console.error('❌ Error in Categories seeding:', error);
        throw error;
    }
};
exports.seedCategories = seedCategories;
