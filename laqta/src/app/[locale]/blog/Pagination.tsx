"use client";

import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i as never);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i as never);
                pages.push("..." as never);
                pages.push(totalPages as never);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1 as never);
                pages.push("..." as never);
                for (let i = totalPages - 3; i <= totalPages; i++)
                    pages.push(i as never);
            } else {
                pages.push(1 as never);
                pages.push("..." as never);
                for (let i = currentPage - 1; i <= currentPage + 1; i++)
                    pages.push(i as never);
                pages.push("..." as never);
                pages.push(totalPages as never);
            }
        }

        return pages;
    };

    return (
        <div className="flex justify-center items-center space-x-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Previous
            </button>

            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() =>
                        typeof page === "number" && onPageChange(page)
                    }
                    disabled={page === ("..." as never)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        page === currentPage
                            ? "bg-blue-500 text-white"
                            : page === ("..." as never)
                              ? "text-gray-400 cursor-default"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Next
            </button>
        </div>
    );
};
