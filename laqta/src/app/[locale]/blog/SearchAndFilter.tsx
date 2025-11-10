"use client";

import React, { useState } from "react";
import { Category } from "@/lib/strapi";

interface SearchAndFilterProps {
    onSearch: (query: string) => void;
    onCategoryFilter: (category: string) => void;
    onTagFilter: (tag: string) => void;
    onSort: (sort: string) => void;
    onClearFilters: () => void;
    categories: Category[];
    searchQuery: string;
    selectedCategory: string;
    selectedTag: string;
    sortBy: string;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    onSearch,
    onCategoryFilter,
    onSort,
    onClearFilters,
    categories,
    searchQuery,
    selectedCategory,
    sortBy
}) => {
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(localSearchQuery);
    };

    const sortOptions = [
        { value: "publishedAt:desc", label: "Latest First" },
        { value: "publishedAt:asc", label: "Oldest First" },
        { value: "title:asc", label: "Title A-Z" },
        { value: "title:desc", label: "Title Z-A" },
        { value: "views:desc", label: "Most Popular" }
    ];

    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={localSearchQuery}
                        onChange={(e) => setLocalSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                    >
                        🔍
                    </button>
                </form>

                {/* Category Filter */}
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryFilter(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                </select>

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={(e) => onSort(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Clear Filters */}
                <button
                    onClick={onClearFilters}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
};