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
            pageSize: 1000,
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
        <div className="bg-primary" dir={locale === "ar" ? "rtl" : "ltr"}>
            <Navigation />

            {/* Hero Section with Logo Background */}
            <section className="relative pt-8 sm:pt-12 md:pt-20 lg:pt-28 pb-8 sm:pb-12 md:pb-16 lg:pb-24 overflow-hidden">
                {/* LEQTA Logo Background Overlay */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    {/* Union SVG Layer */}
                    <div className="absolute inset-0">
                        <img
                            src="/images/union.svg"
                            alt=""
                            className="w-full"
                            aria-hidden="true"
                        />
                    </div>

                    {/* Vector Courbe SVG Layer */}
                    <div className="absolute w-[80%] lg:w-1/2 top-0 left-1/2 transform -translate-x-1/2 opacity-70">
                        <img
                            src="/images/vector_courbe.svg"
                            alt=""
                            width={800}
                            height={800}
                            className="h-full aspect-square object-cover"
                            aria-hidden="true"
                        />
                    </div>
                    <div
                        className="absolute left-0 opacity-80"
                        style={{ marginTop: 700 }}
                    >
                        <img
                            src="/images/vector9.svg"
                            alt=""
                            width={800}
                            height={800}
                            className="object-cover w-3/4 scale-120"
                            aria-hidden="true"
                        />
                    </div>
                </div>

                <div className="relative z-10 max-w-container mx-auto section-px">
                    <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
                        {/* Badge */}
                        <div
                            className="inline-block mb-3 sm:mb-4 md:mb-6 animate-slide-down"
                            style={{ opacity: 0 }}
                        >
                            <Badge size={"md"} variant={"accent"}>
                                {t("badge")}
                            </Badge>
                        </div>

                        {/* Main Heading */}
                        <h2
                            className="text-[24px] sm:text-display-sm md:text-display-md lg:text-display-lg mb-3 sm:mb-4 animate-slide-up"
                            style={{ opacity: 0, animationDelay: "150ms" }}
                        >
                            {t("title")}
                        </h2>

                        {/* Description */}
                        <p
                            className="text-body-xs sm:text-body-sm md:text-body-md text-secondary-gray max-w-3xl mx-auto leading-relaxed animate-fade-in"
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
            <Footer locale={locale} />
        </div>
    );
};

export default BlogPage;
