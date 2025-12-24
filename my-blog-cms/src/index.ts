import { runSeeds } from './seeds/seeders';

module.exports = {
    register(/* { strapi } */) {
        // Registration logic
    },

    bootstrap({ strapi }) {
        // Run seeding after 10 seconds to ensure Strapi is ready
        // The seeder will update existing services with slugs if missing
        setTimeout(async () => {
            try {
                await runSeeds(strapi);
            } catch (error) {
                console.error('Seeding error (non-fatal):', error);
            }
        }, 10000);
    },
};