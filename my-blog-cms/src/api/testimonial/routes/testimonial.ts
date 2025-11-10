/**
 * testimonial router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::testimonial.testimonial', {
  config: {
    findFeatured: {
      auth: false, // Make it publicly accessible
    },
    findByRole: {
      auth: false, // Make it publicly accessible
    }
  }
});