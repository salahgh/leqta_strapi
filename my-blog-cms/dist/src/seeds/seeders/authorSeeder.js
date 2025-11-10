"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAuthors = void 0;
const seedAuthors = async (strapi, authorsData) => {
    try {
        console.log('🌱 Starting Authors seeding with i18n...');
        for (const authorData of authorsData) {
            // Check if author already exists by email
            const existingAuthor = await strapi.entityService.findMany('api::author.author', {
                filters: { email: authorData.base.email },
                locale: 'all'
            });
            if (existingAuthor.length > 0) {
                console.log(`Author ${authorData.base.email} already exists, skipping`);
                continue;
            }
            // Step 1: Create English version (default locale)
            const enAuthor = await strapi.entityService.create('api::author.author', {
                data: {
                    name: authorData.base.name,
                    email: authorData.base.email,
                    bio: authorData.base.bio,
                    social_links: authorData.base.social_links,
                    locale: 'en',
                    publishedAt: new Date()
                }
            });
            console.log(`Created English Author: "${authorData.base.name}" (ID: ${enAuthor.id})`);
            // Step 2: Create translations
            for (const [localeCode, translation] of Object.entries(authorData.translations)) {
                console.log("translation", translation);
                const translationData = {
                    name: authorData.base.name,
                    email: authorData.base.email + localeCode,
                    // @ts-expect-error
                    bio: translation === null || translation === void 0 ? void 0 : translation.bio,
                    social_links: authorData.base.social_links,
                    publishedAt: new Date()
                };
                const translatedAuthor = await strapi.entityService.create('api::author.author', {
                    data: translationData,
                    locale: localeCode,
                    localizations: enAuthor.id
                });
                console.log(`Created ${localeCode} translation for Author: "${authorData.base.name}" (ID: ${translatedAuthor.id})`);
            }
        }
        console.log('✅ Authors seeding completed successfully');
    }
    catch (error) {
        console.error('❌ Error in Authors seeding:', error);
        throw error;
    }
};
exports.seedAuthors = seedAuthors;
