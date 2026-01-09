import React from "react";

interface PaginationDotsProps {
    total: number;
    current: number;
    onChange: (index: number) => void;
}

export const PaginationDots = ({ total, current, onChange }: PaginationDotsProps) => {
    return (
        <div className="flex justify-center items-center gap-[19px]">
            {[...Array(total)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => onChange(i)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        i === current
                            ? "bg-[#1370ad] rounded-[16px]"
                            : "bg-[#d8e1f4] rounded-[11.429px] hover:bg-[#c5d4ed]"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                />
            ))}
        </div>
    );
};
