import { plansData } from '../data/plans';

export const seedPlans = async (strapi: any, plans: typeof plansData) => {
    console.log('🌱 Starting Plans seeding...');

    for (const plan of plans) {
        // Check if plan already exists
        const existingPlans = await strapi.documents('api::plan.plan').findMany({
            filters: { title: plan.title },
            locale: 'en',
        });

        if (existingPlans && existingPlans.length > 0) {
            console.log(`⏭️ Plan "${plan.title}" already exists, skipping`);
            continue;
        }

        // Prepare English sections
        const sectionsEn = plan.sections.map(section => ({
            title: section.title,
            points: section.points.map(point => ({
                text: point.text,
                included: point.included,
            })),
        }));

        // Create English version
        const createdPlan = await strapi.documents('api::plan.plan').create({
            data: {
                title: plan.title,
                description: plan.description,
                price: plan.price,
                isCustomPricing: plan.isCustomPricing,
                customPricingText: plan.customPricingText || null,
                buttonText: plan.buttonText,
                buttonLink: plan.buttonLink,
                featured: plan.featured,
                order: plan.order,
                sections: sectionsEn,
                publishedAt: new Date(),
            },
            locale: 'en',
            status: 'published',
        });

        console.log(`✅ Created: ${plan.title}`);

        // Create Arabic translation
        try {
            const sectionsAr = plan.sections.map(section => ({
                title: section.title_ar,
                points: section.points.map(point => ({
                    text: point.text_ar,
                    included: point.included,
                })),
            }));

            await strapi.documents('api::plan.plan').create({
                data: {
                    title: plan.title_ar,
                    description: plan.description_ar,
                    price: plan.price_ar || plan.price,
                    isCustomPricing: plan.isCustomPricing,
                    customPricingText: plan.customPricingText_ar || plan.customPricingText || null,
                    buttonText: plan.buttonText_ar,
                    buttonLink: plan.buttonLink,
                    featured: plan.featured,
                    order: plan.order,
                    sections: sectionsAr,
                    publishedAt: new Date(),
                },
                locale: 'ar',
                status: 'published',
            });
            console.log(`   ✅ Added ar translation`);
        } catch (error) {
            console.error(`   ❌ Error creating ar translation for ${plan.title}:`, error);
        }

        // Create French translation
        try {
            const sectionsFr = plan.sections.map(section => ({
                title: section.title_fr,
                points: section.points.map(point => ({
                    text: point.text_fr,
                    included: point.included,
                })),
            }));

            await strapi.documents('api::plan.plan').create({
                data: {
                    title: plan.title_fr,
                    description: plan.description_fr,
                    price: plan.price_fr || plan.price,
                    isCustomPricing: plan.isCustomPricing,
                    customPricingText: plan.customPricingText_fr || plan.customPricingText || null,
                    buttonText: plan.buttonText_fr,
                    buttonLink: plan.buttonLink,
                    featured: plan.featured,
                    order: plan.order,
                    sections: sectionsFr,
                    publishedAt: new Date(),
                },
                locale: 'fr',
                status: 'published',
            });
            console.log(`   ✅ Added fr translation`);
        } catch (error) {
            console.error(`   ❌ Error creating fr translation for ${plan.title}:`, error);
        }
    }

    console.log('✅ Plans seeding completed');
};
