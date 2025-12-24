export const seedServices = async (strapi: any, servicesData: any[]) => {
    console.log('🌱 Starting Services seeding...');

    for (const serviceData of servicesData) {
        try {
            // Create service
            const service = await strapi.documents('api::service.service').create({
                data: {
                    title: serviceData.base.title,
                    slug: serviceData.base.slug,
                    description: serviceData.base.description,
                    gradientFrom: serviceData.base.gradientFrom,
                    gradientTo: serviceData.base.gradientTo,
                    featured: serviceData.base.featured,
                    order: serviceData.base.order,
                    tags: serviceData.base.tags,
                    publishedAt: new Date()
                },
                locale: 'en'
            });

            console.log(`✅ Created: ${serviceData.base.title}`);

            // Create translations
            if (service.documentId && serviceData.translations) {
                for (const [locale, trans] of Object.entries(serviceData.translations)) {
                    const t = trans as any;
                    await strapi.documents('api::service.service').update({
                        documentId: service.documentId,
                        locale: locale,
                        data: {
                            title: t.title,
                            description: t.description,
                            tags: t.tags,
                            publishedAt: new Date()
                        }
                    });
                    console.log(`   ✅ Added ${locale} translation`);
                }
            }
        } catch (error) {
            console.error(`❌ Error creating ${serviceData.base.title}:`, error);
        }
    }

    console.log('✅ Services seeding completed');
};
