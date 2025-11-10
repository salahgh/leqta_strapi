/**
 * mission router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::mission.mission', {
  config: {
    findByTitle: {
      auth: false, // Make it publicly accessible
    },
    findFeatured: {
      auth: false, // Make it publicly accessible
    }
  }
});