// Helper function to generate slug from title
function generateSlug(title: string): string {
    if (!title) return '';
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export const seedServices = async (strapi: any, servicesData: any[]) => {
    try {
        console.log('🌱 Starting Services seeding with i18n...');

        for (const serviceData of servicesData) {
            try {
                // Check for existing service by title
                const existingServices = await strapi.documents('api::service.service').findMany({
                    filters: { title: serviceData.base.title },
                    locale: 'en'
                });

                const existingService = existingServices && existingServices.length > 0 ? existingServices[0] : null;

                if (existingService) {
                    // Service exists - check if slug needs updating
                    if (!existingService.slug) {
                        const slug = serviceData.base.slug || generateSlug(serviceData.base.title);
                        await strapi.documents('api::service.service').update({
                            documentId: existingService.documentId,
                            data: { slug },
                            locale: 'en'
                        });
                        console.log(`✅ Updated slug for "${serviceData.base.title}" -> "${slug}"`);
                    } else {
                        console.log(`Service "${serviceData.base.title}" already has slug: "${existingService.slug}"`);
                    }
                    continue;
                }

                // Service doesn't exist - create it
                const enService = await strapi.documents('api::service.service').create({
                    data: {
                        title: serviceData.base.title,
                        slug: serviceData.base.slug || generateSlug(serviceData.base.title),
                        description: serviceData.base.description,
                        gradientFrom: serviceData.base.gradientFrom,
                        gradientTo: serviceData.base.gradientTo,
                        featured: serviceData.base.featured,
                        order: serviceData.base.order,
                        tags: serviceData.base.tags || null,
                        publishedAt: new Date()
                    },
                    locale: 'en'
                });

                console.log(`Created English Service: "${serviceData.base.title}" (ID: ${enService.id})`);

                // Create translations
                for (const [localeCode, translation] of Object.entries(serviceData.translations)) {
                    try {
                        const trans = translation as { title: string; description: string; tags?: any };

                        const documentId = enService.documentId;

                        if (!documentId) {
                            console.error(`No documentId found for service "${serviceData.base.title}", skipping ${localeCode} translation`);
                            continue;
                        }

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
                    }
                }
            } catch (serviceError) {
                console.error(`Error creating service "${serviceData.base.title}":`, serviceError);
            }
        }

        console.log('✅ Services seeding completed successfully');
    } catch (error) {
        console.error('❌ Error in Services seeding:', error);
    }
};
