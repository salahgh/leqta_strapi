/**
 * Cookie Consent Seeder
 * Seeds the cookie-consent single type with Law 18-07 compliant content
 */

import { CookieConsentData } from '../data/cookieConsent';

export const seedCookieConsent = async (strapi: any, data: CookieConsentData) => {
    try {
        console.log('🍪 Starting Cookie Consent seeding with i18n...');

        // Check if cookie consent already exists in English
        const existingConsent = await strapi.entityService.findMany('api::cookie-consent.cookie-consent', {
            locale: 'en'
        });

        if (existingConsent && existingConsent.length > 0) {
            console.log('Cookie consent already exists, skipping seed');
            return;
        }

        // Create English (base) version
        const enCookieConsent = await strapi.entityService.create('api::cookie-consent.cookie-consent', {
            data: {
                ...data.base,
                locale: 'en',
                publishedAt: new Date()
            }
        });

        console.log(`✅ Created English cookie consent (ID: ${enCookieConsent.id})`);

        // Create translations
        for (const [localeCode, translation] of Object.entries(data.translations)) {
            const translationData = {
                ...data.base,
                ...translation,
                publishedAt: new Date()
            };

            const translatedConsent = await strapi.entityService.create('api::cookie-consent.cookie-consent', {
                data: translationData,
                locale: localeCode,
                localizations: enCookieConsent.id
            });

            console.log(`✅ Created ${localeCode.toUpperCase()} cookie consent (ID: ${translatedConsent.id})`);
        }

        console.log('🍪 Cookie Consent seeding completed successfully');
    } catch (error) {
        console.error('❌ Error in Cookie Consent seeding:', error);
        throw error;
    }
};
