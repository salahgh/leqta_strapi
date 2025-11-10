"use client";

import { Testimonial } from "@/lib/strapi";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCard } from "@/components/sections/successStories/TestimonialCard";
import { PaginationDots } from "@/components/sections/successStories/PaginationDots";
import LetsStartProjectSection from "@/components/sections/LetsStartProjectSection";
import { useTranslations } from "next-intl";

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
        <div className="relative bg-gray-200 md:pt-20 pt-12 flex flex-col gap-8">
            {/* Header section */}
            <div className="text-center px-3 space-y-6 ">
                <Badge>{t("badge")}</Badge>

                <h1 className="leading-tight text-gray-800">
                    {t("successStoriesTitle")}
                </h1>
            </div>
            {/* Testimonial carousel container */}
            <div className="relative px-3 ">
                <button
                    onClick={goToPrevious}
                    className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full
                     shadow-lg items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label={t("previousTestimonial")}
                >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <button
                    onClick={goToNext}
                    className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center
                     justify-center hover:bg-gray-50 transition-colors"
                    aria-label={t("nextTestimonial")}
                >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
                {/* Testimonial content with touch handlers */}
                <div
                    className="overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                            transform: `translateX(-${currentTestimonial * 100}%)`,
                        }}
                    >
                        {testimonials?.map((testimonial, index) => (
                            <div
                                key={testimonial.id || index}
                                className="w-full flex-shrink-0"
                            >
                                <TestimonialCard
                                    testimonial={testimonial.testimonial}
                                    author={testimonial.author}
                                    role={testimonial.role}
                                    avatar={
                                        testimonial.avatar ||
                                        testimonial.author
                                            .substring(0, 2)
                                            .toUpperCase()
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <PaginationDots
                total={testimonials?.length}
                current={currentTestimonial}
                onChange={setCurrentTestimonial}
            />
            {/* Swipe indicator for mobile */}
            <div className="md:hidden text-center text-sm text-gray-500 mb-8">
                {t("swipeIndicator")}
            </div>
            <LetsStartProjectSection />
        </div>
    );
};
