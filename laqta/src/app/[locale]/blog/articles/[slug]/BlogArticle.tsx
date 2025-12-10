"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { Blog, utils } from "@/lib/strapi";
import { ReadingProgress } from "./ReadingProgress";
import { TableOfContents } from "@/src/app/[locale]/blog/articles/[slug]/TableOfContents";
import { useTranslations } from "next-intl";

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
    const t = useTranslations("blog");
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
            className="min-h-screen bg-gradient-blog-hero"
            dir={locale === "ar" ? "rtl" : "ltr"}
        >
            <ReadingProgress />

            {/* Blue Header with LAQTA Logo Background */}
            <div className="relative py-60 md:pt-24 bg-gradient-blog-hero">
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
                        className="object-contain mt-1 ml-32"
                        style={{ transform: "scale(0.70)" }}
                    />
                </div>

                {/* Title - 2/3 width, centered */}
                <div className="relative z-10 max-w-7xl mx-auto section-px md:pb-24">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-display-lg md:text-display-lg lg:text-display-2xl font-semibold text-white mb-6 w-full md:w-2/3">
                            {blog.title}
                        </h1>
                        {/* Description under title */}
                        {blog.excerpt && (
                            <p className="text-body-lg md:text-body-xl text-neutral-300 w-full md:w-2/3">
                                {blog.excerpt}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Header Image */}
            {blog.header_image && (
                <div className="relative w-full h-64 md:h-96 lg:h-[32rem] overflow-hidden rounded-t-[50px] -mt-12">
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
            <div className="section-px section-py-md bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-12 grid-gap-md lg:gap-12">
                    {/* Left Sidebar - Table of Contents */}
                    <aside className="lg:col-span-3 hidden lg:block">
                        <TableOfContents headings={headings} />
                    </aside>

                    {/* Right Side - Blog Content */}
                    <article className="lg:col-span-9">
                        <div className="bg-white rounded-3xl shadow-xl card-p-md">
                            {/* Blog content uses dedicated .blog-content styles from globals.css */}
                            <div className="blog-content max-w-none">
                                {/* First part of content */}
                                {blog.content_image && contentParts.before ? (
                                    <>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: contentParts.before,
                                            }}
                                        />

                                        {/* Content Image - inserted in the middle */}
                                        <div className="my-12">
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
                                            dangerouslySetInnerHTML={{
                                                __html: contentParts.after,
                                            }}
                                        />
                                    </>
                                ) : (
                                    <div
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
                <div className="section-py-md">
                    <div className="max-w-7xl mx-auto section-px">
                        <h2 className="text-display-sm md:text-display-md font-bold text-white mb-10">
                            {t("youMightAlsoLike")}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 grid-gap-md">
                            {relatedBlogs.slice(0, 2).map((relatedBlog) => (
                                <Link
                                    key={relatedBlog.id}
                                    href={`/blog/articles/${relatedBlog.slug}`}
                                    className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-100 hover:border-accent-blue/30 hover:-translate-y-1"
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
                                        <div className="flex-1 card-p-sm flex flex-col justify-between">
                                            <div>
                                                {/* Category */}
                                                {relatedBlog.category && (
                                                    <div className="mb-3">
                                                        <span
                                                            className="inline-block px-3 py-1.5 text-body-xs font-semibold rounded-full text-white"
                                                            style={{
                                                                backgroundColor:
                                                                    relatedBlog
                                                                        .category
                                                                        .color ||
                                                                    "rgb(124, 58, 237)",
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
                                                <h3 className="text-body-lg font-bold text-neutral-900 mb-3 leading-tight group-hover:text-primary-light transition-colors line-clamp-2">
                                                    {relatedBlog.title}
                                                </h3>

                                                {/* Excerpt */}
                                                <p className="text-neutral-600 text-body-sm leading-relaxed line-clamp-2">
                                                    {relatedBlog.excerpt}
                                                </p>
                                            </div>

                                            {/* Meta */}
                                            <div className="mt-4 text-body-sm text-neutral-500">
                                                {relatedBlog.read_time && (
                                                    <span>
                                                        {relatedBlog.read_time}{" "}
                                                        {t("minRead")}
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
