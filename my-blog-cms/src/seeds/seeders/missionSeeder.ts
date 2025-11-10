export const seedMissions = async (strapi: any, missionsData: any[]) => {
    try {
        console.log('🌱 Starting Missions seeding with i18n...');

        for (const missionData of missionsData) {
            const existingMission = await strapi.entityService.findMany('api::mission.mission', {
                filters: { title: missionData.base.title },
                locale: 'en'
            });

            if (existingMission.length > 0) {
                console.log(`Mission "${missionData.base.title}" already exists, skipping`);
                continue;
            }

            const enMission = await strapi.entityService.create('api::mission.mission', {
                data: {
                    ...missionData.base,
                    locale: 'en',
                    publishedAt: new Date()
                }
            });

            console.log(`Created English Mission: "${missionData.base.title}" (ID: ${enMission.id})`);

            for (const [localeCode, translation] of Object.entries(missionData.translations)) {
                const translationData = {
                    ...missionData.base,
                    // @ts-expect-error
                    ...translation,
                    publishedAt: new Date()
                };

                const translatedMission = await strapi.entityService.create('api::mission.mission', {
                    data: translationData,
                    locale: localeCode,
                    localizations: enMission.id
                });


            }
        }

        console.log('✅ Missions seeding completed successfully');
    } catch (error) {
        console.error('❌ Error in Missions seeding:', error);
        throw error;
    }
};