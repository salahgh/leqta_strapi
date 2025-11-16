import { worksApi } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Link } from "@/src/i18n/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface WorkDetailPageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
    const { locale, slug } = await params;
    const t = await getTranslations("works");

    // Fetch project data
    let project;
    try {
        const response = await worksApi.getBySlug(slug, {
            populate: "featured_image",
            locale: locale,
        });
        project = response.data;
    } catch (error) {
        console.error("Error fetching project:", error);
        notFound();
    }

    if (!project) {
        notFound();
    }

    // Get full image URL
    const getImageUrl = (url?: string) => {
        if (!url) return null;
        return url.startsWith("http")
            ? url
            : `${process.env.NEXT_PUBLIC_STRAPI_URL_2}${url}`;
    };

    const imageUrl = getImageUrl(project.featured_image?.url);

    return (
        <>
            <Navigation />

            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black overflow-hidden">
                {/* Background Image with Overlay */}
                {imageUrl && (
                    <>
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
                    </>
                )}

                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse" />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-6 py-20 text-center">
                    {/* Category Badge */}
                    <div className="flex justify-center mb-6 animate-slide-down" style={{ opacity: 0 }}>
                        <span className="px-6 py-2 bg-white/10 backdrop-blur-md text-white text-body-md rounded-full border border-white/20">
                            {project.category}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-white text-display-lg md:text-display-xl lg:text-display-2xl font-bold mb-6 max-w-4xl mx-auto leading-tight animate-slide-up" style={{ opacity: 0, animationDelay: "150ms" }}>
                        {project.title}
                    </h1>

                    {/* Metrics */}
                    {project.metrics && (
                        <p className="text-blue-300 text-body-xl md:text-display-xs font-semibold mb-8 animate-fade-in" style={{ opacity: 0, animationDelay: "300ms" }}>
                            {project.metrics}
                        </p>
                    )}
                </div>
            </section>

            {/* Project Details Section */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-6">
                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto animate-fade-in" style={{ opacity: 0, animationDelay: "150ms" }}>
                        {/* Project Image */}
                        {imageUrl && (
                            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={imageUrl}
                                    alt={project.title}
                                    width={1200}
                                    height={675}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        {/* Description */}
                        <div className="prose prose-lg max-w-none mb-12">
                            <h2 className="text-gray-900 text-display-sm font-bold mb-6">
                                {t("projectOverview")}
                            </h2>
                            <p className="text-gray-700 text-body-xl leading-relaxed whitespace-pre-wrap">
                                {project.description}
                            </p>
                        </div>

                        {/* Project Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                                <h3 className="text-gray-900 text-body-xl font-bold mb-3">
                                    {t("category")}
                                </h3>
                                <p className="text-gray-700 text-body-lg">{project.category}</p>
                            </div>

                            {project.metrics && (
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                                    <h3 className="text-gray-900 text-body-xl font-bold mb-3">
                                        {t("results")}
                                    </h3>
                                    <p className="text-gray-700 text-body-lg">{project.metrics}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
                        <h2 className="text-white text-display-sm font-bold mb-4">
                            {t("likeWhatYouSee")}
                        </h2>
                        <p className="text-white/90 text-body-lg mb-6">
                            {t("letsWorkTogether")}
                        </p>
                        <Link href="/contact">
                            <Button
                                variant="secondary"
                                leftIcon={null}
                                rightIcon={<ChevronRight className="w-5 h-5" />}
                                className="bg-white text-primary hover:bg-gray-100"
                            >
                                {t("startYourProject")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Back to Works */}
            <section className="bg-gray-50 py-12">
                <div className="container mx-auto px-6 text-center">
                    <Link href="/#works" className="inline-flex items-center text-primary hover:underline text-body-lg font-medium">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        {t("backToWorks")}
                    </Link>
                </div>
            </section>

            <Footer locale={locale} />
        </>
    );
}

// Generate static params for all projects
export async function generateStaticParams() {
    try {
        const response = await worksApi.getAll({
            pageSize: 100,
        });

        return response.data
            .filter((project) => project.slug)
            .map((project) => ({
                slug: project.slug,
            }));
    } catch (error) {
        console.error("Error generating static params for projects:", error);
        return [];
    }
}

// Revalidate every 10 minutes
export const revalidate = 600;
