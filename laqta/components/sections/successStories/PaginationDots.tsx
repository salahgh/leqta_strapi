import React from "react";

export const PaginationDots = ({ total, current, onChange }) => {
    return (
        <div className="flex justify-center gap-4 mt-4" style={{ gap: 19 }}>
            {[...Array(total)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => onChange(i)}
                    className={`w-4 h-4 rounded-full transition-colors ${
                        i === current ? "bg-blue-500" : "bg-gray-300"
                    }`}
                    style={{
                        backgroundColor: i === current ? "#136fac" : "#d6dff2",
                    }}
                    aria-label={`Go to testimonial ${i + 1}`}
                />
            ))}
        </div>
    );
};
