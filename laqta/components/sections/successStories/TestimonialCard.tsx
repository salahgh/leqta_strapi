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
        <div className="flex flex-col justify-center items-center w-2/3 space-y-12 mx-auto h-full">
            <StarRating />

            <blockquote className="leading-relaxed lg:text-body-2xl font-medium text-center py-2 flex-1 md:px-6 text-gray-900">
                "{testimonial}"
            </blockquote>

            <div
                className="bg-gray-100 gap-4 border rounded-full flex items-center justify-center p-2 pe-3 min-w-max"
            >
                <div className="md:w-14 md:h-14 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                        src={avatarUrl}
                        alt={avatarAlt}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="text-start text-body-xs md:text-body-xl">
                    <div className="font-semibold text-gray-900">{author}</div>
                    <div className="text-gray-500 text-body-xs md:text-body-xl">
                        {role}
                    </div>
                </div>
            </div>
        </div>
    );
};
