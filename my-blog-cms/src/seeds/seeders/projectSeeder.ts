export const seedProjects = async (strapi: any, projectsData: any[]) => {
    try {
        console.log('🌱 Starting Projects seeding with i18n...');

        for (const projectData of projectsData) {
            try {
                // Check for existing project by slug OR title to prevent duplicates
                const existingBySlug = await strapi.entityService.findMany('api::project.project', {
                    filters: { slug: projectData.base.slug },
                    locale: 'en'
                });

                const existingByTitle = await strapi.entityService.findMany('api::project.project', {
                    filters: { title: projectData.base.title },
                    locale: 'en'
                });

                if ((existingBySlug && existingBySlug.length > 0) || (existingByTitle && existingByTitle.length > 0)) {
                    console.log(`Project "${projectData.base.title}" already exists, skipping`);
                    continue;
                }

                // Create English version first with ALL fields
                const enProject = await strapi.entityService.create('api::project.project', {
                    data: {
                        // Localized fields
                        title: projectData.base.title,
                        category: projectData.base.category,
                        description: projectData.base.description,
                        metrics: projectData.base.metrics,
                        ctaText: projectData.base.ctaText,
                        meta_title: projectData.base.meta_title,
                        meta_description: projectData.base.meta_description,
                        // Non-localized fields
                        slug: projectData.base.slug,
                        imagePosition: projectData.base.imagePosition,
                        featured: projectData.base.featured,
                        order: projectData.base.order,
                        locale: 'en',
                        publishedAt: new Date()
                    }
                });

                console.log(`Created English Project: "${projectData.base.title}" (ID: ${enProject.id})`);

                // Create translations - only include LOCALIZED fields
                // Non-localized fields (slug, imagePosition, featured, order) are shared automatically
                for (const [localeCode, translation] of Object.entries(projectData.translations)) {
                    try {
                        const trans = translation as Record<string, any>;

                        // Get the documentId for linking localizations in Strapi v5
                        const documentId = enProject.documentId;

                        if (!documentId) {
                            console.error(`No documentId found for project "${projectData.base.title}", skipping ${localeCode} translation`);
                            continue;
                        }

                        // In Strapi v5, use the document service to create localized versions
                        // Only pass localized fields - non-localized fields are inherited
                        const translatedProject = await strapi.documents('api::project.project').update({
                            documentId: documentId,
                            locale: localeCode,
                            data: {
                                title: trans.title,
                                category: trans.category,
                                description: trans.description,
                                metrics: trans.metrics,
                                ctaText: trans.ctaText,
                                meta_title: trans.meta_title,
                                meta_description: trans.meta_description,
                                publishedAt: new Date()
                            }
                        });

                        console.log(`Created ${localeCode.toUpperCase()} translation for Project: "${trans.title}" (ID: ${translatedProject.id})`);
                    } catch (transError) {
                        console.error(`Error creating ${localeCode} translation for "${projectData.base.title}":`, transError);
                        // Continue with other translations even if one fails
                    }
                }
            } catch (projectError) {
                console.error(`Error creating project "${projectData.base.title}":`, projectError);
                // Continue with other projects even if one fails
            }
        }

        console.log('✅ Projects seeding completed successfully');
    } catch (error) {
        console.error('❌ Error in Projects seeding:', error);
        // Don't throw - let Strapi continue starting
    }
};
