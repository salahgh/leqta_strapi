import React from "react";
import Image from "next/image";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { BlogCard } from "./BlogCard";
import { NewsletterSubscription } from "./NewsletterSubscription";
import { Blog, blogsApi, categoriesApi, Category } from "@/lib/strapi";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { Badge } from "@/components/ui/Badge";

// Static generation with revalidation every hour
export const revalidate = 3600;

// Force static generation
export const dynamic = "force-static";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "blog" });

    return {
        title: t("blogTitle"),
        description: t("blogMetaDescription"),
    };
}

const BlogPage = async ({
    params,
}: {
    params: Promise<{ locale: string }>;
}) => {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "blog" });

    let featuredBlogs: Blog[] = [];
    let latestBlogs: Blog[] = [];
    let categories: Category[] = [];

    try {
        // Fetch featured blogs for static generation
        const featuredResponse = await blogsApi.getFeatured({
            pageSize: 3,
            sort: "publishedAt:desc",
            locale: locale,
        });
        featuredBlogs = featuredResponse.data;

        // Fetch latest blogs for static generation
        const latestResponse = await blogsApi.getAll({
            pageSize: 9,
            sort: "publishedAt:desc",
            locale: locale,
        });
        latestBlogs = latestResponse.data; // This line is missing!

        // Fetch categories
        const categoriesResponse = await categoriesApi.getAll(locale);
        categories = categoriesResponse.data;
    } catch (error) {
        console.error("Failed to fetch blog data:", error);
    }

    return (
        <div
            className="min-h-screen bg-gradient-blog-hero"
            dir={locale === "ar" ? "rtl" : "ltr"}
        >
            <Navigation />

            {/* Hero Section with Logo Background */}
            <section className="relative section-px pt-20 md:pt-28 pb-16 md:pb-24">
                {/* LAQTA Logo Background Overlay */}
                <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
                    <Image
                        src="/images/logo.svg"
                        alt="LAQTA"
                        fill
                        className="object-contain"
                        style={{ transform: "scale(1.2)" }}
                    />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16 md:mb-20">
                        {/* Badge */}
                        <div
                            className="inline-block mb-8 animate-slide-down"
                            style={{ opacity: 0 }}
                        >
                            <Badge size={"md"} variant={"accent"}>
                                {t("badge")}
                            </Badge>
                        </div>

                        {/* Main Heading */}
                        <h2
                            className="mb-6 animate-slide-up"
                            style={{ opacity: 0, animationDelay: "150ms" }}
                        >
                            {t("title")}
                        </h2>

                        {/* Description */}
                        <p
                            className="text-display-2xl md:text-body-lg text-secondary-gray max-w-3xl mx-auto leading-relaxed animate-fade-in"
                            style={{ opacity: 0, animationDelay: "300ms" }}
                        >
                            {t("description")}
                        </p>
                    </div>

                    {/* Blog Grid - smaller spacing, equal aspect ratio */}
                    {latestBlogs.length > 0 ? (
                        <div
                            className="grid md:grid-cols-2 lg:grid-cols-3 grid-gap-sm animate-fade-in"
                            style={{ opacity: 0, animationDelay: "450ms" }}
                        >
                            {latestBlogs.map((blog) => (
                                <BlogCard
                                    key={blog.id}
                                    blog={blog}
                                    variant="grid-with-logo"
                                    locale={locale}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center section-py-md">
                            <p className="text-secondary-gray text-body-lg">
                                {t("noArticles")}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Subscription */}
            <Footer locale={locale} />
        </div>
    );
};

export default BlogPage;
