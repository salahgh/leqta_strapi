/**
 * privacy-policy controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::privacy-policy.privacy-policy', ({ strapi }) => ({
    async find(ctx) {
        const locale = (ctx.query.locale as string) || 'en';

        try {
            let entity = await strapi.documents('api::privacy-policy.privacy-policy').findFirst({
                populate: {
                    sections: true,
                },
                locale,
                status: 'published',
            });

            // Fallback to default locale (en) if the requested locale doesn't exist
            if (!entity && locale !== 'en') {
                entity = await strapi.documents('api::privacy-policy.privacy-policy').findFirst({
                    populate: {
                        sections: true,
                    },
                    locale: 'en',
                    status: 'published',
                });
            }

            if (!entity) {
                return ctx.notFound('Privacy policy not found.');
            }

            return { data: entity };
        } catch (error) {
            strapi.log.error('Error fetching privacy policy:', error);
            return ctx.internalServerError('Failed to fetch privacy policy');
        }
    },
}));
