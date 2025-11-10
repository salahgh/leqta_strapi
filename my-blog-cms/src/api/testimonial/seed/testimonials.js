const testimonials = [
    {
        testimonial: "Before subscribing to this service, our marketing was all over the place. We struggled with social media, our website traffic was low, and email campaigns barely got any response. Since joining, we've seen a 250% increase in organic traffic and our customer engagement has never been better.",
        author: "Lyes OUAZZI",
        role: "Digital Agency Owner",
        avatar: "LO",
        featured: true,
        publishedAt: new Date(),
    },
    {
        testimonial: "The transformation has been incredible. Their strategic approach helped us identify our target audience better and create content that actually converts. Our ROI has improved by 180% in just 6 months.",
        author: "Sarah Johnson",
        role: "Marketing Director",
        avatar: "SJ",
        featured: true,
        publishedAt: new Date(),
    },
    {
        testimonial: "Working with this team has been a game-changer for our startup. They helped us build a solid marketing foundation from scratch and our user acquisition costs dropped by 40%.",
        author: "Mike Chen",
        role: "Startup Founder",
        avatar: "MC",
        featured: false,
        publishedAt: new Date(),
    },
    {
        testimonial: "Their data-driven approach and attention to detail is unmatched. We've seen consistent growth month over month, and their reporting keeps us informed every step of the way.",
        author: "Emma Williams",
        role: "E-commerce Owner",
        avatar: "EW",
        featured: false,
        publishedAt: new Date(),
    },
    {
        testimonial: "The best investment we've made for our business. Their team understands our industry and delivered results that exceeded our expectations. Highly recommended!",
        author: "David Rodriguez",
        role: "CEO",
        avatar: "DR",
        featured: true,
        publishedAt: new Date(),
    },
];

async function seedTestimonials() {
    try {
        const existingTestimonials = await strapi.entityService.findMany('api::testimonial.testimonial');

        if (existingTestimonials.length === 0) {
            console.log('Seeding testimonials...');

            for (const testimonial of testimonials) {
                await strapi.entityService.create('api::testimonial.testimonial', {
                    data: testimonial
                });
            }

            console.log('Testimonials seeded successfully!');
        } else {
            console.log('Testimonials already exist, skipping seed.');
        }
    } catch (error) {
        console.error('Error seeding testimonials:', error);
    }
}

module.exports = { seedTestimonials };