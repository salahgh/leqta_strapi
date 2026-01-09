"use client";

import React, { useState, useEffect } from "react";
import { BlogCard } from "./BlogCard";
import { SearchAndFilter } from "./SearchAndFilter";
import { Pagination } from "./Pagination";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { Blog, Category, blogsApi } from "@/lib/strapi";
import { useTranslations, useLocale } from "next-intl";

interface BlogsClientProps {
    initialLatestBlogs: Blog[];
    categories: Category[];
}

export const BlogsClient: React.FC<BlogsClientProps> = ({
    initialLatestBlogs,
    categories,
}) => {
    const t = useTranslations("blog");
    const locale = useLocale();
    const [blogs, setBlogs] = useState<Blog[]>(initialLatestBlogs);
    // const [featuredBlogs] = useState<Blog[]>(initialFeaturedBlogs);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [sortBy, setSortBy] = useState("publishedAt:desc");

    const pageSize = 6;

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await blogsApi.getAll({
                page: currentPage,
                pageSize,
                search: searchQuery || undefined,
                category: selectedCategory || undefined,
                tag: selectedTag || undefined,
                sort: sortBy,
                locale: locale,
            });

            setBlogs(response.data);
            if (response.meta?.pagination) {
                setTotalPages(response.meta.pagination.pageCount);
            }
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [currentPage, searchQuery, selectedCategory, selectedTag, sortBy]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleTagFilter = (tag: string) => {
        setSelectedTag(tag);
        setCurrentPage(1);
    };

    const handleSort = (sort: string) => {
        setSortBy(sort);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("");
        setSelectedTag("");
        setSortBy("publishedAt:desc");
        setCurrentPage(1);
    };

    return (
        <>
            {/* Hero Section */}
            <section className="section-px pt-6 sm:pt-8 md:pt-12 lg:pt-16 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
                <div className="max-w-container mx-auto">
                    <div className="text-center md:text-left mb-8 sm:mb-10 md:mb-12">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6">
                            {t("title")}
                        </h1>
                        <p className="text-body-sm sm:text-body-md md:text-body-lg lg:text-body-xl text-gray-300 max-w-3xl">
                            {t("description")}
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="section-px pb-12 sm:pb-14 md:pb-16">
                <div className="max-w-container mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : blogs.length > 0 ? (
                        <>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
                                {blogs.map((blog) => {
                                    console.log("blog", blog);
                                    return (
                                        <BlogCard key={blog.id} blog={blog} locale={locale} />
                                    );
                                })}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-300 text-lg">
                                {t("noArticles")}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <NewsletterForm variant="blog" />
        </>
    );
};
