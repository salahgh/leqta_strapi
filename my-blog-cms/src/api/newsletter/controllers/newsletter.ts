/**
 * newsletter controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::newsletter.newsletter', ({ strapi }) => ({
  async subscribe(ctx) {
    try {
      const { email, source } = ctx.request.body;

      if (!email) {
        return ctx.badRequest('Email is required');
      }

      // Check if email already exists
      const existingSubscriber = await strapi.entityService.findMany('api::newsletter.newsletter', {
        filters: { email },
        limit: 1,
      });

      if (existingSubscriber && existingSubscriber.length > 0) {
        const subscriber = existingSubscriber[0];

        // If unsubscribed, reactivate
        if (subscriber.status === 'unsubscribed') {
          const updated = await strapi.entityService.update(
            'api::newsletter.newsletter',
            subscriber.id,
            {
              data: {
                status: 'active',
                subscribedAt: new Date(),
                unsubscribedAt: null,
              },
            }
          );
          return ctx.send({
            message: 'Successfully resubscribed to newsletter',
            data: { email: updated.email, status: updated.status },
          });
        }

        return ctx.send({
          message: 'Email already subscribed',
          data: { email: subscriber.email, status: subscriber.status },
        });
      }

      // Create new subscriber
      const newSubscriber = await strapi.entityService.create('api::newsletter.newsletter', {
        data: {
          email,
          status: 'active',
          subscribedAt: new Date(),
          source: source || 'website',
        },
      });

      return ctx.send({
        message: 'Successfully subscribed to newsletter',
        data: { email: newSubscriber.email, status: newSubscriber.status },
      });
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async unsubscribe(ctx) {
    try {
      const { email } = ctx.request.body;

      if (!email) {
        return ctx.badRequest('Email is required');
      }

      const existingSubscriber = await strapi.entityService.findMany('api::newsletter.newsletter', {
        filters: { email },
        limit: 1,
      });

      if (!existingSubscriber || existingSubscriber.length === 0) {
        return ctx.notFound('Email not found in subscribers list');
      }

      const subscriber = existingSubscriber[0];

      const updated = await strapi.entityService.update(
        'api::newsletter.newsletter',
        subscriber.id,
        {
          data: {
            status: 'unsubscribed',
            unsubscribedAt: new Date(),
          },
        }
      );

      return ctx.send({
        message: 'Successfully unsubscribed from newsletter',
        data: { email: updated.email, status: updated.status },
      });
    } catch (error) {
      ctx.throw(500, error);
    }
  },
}));
