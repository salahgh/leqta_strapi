import { StarRating } from "@/components/sections/successStories/StarRating";
import { utils } from "@/lib/strapi";
import React from "react";

interface TestimonialCardProps {
    testimonial: string;
    author: string;
    role: string;
    avatar?: {
        url?: string;
        alternativeText?: string;
        data?: {
            attributes?: {
                url?: string;
                alternativeText?: string;
            };
        };
    } | null;
}

export const TestimonialCard = ({ testimonial, author, role, avatar }: TestimonialCardProps) => {
    // Handle different Strapi response formats
    const getAvatarUrl = () => {
        if (!avatar) return "/images/avatar.png";
        // Direct format (Strapi v5 flat response)
        if (avatar.url) return utils.getFileUrl(avatar.url);
        // Nested format (Strapi v4 style)
        if (avatar.data?.attributes?.url) return utils.getFileUrl(avatar.data.attributes.url);
        return "/images/avatar.png";
    };

    const getAvatarAlt = () => {
        if (!avatar) return author;
        if (avatar.alternativeText) return avatar.alternativeText;
        if (avatar.data?.attributes?.alternativeText) return avatar.data.attributes.alternativeText;
        return author;
    };

    const avatarUrl = getAvatarUrl();
    const avatarAlt = getAvatarAlt();

    return (
        <div className="flex flex-col justify-center items-center w-full space-y-6 md:space-y-8 lg:space-y-16 mx-auto h-full px-4 sm:px-0">
            {/* Star Rating */}
            <StarRating />

            {/* Testimonial Quote */}
            <blockquote className="font-medium text-[#38383a] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] leading-[1.58] tracking-[1.192px] text-center max-w-full">
                "{testimonial}"
            </blockquote>

            {/* Author Card - Figma style */}
            <div className="bg-white rounded-full shadow-[0px_0px_35.3px_0px_rgba(13,17,55,0.1)] flex items-center px-4 md:px-5 py-3 md:py-3.5 gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0">
                    <img
                        src={avatarUrl}
                        alt={avatarAlt}
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Author Info */}
                <div className="text-start pr-4">
                    <div className="font-semibold text-primary text-[16px] md:text-[20px] leading-normal">
                        {author}
                    </div>
                    <div className="font-medium text-[#949499] text-[14px] md:text-[16px] leading-normal">
                        {role}
                    </div>
                </div>
            </div>
        </div>
    );
};
