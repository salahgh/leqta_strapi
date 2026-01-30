/**
 * cookie-consent controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::cookie-consent.cookie-consent', ({ strapi }) => ({
    async find(ctx) {
        const locale = (ctx.query.locale as string) || 'en';

        try {
            let entity = await strapi.documents('api::cookie-consent.cookie-consent').findFirst({
                locale,
                status: 'published',
            });

            // Fallback to default locale (en) if the requested locale doesn't exist
            if (!entity && locale !== 'en') {
                entity = await strapi.documents('api::cookie-consent.cookie-consent').findFirst({
                    locale: 'en',
                    status: 'published',
                });
            }

            if (!entity) {
                return ctx.notFound('Cookie consent settings not found. Please create cookie consent settings in the admin panel.');
            }

            return { data: entity };
        } catch (error) {
            strapi.log.error('Error fetching cookie consent:', error);
            return ctx.internalServerError('Failed to fetch cookie consent settings');
        }
    },
}));
