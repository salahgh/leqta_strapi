export const seedServices = async (strapi: any, servicesData: any[]) => {
    try {
        console.log('🌱 Starting Services seeding with i18n...');

        for (const serviceData of servicesData) {
            try {
                // Check for existing service by slug OR title to prevent duplicates
                const existingBySlug = await strapi.entityService.findMany('api::service.service', {
                    filters: { slug: serviceData.base.slug },
                    locale: 'en'
                });

                const existingByTitle = await strapi.entityService.findMany('api::service.service', {
                    filters: { title: serviceData.base.title },
                    locale: 'en'
                });

                if ((existingBySlug && existingBySlug.length > 0) || (existingByTitle && existingByTitle.length > 0)) {
                    console.log(`Service "${serviceData.base.title}" already exists, skipping`);
                    continue;
                }

                // Create English version first with ALL fields
                const enService = await strapi.entityService.create('api::service.service', {
                    data: {
                        title: serviceData.base.title,
                        slug: serviceData.base.slug,
                        description: serviceData.base.description,
                        gradientFrom: serviceData.base.gradientFrom,
                        gradientTo: serviceData.base.gradientTo,
                        featured: serviceData.base.featured,
                        order: serviceData.base.order,
                        tags: serviceData.base.tags || null,
                        locale: 'en',
                        publishedAt: new Date()
                    }
                });

                console.log(`Created English Service: "${serviceData.base.title}" (ID: ${enService.id})`);

                // Create translations - only include LOCALIZED fields (title, description, tags)
                // Non-localized fields (slug, gradientFrom, gradientTo, featured, order) are shared
                for (const [localeCode, translation] of Object.entries(serviceData.translations)) {
                    try {
                        const trans = translation as { title: string; description: string; tags?: any };

                        // Get the documentId for linking localizations in Strapi v5
                        const documentId = enService.documentId;

                        if (!documentId) {
                            console.error(`No documentId found for service "${serviceData.base.title}", skipping ${localeCode} translation`);
                            continue;
                        }

                        // In Strapi v5, use the document service to create localized versions
                        // Only pass localized fields - slug and other non-localized fields are inherited
                        const translatedService = await strapi.documents('api::service.service').update({
                            documentId: documentId,
                            locale: localeCode,
                            data: {
                                title: trans.title,
                                description: trans.description,
                                tags: trans.tags || null,
                                publishedAt: new Date()
                            }
                        });

                        console.log(`Created ${localeCode.toUpperCase()} translation for Service: "${trans.title}" (ID: ${translatedService.id})`);
                    } catch (transError) {
                        console.error(`Error creating ${localeCode} translation for "${serviceData.base.title}":`, transError);
                        // Continue with other translations even if one fails
                    }
                }
            } catch (serviceError) {
                console.error(`Error creating service "${serviceData.base.title}":`, serviceError);
                // Continue with other services even if one fails
            }
        }

        console.log('✅ Services seeding completed successfully');
    } catch (error) {
        console.error('❌ Error in Services seeding:', error);
        // Don't throw - let Strapi continue starting
    }
};
