"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { Blog, utils } from "@/lib/strapi";
import { ReadingProgress } from "./ReadingProgress";

// Extract headings from HTML content for table of contents
const extractHeadings = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = doc.querySelectorAll("h1, h2, h3");

    return Array.from(headings).map((heading, index) => ({
        id: `heading-${index}`,
        text: heading.textContent || "",
        level: parseInt(heading.tagName.substring(1)),
    }));
};

// Table of Contents Component
const TableOfContents: React.FC<{ headings: Array<{ id: string; text: string; level: number }> }> = ({ headings }) => {
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0px -35% 0px" }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Table of Contents
            </h3>
            <nav className="space-y-2">
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-sm transition-colors ${
                            activeId === heading.id
                                ? "text-blue-600 font-semibold"
                                : "text-gray-600 hover:text-blue-600"
                        }`}
                        style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                    >
                        {heading.text}
                    </a>
                ))}
            </nav>
        </div>
    );
};

// Blog Article Component
export const BlogArticle: React.FC<{ blog: Blog; relatedBlogs: Blog[]; locale?: string }> = ({ blog, relatedBlogs, locale = "en" }) => {
    const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const extractedHeadings = extractHeadings(blog.content);
            setHeadings(extractedHeadings);

            // Add IDs to headings in the content
            const contentDiv = document.querySelector(".blog-content");
            if (contentDiv) {
                const headingElements = contentDiv.querySelectorAll("h1, h2, h3");
                headingElements.forEach((heading, index) => {
                    heading.id = `heading-${index}`;
                });
            }
        }
    }, [blog.content]);

    return (
        <div className="min-h-screen bg-white" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <ReadingProgress />

            {/* Blue Header with LAQTA Logo Background */}
            <div className="relative" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #1e3a8a 50%, #1e293b 100%)' }}>
                {/* LAQTA Logo Background */}
                <div className="absolute inset-0 opacity-5 overflow-hidden">
                    <Image
                        src="/images/logo.svg"
                        alt="LAQTA"
                        fill
                        className="object-contain"
                        style={{ transform: 'scale(1.5)' }}
                    />
                </div>

                {/* Title */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        {blog.title}
                    </h1>
                </div>
            </div>

            {/* Header Image */}
            {blog.header_image && (
                <div className="relative w-full h-64 md:h-96 lg:h-[32rem] overflow-hidden">
                    <Image
                        src={utils.getFileUrl(blog.header_image.url)}
                        alt={blog.header_image.alternativeText || blog.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                </div>
            )}

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Sidebar - Table of Contents */}
                    <aside className="lg:col-span-3 hidden lg:block">
                        <TableOfContents headings={headings} />
                    </aside>

                    {/* Right Side - Blog Content */}
                    <article className="lg:col-span-9">
                        <div className="prose prose-lg max-w-none blog-content prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-900 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded text-gray-900">
                            <div
                                className="text-gray-900"
                                style={{ color: '#111827' }}
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />

                            {/* Content Image */}
                            {blog.content_image && (
                                <div className="my-12">
                                    <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                        <Image
                                            src={utils.getFileUrl(blog.content_image.url)}
                                            alt={blog.content_image.alternativeText || "Content image"}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </article>
                </div>
            </div>

            {/* You Might Also Like Section */}
            {relatedBlogs.length > 0 && (
                <div className="bg-gray-50 py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
                            You Might Also Like
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {relatedBlogs.slice(0, 2).map((relatedBlog) => (
                                <Link
                                    key={relatedBlog.id}
                                    href={`/blog/articles/${relatedBlog.slug}`}
                                    className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
                                >
                                    <div className="flex h-full">
                                        {/* Image on Left */}
                                        {relatedBlog.featured_image && (
                                            <div className="relative w-48 md:w-56 flex-shrink-0 overflow-hidden">
                                                <Image
                                                    src={utils.getFileUrl(relatedBlog.featured_image.url)}
                                                    alt={relatedBlog.featured_image.alternativeText || relatedBlog.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    sizes="(max-width: 768px) 192px, 224px"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}

                                        {/* Details on Right */}
                                        <div className="flex-1 p-6 flex flex-col justify-between">
                                            <div>
                                                {/* Category */}
                                                {relatedBlog.category && (
                                                    <div className="mb-3">
                                                        <span
                                                            className="inline-block px-3 py-1 text-xs font-semibold rounded-full text-white"
                                                            style={{ backgroundColor: relatedBlog.category.color || "#7C3AED" }}
                                                        >
                                                            {relatedBlog.category.name}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Title */}
                                                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {relatedBlog.title}
                                                </h3>

                                                {/* Excerpt */}
                                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                                    {relatedBlog.excerpt}
                                                </p>
                                            </div>

                                            {/* Meta */}
                                            <div className="mt-4 text-sm text-gray-500">
                                                {relatedBlog.read_time && <span>{relatedBlog.read_time} min read</span>}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .blog-content h1,
                .blog-content h2,
                .blog-content h3,
                .blog-content h4,
                .blog-content h5,
                .blog-content h6 {
                    @apply font-bold text-gray-900 mt-8 mb-4 scroll-mt-24;
                    color: #111827 !important;
                }

                .blog-content h1 { @apply text-3xl; }
                .blog-content h2 { @apply text-2xl; }
                .blog-content h3 { @apply text-xl; }
                .blog-content h4 { @apply text-lg; }

                .blog-content p {
                    @apply mb-6 text-gray-900 leading-relaxed;
                    color: #111827 !important;
                }

                .blog-content a {
                    @apply text-blue-600 hover:text-blue-800 underline transition-colors;
                }

                .blog-content ul,
                .blog-content ol {
                    @apply mb-6 pl-6;
                }

                .blog-content li {
                    @apply mb-2 text-gray-900;
                    color: #111827 !important;
                }

                .blog-content strong {
                    color: #111827 !important;
                }

                .blog-content blockquote {
                    @apply border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg italic text-gray-800;
                }

                .blog-content code {
                    @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono;
                }

                .blog-content pre {
                    @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6;
                }

                .blog-content img {
                    @apply rounded-lg shadow-lg my-6;
                }
            `}</style>
        </div>
    );
};
