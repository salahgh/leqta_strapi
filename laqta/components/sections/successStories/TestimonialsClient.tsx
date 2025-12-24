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
        <div
            className="relative md:pt-16 pt-8 flex flex-col gap-4 md:gap-8 space-y-4 md:space-y-8 overflow-hidden"
            style={{ backgroundColor: "#d5ebf9" }}
        >
            {/* Background LAQTA Logo */}
            <div className="absolute inset-0 z-0 flex flex-col justify-start items-center -top-16 sm:-top-20 md:-top-24">
                <img
                    src="/images/laqta_logo_courbe.svg"
                    alt="LAQTA Logo Curve"
                    className="w-2/3 aspect-square object-fill z-0 opacity-70"
                />
            </div>

            <div
                className="absolute inset-0 z-5 blue_gradient"
                style={{ height: "60%" }}
            />

            {/* Header section */}
            <div className="text-center px-3 space-y-6">
                <div className="animate-slide-down" style={{ opacity: 0 }}>
                    <Badge variant="accent" size={"md"}>
                        {t("badge")}
                    </Badge>
                </div>

                <h2
                    className="leading-tight text-gray-900 animate-slide-up w-1/2 mx-auto"
                    style={{ opacity: 0, animationDelay: "150ms" }}
                >
                    {t("successStoriesTitle")}
                </h2>
            </div>
            {/* Testimonial carousel container */}
            <div
                className="relative px-3 animate-fade-in space-y-12"
                style={{ opacity: 0, animationDelay: "300ms" }}
            >
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
                    dir="ltr"
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
