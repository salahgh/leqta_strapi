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
            const response = await testimonialsApi.getAll({
                pageSize: 10,
                locale: locale,
            });
            testimonials = response.data;
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
