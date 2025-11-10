import { StarRating } from "@/components/sections/successStories/StarRating";
import React from "react";

export const TestimonialCard = ({ testimonial, author, role, avatar }) => {
    return (
        <div className="flex flex-col justify-center items-center max-w-4xl mx-auto h-full">
            <StarRating />

            <blockquote className="text-secondary-gray leading-relaxed text-responsive-md text-center py-2 flex-1 md:px-6">
                "{testimonial}"
            </blockquote>

            <div
                className="bg-gray-100 gap-4 border rounded-full flex items-center justify-center p-2 pr-3 min-w-max"
                // style={{ maxWidth: 300 }}
            >
                <div className="md:w-14 md:h-14 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                    <img
                        src="/images/avatar.png"
                        alt="Logo"
                        className="w-full h-full"
                    />
                </div>
                <div className="text-left text-body-xs md:text-body-xl">
                    <div className="font-semibold text-gray-900">{author}</div>
                    <div className="text-gray-500 text-body-xs md:text-body-xl">
                        {role}
                    </div>
                </div>
            </div>
        </div>
    );
};
