"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProjects = void 0;
const seedProjects = async (strapi, projectsData) => {
    console.log('🌱 Starting Projects seeding with i18n...');
    for (const projectData of projectsData) {
        const existingProject = await strapi.entityService.findMany('api::project.project', {
            filters: { slug: projectData.base.slug },
            locale: 'en'
        });
        if (existingProject.length > 0) {
            console.log(`Project "${projectData.base.title}" already exists, skipping`);
            continue;
        }
        const enProject = await strapi.entityService.create('api::project.project', {
            data: {
                ...projectData.base,
                locale: 'en',
                publishedAt: new Date()
            }
        });
        console.log(`Created English Project: "${projectData.base.title}" (ID: ${enProject.id})`);
        for (const [localeCode, translation] of Object.entries(projectData.translations)) {
            const translationData = {
                ...projectData.base,
                // @ts-expect-error
                ...translation,
                publishedAt: new Date()
            };
            const translatedProject = await strapi.entityService.create('api::project.project', {
                data: translationData,
                locale: localeCode,
                localizations: enProject.id
            });
        }
        console.log('✅ Projects seeding completed successfully');
    }
};
exports.seedProjects = seedProjects;
