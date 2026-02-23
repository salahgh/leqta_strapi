import { runSeeds } from './seeds/seeders';

module.exports = {
    register(/* { strapi } */) {},

    async bootstrap({ strapi }) {
        console.log('🚀 Bootstrap: Seeding enabled');

        setTimeout(async () => {
            try {
                console.log('🌱 Seeding started...');
                await runSeeds(strapi);
            } catch (error) {
                console.error('❌ Seeding error:', error);
            }
        }, 3000);
    },
};