import { runSeeds } from './seeds/seeders';

module.exports = {
    register(/* { strapi } */) {
        // Registration logic
    },

    bootstrap({ strapi }) {
        // Run modular seeding with i18n support
        // setTimeout(async () => {
        //     await runSeeds(strapi);
        // }, 6000);
    },
};