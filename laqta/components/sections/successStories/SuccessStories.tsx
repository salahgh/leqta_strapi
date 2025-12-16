import React from "react";
import { Testimonial, testimonialsApi } from "@/lib/strapi";
import { TestimonialsClient } from "@/components/sections/successStories/TestimonialsClient";

interface TestimonialsProps {
    testimonials?: Testimonial[];
    locale: string;
}

const TestimonialsSection = async ({
    testimonials: providedTestimonials,
    locale,
}: TestimonialsProps = {}) => {
    // Fetch testimonials with fallback logic
    let testimonials = providedTestimonials;

    if (!testimonials) {
        try {
            // Fetch testimonials for current locale
            const response = await testimonialsApi.getAll({
                pageSize: 10,
                locale: locale,
                populate: "*",
            });
            testimonials = response.data;

            // If not English, fetch English testimonials for avatars
            if (locale !== "en" && testimonials && testimonials.length > 0) {
                const enResponse = await testimonialsApi.getAll({
                    pageSize: 10,
                    locale: "en",
                    populate: "*",
                });
                const enTestimonials = enResponse.data;

                // Map avatars from English to localized testimonials by documentId
                if (enTestimonials && enTestimonials.length > 0) {
                    const enAvatarMap = new Map(
                        enTestimonials.map((t) => [t.documentId, t.avatar])
                    );
                    testimonials = testimonials.map((t) => ({
                        ...t,
                        avatar: t.avatar || enAvatarMap.get(t.documentId) || null,
                    }));
                }
            }
        } catch (error) {
            console.warn(
                "Failed to fetch testimonials from Strapi, using defaults:",
                error,
            );
        }
    }

    return (
        <TestimonialsClient testimonials={testimonials ? testimonials : []} />
    );
};

export default TestimonialsSection;
