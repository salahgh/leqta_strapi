/**
 * faq router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::faq.faq', {
  config: {
    findByQuestion: {
      auth: false, // Make it publicly accessible
    },
    findFeatured: {
      auth: false, // Make it publicly accessible
    },
    findByCategory: {
      auth: false, // Make it publicly accessible
    }
  }
});