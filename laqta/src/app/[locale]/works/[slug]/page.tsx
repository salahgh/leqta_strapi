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
        <div className="min-h-screen" dir={locale === "ar" ? "rtl" : "ltr"}>
            <Navigation />

            {/* Blue Header with LAQTA Logo Background - matching BlogArticle style */}
            <div className="relative py-60 md:pt-24 bg-primary">
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
                            transform: locale === "ar" ? "scale(0.70) scaleX(-1)" : "scale(0.70)",
                            marginLeft: locale === "ar" ? undefined : "14rem",
                            marginRight: locale === "ar" ? "14rem" : undefined,
                        }}
                    />
                </div>

                {/* Curve SVG Background */}
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

                {/* Content */}
                <div
                    className="w-2/3 pt-24 relative z-10"
                    style={{
                        marginLeft: locale === "ar" ? undefined : "6rem",
                        marginRight: locale === "ar" ? "6rem" : undefined,
                    }}
                >
                    {/* Category Badge */}
                    <div className="mb-6 animate-slide-down" style={{ opacity: 0 }}>
                        <span className="px-6 py-2 bg-white/10 backdrop-blur-md text-white text-body-md rounded-full border border-white/20">
                            {project.category}
                        </span>
                    </div>

                    {/* Title */}
                    <h1
                        className="text-white leading-relaxed w-full text-display-lg md:text-display-xl font-bold animate-slide-up"
                        style={{ lineHeight: 1.4, opacity: 0, animationDelay: "150ms" }}
                    >
                        {project.title}
                    </h1>

                    {/* Metrics under title */}
                    {project.metrics && (
                        <p
                            style={{ lineHeight: 1.7 }}
                            className="text-body-lg md:text-body-xl text-secondary mt-4 w-full md:w-2/3 animate-fade-in"
                        >
                            {project.metrics}
                        </p>
                    )}
                </div>
            </div>

            {/* Header Image */}
            {imageUrl && (
                <div className="relative w-full h-64 md:h-96 lg:h-[32rem] overflow-hidden rounded-t-[50px] -mt-12">
                    <Image
                        src={imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                </div>
            )}

            {/* Project Details Section */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-6">
                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto animate-fade-in" style={{ opacity: 0, animationDelay: "150ms" }}>
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
                    <div className="max-w-4xl mx-auto bg-primary rounded-2xl p-12 text-center">
                        <h2 className="text-white text-display-sm font-bold mb-4">
                            {t("likeWhatYouSee")}
                        </h2>
                        <p className="text-secondary text-body-lg mb-6">
                            {t("letsWorkTogether")}
                        </p>
                        <Link href="/contact">
                            <Button
                                variant="primary"
                                rightIcon={<ChevronRight className="w-5 h-5" />}
                            >
                                {t("startYourProject")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Back to Works */}
            <section className="bg-primary py-12">
                <div className="container mx-auto px-6 text-center">
                    <Link href="/#works" className="inline-flex items-center text-white hover:text-secondary text-body-lg font-medium transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        {t("backToWorks")}
                    </Link>
                </div>
            </section>

            <Footer locale={locale} />
        </div>
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
