import { worksApi } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Link } from "@/src/i18n/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { WorkContent } from "./WorkContent";

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
        <div className="min-h-screen bg-primary" dir={locale === "ar" ? "rtl" : "ltr"}>
            <Navigation />

            {/* Blue Header with LEQTA Logo Background - matching BlogArticle style */}
            <div className="relative py-60 md:pt-24">
                {/* LEQTA Logo Background - larger and more visible */}
                <div
                    className="absolute inset-0 opacity-5 overflow-hidden pt-20"
                    style={{
                        marginLeft: locale === "ar" ? "auto" : 700,
                        marginRight: locale === "ar" ? 700 : "auto",
                    }}
                >
                    <Image
                        src="/images/logo.svg"
                        alt="LEQTA"
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
                        alt="LEQTA"
                        className="object-contain"
                        style={{ transform: "scale(1)" }}
                    />
                </div>

                {/* Content - constrained width */}
                <div className="max-w-container mx-auto section-px relative z-10 pt-24">
                    <div className="w-full lg:w-2/3 space-y-6">
                        {/* Category Badge */}
                        <div className="animate-slide-down" style={{ opacity: 0 }}>
                            <span className="px-6 py-2 bg-white/10 backdrop-blur-md text-white text-body-md rounded-full border border-white/20">
                                {project.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1
                            className="text-white leading-relaxed text-display-lg md:text-display-xl font-bold animate-slide-up"
                            style={{ lineHeight: 1.4, opacity: 0, animationDelay: "150ms" }}
                        >
                            {project.title}
                        </h1>

                        {/* Metrics under title */}
                        {project.metrics && (
                            <p
                                style={{ lineHeight: 1.7, opacity: 0, animationDelay: "300ms" }}
                                className="text-body-lg md:text-body-xl text-secondary animate-fade-in"
                            >
                                {project.metrics}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Header Image */}
            {imageUrl && (
                <div className="relative w-full h-64 md:h-96 lg:h-[32rem] overflow-hidden rounded-t-[50px] -mt-12 max-w-container mx-auto">
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
            <section className="bg-white section-py">
                <div className="max-w-container mx-auto section-px">
                    {/* Main Content with Rich Text */}
                    <WorkContent
                        description={project.description}
                        content={project.content}
                        category={project.category}
                        metrics={project.metrics}
                    />

                    {/* CTA Section */}
                    <div className="max-w-4xl mx-auto bg-primary rounded-2xl p-12 text-center mt-12">
                        <h2 className="text-white text-display-sm font-bold mb-4">
                            {t("likeWhatYouSee")}
                        </h2>
                        <p className="text-secondary text-body-lg mb-6">
                            {t("letsWorkTogether")}
                        </p>
                        <Link href={`/contact?work=${encodeURIComponent(slug)}&workName=${encodeURIComponent(project.title)}`}>
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
                <div className="max-w-container mx-auto section-px text-center">
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
