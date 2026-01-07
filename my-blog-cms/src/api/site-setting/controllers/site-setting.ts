/**
 * site-setting controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::site-setting.site-setting', ({ strapi }) => ({
    async find(ctx) {
        // Get query parameters
        const locale = (ctx.query.locale as string) || 'en';

        try {
            // For single types, we use findFirst to get the single entry
            const entity = await strapi.documents('api::site-setting.site-setting').findFirst({
                populate: {
                    social_links: true,
                },
                locale,
                status: 'published',
            });

            if (!entity) {
                return ctx.notFound('Site settings not found. Please create site settings in the admin panel.');
            }

            return { data: entity };
        } catch (error) {
            strapi.log.error('Error fetching site settings:', error);
            return ctx.internalServerError('Failed to fetch site settings');
        }
    },
}));
