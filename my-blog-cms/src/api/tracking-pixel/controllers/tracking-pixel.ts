/**
 * tracking-pixel controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::tracking-pixel.tracking-pixel', ({ strapi }) => ({
    async find(ctx) {
        try {
            const entity = await strapi.documents('api::tracking-pixel.tracking-pixel').findFirst({
                status: 'published',
            });

            if (!entity) {
                return ctx.notFound('Tracking pixel settings not found. Please create tracking pixel settings in the admin panel.');
            }

            return { data: entity };
        } catch (error) {
            strapi.log.error('Error fetching tracking pixel settings:', error);
            return ctx.internalServerError('Failed to fetch tracking pixel settings');
        }
    },
}));
