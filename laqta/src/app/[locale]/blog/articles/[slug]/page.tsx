import React from "react";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { BlogArticle } from "./BlogArticle";

import { Blog, blogsApi, utils } from "@/lib/strapi";
import { getTranslations } from "next-intl/server";
import {
    generateSEOMetadata,
    generateArticleStructuredData,
    StructuredData,
} from "@/components/ui/SEO";

// Add static generation with revalidation
export const revalidate = 3600; // 1 hour

// Fix interface to include both slug and locale
interface BlogPageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
    try {
        const locales = ["en", "ar", "fr"];
        const params = [];

        // Fetch blogs for each locale separately to get correct slugs
        for (const locale of locales) {
            const response = await blogsApi.getAll({
                pageSize: 100,
                locale,
                fields: ["id", "slug", "title"], // Only fetch necessary fields
            });
            const blogs = response.data || [];

            for (const blog of blogs) {
                // Ensure slug is a string
                const slugValue =
                    typeof blog.slug === "string"
                        ? blog.slug
                        : String(blog.slug || "");

                if (slugValue) {
                    params.push({
                        locale,
                        slug: slugValue,
                    });
                }
            }
        }

        console.log("Generated static params for blogs:", params.length);
        return params;
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

// Fix fetchBlogBySlug to include locale
async function fetchBlogBySlug(
    slug: string,
    locale: string,
): Promise<Blog | null> {
    try {
        const response = await blogsApi.getBySlug(slug, locale);
        return response.data[0] || null;
    } catch (error) {
        return null;
    }
}

// Fix generateMetadata to use both slug and locale
export async function generateMetadata({ params }: BlogPageProps) {
    const { slug, locale } = await params;
    const blog = await fetchBlogBySlug(slug, locale);
    const t = await getTranslations({ locale, namespace: "blog" });

    if (!blog) {
        return {
            title: t("articleNotFound"),
            description: t("articleNotFoundDescription"),
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://laqta.com";
    const canonical = `${siteUrl}/${locale}/blog/articles/${slug}`;
    const ogImage = blog.featured_image?.url
        ? utils.getFileUrl(blog.featured_image.url)
        : undefined;

    return generateSEOMetadata({
        title: blog.meta_title || `${blog.title} - LEQTA`,
        description: blog.meta_description || blog.excerpt || blog.description,
        canonical,
        ogImage,
        ogType: "article",
        article: {
            publishedTime: blog.publishedAt,
            modifiedTime: blog.updatedAt,
            author: blog.author?.name,
            tags: blog.tags?.map((tag) => tag.name),
        },
    });
}

// Fix BlogArticlePage component to use both slug and locale
const BlogArticlePage = async ({ params }: BlogPageProps) => {
    const { slug, locale } = await params;

    const blog = await fetchBlogBySlug(slug, locale);

    if (!blog) {
        notFound();
    }

    // Fetch related blogs with locale
    let relatedBlogs: Blog[] = [];
    try {
        const relatedResponse = await blogsApi.getRelated(blog.id, 3, locale);
        relatedBlogs = relatedResponse.data;
    } catch (error) {
        console.error("Failed to fetch related blogs:", error);
    }

    // Generate structured data for SEO
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://laqta.com";
    const articleUrl = `${siteUrl}/${locale}/blog/articles/${slug}`;
    const articleImage = blog.featured_image?.url
        ? utils.getFileUrl(blog.featured_image.url)
        : undefined;

    const structuredData = generateArticleStructuredData({
        title: blog.title,
        description: blog.excerpt || blog.description,
        publishedTime: blog.publishedAt,
        modifiedTime: blog.updatedAt,
        author: blog.author?.name || "Laqta Team",
        image: articleImage,
        url: articleUrl,
    });

    return (
        <div className="min-h-screen bg-primary">
            {/*<StructuredData data={structuredData} />*/}
            <Navigation />
            <div
                className="animate-fade-in"
                style={{ opacity: 0, animationDelay: "150ms" }}
            >
                <BlogArticle
                    blog={blog}
                    relatedBlogs={relatedBlogs}
                    locale={locale}
                />
            </div>
            <Footer locale={locale} />
        </div>
    );
};

export default BlogArticlePage;
