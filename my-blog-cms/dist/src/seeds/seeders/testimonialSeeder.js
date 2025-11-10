"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTestimonials = void 0;
const seedTestimonials = async (strapi, testimonialsData) => {
    try {
        console.log('🌱 Starting Testimonials seeding with i18n...');
        for (const testimonialData of testimonialsData) {
            const existingTestimonial = await strapi.entityService.findMany('api::testimonial.testimonial', {
                filters: { author: testimonialData.base.author },
                locale: 'en'
            });
            if (existingTestimonial.length > 0) {
                console.log(`Testimonial by "${testimonialData.base.author}" already exists, skipping`);
                continue;
            }
            const enTestimonial = await strapi.entityService.create('api::testimonial.testimonial', {
                data: {
                    ...testimonialData.base,
                    locale: 'en',
                    publishedAt: new Date()
                }
            });
            console.log(`Created English Testimonial by: "${testimonialData.base.author}" (ID: ${enTestimonial.id})`);
            for (const [localeCode, translation] of Object.entries(testimonialData.translations)) {
                const translationData = {
                    ...testimonialData.base,
                    // @ts-expect-error
                    ...translation,
                    publishedAt: new Date()
                };
                const translatedTestimonial = await strapi.entityService.create('api::testimonial.testimonial', {
                    data: translationData,
                    locale: localeCode,
                    localizations: enTestimonial.id
                });
            }
        }
        console.log('✅ Testimonials seeding completed successfully');
    }
    catch (error) {
        console.error('❌ Error in Testimonials seeding:', error);
        throw error;
    }
};
exports.seedTestimonials = seedTestimonials;
