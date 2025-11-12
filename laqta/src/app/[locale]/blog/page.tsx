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
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 min-h-screen">
            <Navigation />
            <section className="px-4 md:px-8 pt-8 md:pt-16 pb-12 md:pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center md:text-left mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            {t("title")}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl">
                            {t("description")}
                        </p>
                    </div>
                    {/* Featured Blogs */}
                    {featuredBlogs.length > 0 && (
                        <div className="mb-16">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                                {t("featuredStories")}
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredBlogs.map((blog) => (
                                    <BlogCard
                                        key={blog.id}
                                        blog={blog}
                                        variant="featured"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
            Latest Blogs Grid
            <section className="px-4 md:px-8 pb-16">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                        {t("latestArticles")}
                    </h2>
                    {latestBlogs.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {latestBlogs.map((blog) => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-300 text-lg">
                                {t("noArticles")}
                            </p>
                        </div>
                    )}
                    {/* View All Link */}
                    <div className="text-center">
                        <Link
                            href={`/blog/all`}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {t("viewAllArticles")}
                        </Link>
                    </div>
                </div>
            </section>
            Newsletter Subscription
            <NewsletterSubscription />
            <Footer locale={locale} />
        </div>
    );
};

export default BlogPage;
