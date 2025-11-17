"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { Blog, utils } from "@/lib/strapi";
import { ReadingProgress } from "./ReadingProgress";
import { TableOfContents } from "@/src/app/[locale]/blog/articles/[slug]/TableOfContents";

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

// Blog Article Component
export const BlogArticle: React.FC<{
    blog: Blog;
    relatedBlogs: Blog[];
    locale?: string;
}> = ({ blog, relatedBlogs, locale = "en" }) => {
    const [headings, setHeadings] = useState<
        Array<{ id: string; text: string; level: number }>
    >([]);
    const [contentParts, setContentParts] = useState<{
        before: string;
        after: string;
    }>({
        before: blog.content,
        after: "",
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const extractedHeadings = extractHeadings(blog.content);
            setHeadings(extractedHeadings);

            // Add IDs to headings in the content
            const contentDiv = document.querySelector(".blog-content");
            if (contentDiv) {
                const headingElements =
                    contentDiv.querySelectorAll("h1, h2, h3");
                headingElements.forEach((heading, index) => {
                    heading.id = `heading-${index}`;
                });
            }

            // Split content to insert image in the middle (if content_image exists)
            if (blog.content_image) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(blog.content, "text/html");
                const paragraphs = doc.querySelectorAll("p, h2, h3");
                const midPoint = Math.floor(paragraphs.length / 2);

                if (paragraphs.length > 3 && paragraphs[midPoint]) {
                    // Get content before and after the midpoint
                    const beforeContent: HTMLElement[] = [];
                    const afterContent: HTMLElement[] = [];

                    paragraphs.forEach((el, index) => {
                        if (index < midPoint) {
                            beforeContent.push(el as HTMLElement);
                        } else {
                            afterContent.push(el as HTMLElement);
                        }
                    });

                    setContentParts({
                        before: beforeContent
                            .map((el) => el.outerHTML)
                            .join(""),
                        after: afterContent.map((el) => el.outerHTML).join(""),
                    });
                }
            }
        }
    }, [blog.content, blog.content_image]);

    return (
        <div
            className="min-h-screen"
            style={{
                background:
                    "linear-gradient(135deg, #1e293b 0%, #1e3a8a 50%, #1e293b 100%)",
            }}
            dir={locale === "ar" ? "rtl" : "ltr"}
        >
            <ReadingProgress />

            {/* Blue Header with LAQTA Logo Background */}
            <div
                className="relative pt-60 md:pt-24"
                style={{
                    background:
                        "linear-gradient(45deg, #1e293b 0%, #1e3a8a 50%, #1e293b 100%)",
                }}
            >
                {/* LAQTA Logo Background - larger and more visible */}
                <div
                    className="absolute inset-0 opacity-5 overflow-hidden pt-20"
                    style={{
                        marginLeft: locale === "ar" ? "auto" : 700,
                        marginRight: locale === "ar" ? 700 : "auto",
                    }}
                >
                    <Image
                        src="/images/logo.svg"
                        alt="LAQTA"
                        fill
                        className="object-contain mt-10"
                        style={{ transform: "scale(0.65)" }}
                    />
                </div>

                {/* Title - 2/3 width, centered */}
                <div className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8 md:pb-24 pt-10 pb-30">
                    <div className="max-w-4xl mx-auto  pt-14 pb-14">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 w-2/3">
                            {blog.title}
                        </h1>
                        {/* Description under title */}
                        {blog.excerpt && (
                            <p className="text-lg md:text-xl text-gray-300 leading-relaxed w-2/3">
                                {blog.excerpt}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Header Image */}
            {blog.header_image && (
                <div
                    className="relative w-full h-64 md:h-96 lg:h-[32rem] overflow-hidden rounded-t-2xl"
                    style={{
                        borderTopLeftRadius: 50,
                        borderTopRightRadius: 50,
                        marginTop: -50,
                    }}
                >
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
            <div className="px-16 sm:px-6 lg:px-40 py-12 md:py-16 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Sidebar - Table of Contents */}
                    <aside className="lg:col-span-3 hidden lg:block">
                        <TableOfContents headings={headings} />
                    </aside>

                    {/* Right Side - Blog Content */}
                    <article className="lg:col-span-9">
                        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                            <div className="prose prose-lg max-w-none blog-content prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-900 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded text-gray-900">
                                {/* First part of content */}
                                {blog.content_image && contentParts.before ? (
                                    <>
                                        <div
                                            className="text-gray-900"
                                            style={{ color: "#111827" }}
                                            dangerouslySetInnerHTML={{
                                                __html: contentParts.before,
                                            }}
                                        />

                                        {/* Content Image - inserted in the middle */}
                                        <div className="my-12 not-prose">
                                            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                                <Image
                                                    src={utils.getFileUrl(
                                                        blog.content_image.url,
                                                    )}
                                                    alt={
                                                        blog.content_image
                                                            .alternativeText ||
                                                        "Content image"
                                                    }
                                                    fill
                                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>

                                        {/* Second part of content */}
                                        <div
                                            className="text-gray-900"
                                            style={{ color: "#111827" }}
                                            dangerouslySetInnerHTML={{
                                                __html: contentParts.after,
                                            }}
                                        />
                                    </>
                                ) : (
                                    <div
                                        className="text-gray-900"
                                        style={{ color: "#111827" }}
                                        dangerouslySetInnerHTML={{
                                            __html: blog.content,
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </article>
                </div>
            </div>

            {/* You Might Also Like Section */}
            {relatedBlogs.length > 0 && (
                <div className="py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
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
                                        {relatedBlog.header_image && (
                                            <div className="relative w-48 md:w-56 flex-shrink-0 overflow-hidden">
                                                <Image
                                                    src={utils.getFileUrl(
                                                        relatedBlog.header_image
                                                            .url,
                                                    )}
                                                    alt={
                                                        relatedBlog.header_image
                                                            .alternativeText ||
                                                        relatedBlog.title
                                                    }
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
                                                            style={{
                                                                backgroundColor:
                                                                    relatedBlog
                                                                        .category
                                                                        .color ||
                                                                    "#7C3AED",
                                                            }}
                                                        >
                                                            {
                                                                relatedBlog
                                                                    .category
                                                                    .name
                                                            }
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
                                                {relatedBlog.read_time && (
                                                    <span>
                                                        {relatedBlog.read_time}{" "}
                                                        min read
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
