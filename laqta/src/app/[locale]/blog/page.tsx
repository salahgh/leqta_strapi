import React from "react";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { BlogCard } from "./BlogCard";
import { NewsletterSubscription } from "./NewsletterSubscription";
import { Blog, blogsApi, categoriesApi, Category } from "@/lib/strapi";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";

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
            className="min-h-screen"
            style={{ background: 'linear-gradient(135deg, #1e293b 0%, #1e3a8a 50%, #1e293b 100%)' }}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
            <Navigation />

            {/* Hero Section */}
            <section className="px-4 md:px-8 pt-20 md:pt-28 pb-16 md:pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 md:mb-20">
                        {/* Badge */}
                        <div className="inline-block mb-8 animate-slide-down" style={{ opacity: 0 }}>
                            <span className="px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
                                Insights & Stories
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up" style={{ opacity: 0, animationDelay: "150ms" }}>
                            The LAQTA Blog
                        </h1>

                        {/* Description */}
                        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ opacity: 0, animationDelay: "300ms" }}>
                            Data-led technology strategies that boost brand engagement and impact. Explore insights in talent stories from our studios in Algeria. Explore real-world impact.
                        </p>
                    </div>

                    {/* Blog Grid with Logo Background */}
                    {latestBlogs.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in" style={{ opacity: 0, animationDelay: "450ms" }}>
                            {latestBlogs.map((blog) => (
                                <BlogCard key={blog.id} blog={blog} variant="grid-with-logo" locale={locale} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-300 text-lg">
                                {t("noArticles")}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Subscription */}
            <NewsletterSubscription />
            <Footer locale={locale} />
        </div>
    );
};

export default BlogPage;
