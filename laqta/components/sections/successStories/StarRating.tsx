import React from "react";
import { Star } from "lucide-react";

export const StarRating = () => {
    return (
        <div className="flex items-center gap-3">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className="w-6 h-6 fill-[#F5A623] text-[#F5A623]"
                    strokeWidth={0}
                />
            ))}
        </div>
    );
};
