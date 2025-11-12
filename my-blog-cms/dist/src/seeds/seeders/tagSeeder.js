"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTags = void 0;
const seedTags = async (strapi, tagsData) => {
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
                // Only include localized fields (name) in translations
                // slug and color are shared across all locales
                const trans = translation;
                const translationData = {
                    name: trans.name,
                    publishedAt: new Date()
                };
                const translatedTag = await strapi.entityService.create('api::tag.tag', {
                    data: translationData,
                    locale: localeCode,
                    localizations: enTag.id
                });
                console.log(`Created ${localeCode.toUpperCase()} translation for Tag: "${trans.name}" (ID: ${translatedTag.id})`);
            }
        }
        console.log('✅ Tags seeding completed successfully');
    }
    catch (error) {
        console.error('❌ Error in Tags seeding:', error);
        throw error;
    }
};
exports.seedTags = seedTags;
