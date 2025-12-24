"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { Blog, utils } from "@/lib/strapi";
import { ReadingProgress } from "./ReadingProgress";
import { TableOfContents } from "@/src/app/[locale]/blog/articles/[slug]/TableOfContents";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Extract headings from Markdown content for table of contents
const extractHeadings = (content: string) => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: Array<{ id: string; text: string; level: number }> = [];
    let match;
    let index = 0;

    while ((match = headingRegex.exec(content)) !== null) {
        headings.push({
            id: `heading-${index}`,
            text: match[2].trim(),
            level: match[1].length,
        });
        index++;
    }

    return headings;
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

            // Add IDs to headings in the content after render
            setTimeout(() => {
                const contentDiv = document.querySelector(".blog-content");
                if (contentDiv) {
                    const headingElements =
                        contentDiv.querySelectorAll("h1, h2, h3");
                    headingElements.forEach((heading, index) => {
                        heading.id = `heading-${index}`;
                    });
                }
            }, 100);

            // Split content for image insertion (for Markdown)
            if (blog.content_image) {
                const lines = blog.content.split("\n");
                const midPoint = Math.floor(lines.length / 2);

                if (lines.length > 6) {
                    setContentParts({
                        before: lines.slice(0, midPoint).join("\n"),
                        after: lines.slice(midPoint).join("\n"),
                    });
                }
            }
        }
    }, [blog.content, blog.content_image]);

    return (
        <div className="min-h-screen" dir={locale === "ar" ? "rtl" : "ltr"}>
            <ReadingProgress />

            {/* Blue Header with LAQTA Logo Background */}
            <div className="relative py-52 md:pt-24">
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
                        className="object-contain mt-1"
                        style={{
                            transform:
                                locale === "ar"
                                    ? "scale(0.70) scaleX(-1)"
                                    : "scale(0.70)",
                            marginLeft: locale === "ar" ? undefined : "14rem",
                            marginRight: locale === "ar" ? "14rem" : undefined,
                        }}
                    />
                </div>

                <div
                    className="absolute inset-0 overflow-hidden pt-52"
                    style={{
                        transform: locale === "ar" ? "scaleX(-1)" : undefined,
                    }}
                >
                    <img
                        src="/images/vector9.svg"
                        alt="LAQTA"
                        className="object-contain"
                        style={{ transform: "scale(1)" }}
                    />
                </div>

                <div
                    className="w-2/3 pt-16 space-y-6"
                    style={{
                        marginLeft: locale === "ar" ? undefined : "6rem",
                        marginRight: locale === "ar" ? "6rem" : undefined,
                    }}
                >
                    <h1
                        className="text-white leading-relaxed w-full text-display-xs sm:text-display-sm md:text-display-md lg:text-display-lg"
                        style={{ lineHeight: 1.4 }}
                    >
                        {blog.title}
                    </h1>
                    {/* Description under title */}
                    {blog.excerpt && (
                        <p
                            style={{ lineHeight: 1.7 }}
                            className="text-body-lg md:text-body-xl text-neutral-300 w-full md:w-2/3"
                        >
                            {blog.excerpt}
                        </p>
                    )}
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
                            <div className="blog-content max-w-none prose prose-lg prose-neutral">
                                {/* First part of content */}
                                {blog.content_image && contentParts.after ? (
                                    <>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {contentParts.before}
                                        </ReactMarkdown>

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
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {contentParts.after}
                                        </ReactMarkdown>
                                    </>
                                ) : (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {blog.content}
                                    </ReactMarkdown>
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
