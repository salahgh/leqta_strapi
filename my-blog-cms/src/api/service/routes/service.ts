/**
 * service router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::service.service', {
  config: {
    findByTitle: {
      auth: false, // Make it publicly accessible
    }
  }
});