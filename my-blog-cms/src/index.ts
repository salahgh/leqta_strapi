import { runSeeds } from './seeds/seeders';

module.exports = {
    register(/* { strapi } */) {
        // Registration logic
    },

    bootstrap({ strapi }) {
        // Increase delay to 60 seconds to ensure Strapi is fully started and database is ready
        setTimeout(async () => {
            try {
                await runSeeds(strapi);
            } catch (error) {
                console.error('Seeding error (non-fatal):', error);
            }
        }, 60000);
    },
};