"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSocialMedias = void 0;
const socialMedias_1 = require("../data/socialMedias");
async function seedSocialMedias(strapi) {
    console.log('🔗 Starting social media seeding...');
    try {
        for (const socialMediaEntry of socialMedias_1.socialMediaData) {
            // Create English version first (default locale)
            const enData = socialMediaEntry.en;
            // Check if this social media platform already exists
            const existing = await strapi.entityService.findMany('api::social-media.social-media', {
                filters: {
                    platform: enData.platform,
                },
                locale: 'en',
                limit: 1,
            });
            let socialMediaId;
            if (existing && existing.length > 0) {
                console.log(`  ✓ Social media "${enData.platform}" already exists (English)`);
                socialMediaId = existing[0].id;
            }
            else {
                // Create new English entry
                const created = await strapi.entityService.create('api::social-media.social-media', {
                    data: {
                        ...enData,
                        locale: 'en',
                        publishedAt: new Date(),
                    },
                });
                socialMediaId = created.id;
                console.log(`  ✓ Created social media: ${enData.platform} (English)`);
            }
            // Create Arabic translation
            const arData = socialMediaEntry.ar;
            const existingAr = await strapi.entityService.findMany('api::social-media.social-media', {
                filters: {
                    platform: arData.platform,
                },
                locale: 'ar',
                limit: 1,
            });
            if (!existingAr || existingAr.length === 0) {
                await strapi.entityService.create('api::social-media.social-media', {
                    data: {
                        ...arData,
                        locale: 'ar',
                        localizations: [socialMediaId],
                        publishedAt: new Date(),
                    },
                });
                console.log(`    ✓ Created Arabic translation for ${enData.platform}`);
            }
            // Create French translation
            const frData = socialMediaEntry.fr;
            const existingFr = await strapi.entityService.findMany('api::social-media.social-media', {
                filters: {
                    platform: frData.platform,
                },
                locale: 'fr',
                limit: 1,
            });
            if (!existingFr || existingFr.length === 0) {
                await strapi.entityService.create('api::social-media.social-media', {
                    data: {
                        ...frData,
                        locale: 'fr',
                        localizations: [socialMediaId],
                        publishedAt: new Date(),
                    },
                });
                console.log(`    ✓ Created French translation for ${enData.platform}`);
            }
        }
        console.log('✅ Social media seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error seeding social medias:', error);
        throw error;
    }
}
exports.seedSocialMedias = seedSocialMedias;
