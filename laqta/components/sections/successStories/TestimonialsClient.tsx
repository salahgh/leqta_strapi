"use client";

import { Testimonial } from "@/lib/strapi";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCard } from "@/components/sections/successStories/TestimonialCard";
import { PaginationDots } from "@/components/sections/successStories/PaginationDots";
import { useTranslations } from "next-intl";
import "@/components/sections/styles.css";

export const TestimonialsClient = ({
    testimonials,
}: {
    testimonials: Testimonial[];
}) => {
    const t = useTranslations("testimonials");
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Navigation functions
    const goToPrevious = () => {
        setCurrentTestimonial((prev) =>
            prev === 0 ? testimonials?.length - 1 : prev - 1,
        );
    };

    const goToNext = () => {
        setCurrentTestimonial((prev) =>
            prev === testimonials?.length - 1 ? 0 : prev + 1,
        );
    };

    // Touch handlers for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                goToPrevious();
            } else if (e.key === "ArrowRight") {
                goToNext();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            goToNext();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [currentTestimonial]);

    return (
        <section
            className="relative section-py-lg overflow-hidden"
            style={{ backgroundColor: "#d5ebf9" }}
        >
            {/* Decorative Background */}
            <div className="absolute inset-0 z-0 flex flex-col justify-start items-center">
                <img
                    src="/images/laqta_logo_courbe.svg"
                    alt=""
                    className="w-2/3 aspect-square object-fill opacity-70"
                    aria-hidden="true"
                />
            </div>

            {/* Gradient Overlay */}
            <div
                className="absolute inset-0 z-5 blue_gradient"
                style={{ height: "100%" }}
            />

            {/* Header section */}
            <div className="relative z-10 text-center section-px space-y-6 max-w-container mx-auto">
                {/* Badge */}
                <div className="animate-slide-down" style={{ opacity: 0 }}>
                    <span className="inline-flex items-center justify-center px-7 py-4 rounded-full border border-accent-blue text-accent-blue font-gotham font-medium text-[20px] tracking-[-0.4px] shadow-[0px_1px_6px_1.248px_rgba(0,47,255,0.4)]">
                        {t("badge")}
                    </span>
                </div>

                {/* Title */}
                <h2
                    className="font-medium text-primary text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-[1.192px] max-w-[832px] mx-auto animate-slide-up"
                    style={{ opacity: 0, animationDelay: "150ms" }}
                >
                    {t("successStoriesTitle")}
                </h2>
            </div>
            {/* Testimonial carousel container */}
            <div
                className="relative z-10 section-px animate-fade-in max-w-container mx-auto mt-8"
                style={{ opacity: 0, animationDelay: "300ms" }}
            >
                <button
                    onClick={goToPrevious}
                    className="hidden lg:flex absolute -left-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full
                     shadow-lg items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label={t("previousTestimonial")}
                >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <button
                    onClick={goToNext}
                    className="hidden lg:flex absolute -right-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center
                     justify-center hover:bg-gray-50 transition-colors"
                    aria-label={t("nextTestimonial")}
                >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
                {/* Testimonial content with touch handlers */}
                <div
                    className="overflow-hidden"
                    dir="ltr"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${currentTestimonial * 100}%)`,
                        }}
                    >
                        {testimonials?.map((testimonial, index) => (
                            <div
                                key={testimonial.id || index}
                                className="w-full flex-shrink-0"
                                dir="auto"
                            >
                                <TestimonialCard
                                    testimonial={testimonial.testimonial}
                                    author={testimonial.author}
                                    role={testimonial.role}
                                    avatar={testimonial.avatar}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pagination dots */}
            <div className="relative z-10 mt-16 md:mt-24">
                <PaginationDots
                    total={testimonials?.length}
                    current={currentTestimonial}
                    onChange={setCurrentTestimonial}
                />
            </div>

            {/* Swipe indicator for mobile */}
            <div className="relative z-10 md:hidden text-center text-sm text-gray-500">
                {t("swipeIndicator")}
            </div>
        </section>
    );
};
