import React, { Suspense } from "react";
import { Testimonial } from "@/lib/strapi";
import TestimonialsSection from "@/components/sections/successStories/SuccessStories";
import { useTranslations } from "next-intl";

interface TestimonialsSectionWrapperProps {
    testimonials?: Testimonial[];
    loadingComponent?: React.ReactNode;
    locale: string;
}

// Sync wrapper component
export const TestimonialsSectionWrapper: React.FC<
    TestimonialsSectionWrapperProps
> = ({ testimonials, loadingComponent, locale }) => {
    const t = useTranslations('testimonials');
    
    const defaultLoadingComponent = (
        <div className="py-16 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-600">{t('loadingText')}</span>
        </div>
    );

    return (
        <Suspense fallback={loadingComponent || defaultLoadingComponent}>
            {/* @ts-expect-error Server Component */}
            <TestimonialsSection locale={locale} testimonials={testimonials} />
        </Suspense>
    );
};
