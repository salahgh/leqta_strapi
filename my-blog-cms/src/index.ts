// Seeding disabled - uncomment to re-enable
// import { runSeeds } from './seeds/seeders';

module.exports = {
    register(/* { strapi } */) {},

    async bootstrap({ strapi }) {
        console.log('🚀 Bootstrap: Seeding disabled');

        // Seeding disabled - uncomment to re-enable
        // setTimeout(async () => {
        //     try {
        //         console.log('🌱 Seeding started...');
        //         await runSeeds(strapi);
        //     } catch (error) {
        //         console.error('❌ Seeding error:', error);
        //     }
        // }, 3000);
    },
};