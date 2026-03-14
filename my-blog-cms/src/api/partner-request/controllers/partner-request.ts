/**
 * partner-request controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::partner-request.partner-request', ({ strapi }) => ({
    async submit(ctx) {
        const { firstName, lastName, companyName, email, phone, partnershipType, message, consentGiven, locale } = ctx.request.body;

        // Validate required fields
        if (!firstName || !lastName || !companyName || !email || !phone || !partnershipType || !message) {
            return ctx.badRequest('All fields are required');
        }

        if (!consentGiven) {
            return ctx.badRequest('Consent is required');
        }

        // Check for duplicate submission (same email within 24 hours)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const existingRequest = await strapi.entityService.findMany('api::partner-request.partner-request', {
            filters: {
                email,
                createdAt: { $gte: twentyFourHoursAgo }
            }
        });

        if (existingRequest && existingRequest.length > 0) {
            return ctx.badRequest('A request with this email was already submitted in the last 24 hours. Please try again later.');
        }

        // Create the partner request
        const entry = await strapi.entityService.create('api::partner-request.partner-request', {
            data: {
                firstName,
                lastName,
                companyName,
                email,
                phone,
                partnershipType,
                message,
                consentGiven,
                status: 'pending',
                locale: locale || 'en'
            }
        });

        return { data: { id: entry.id }, message: 'Partner request submitted successfully' };
    }
}));
