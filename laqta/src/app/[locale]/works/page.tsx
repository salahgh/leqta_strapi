import React from "react";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Work, worksApi, utils } from "@/lib/strapi";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata = {
    title: "Our Works | Laqta",
    description:
        "Explore Laqta's portfolio of creative projects and case studies.",
};

// Server-side function to fetch works with revalidation and locale support
async function getWorks(
    locale: string,
): Promise<{ data: Work[]; error?: string }> {
    try {
        const response = await worksApi.getAll({
            populate: "featured_image",
            sort: "createdAt:desc",
            pageSize: 20,
            locale: locale,
        });
        return { data: response.data };
    } catch (error) {
        console.error("Error fetching works:", error);
        return {
            data: [],
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to load works",
        };
    }
}

// Disable caching for real-time CMS updates
export const dynamic = "force-dynamic";

// Main Component
const WorksPage = async ({
    params,
}: {
    params: Promise<{ locale: string }>;
}) => {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "works" });
    const tNav = await getTranslations({ locale, namespace: "navigation" });
    const tComingSoon = await getTranslations({ locale, namespace: "comingSoon" });

    const { data: works, error: worksError } = await getWorks(locale);

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Background with light blue color like homepage works section */}
            <div
                className="absolute inset-0 z-0"
                style={{ backgroundColor: "#d5ebf9" }}
            />

            {/* Background Logo */}
            <div className="absolute inset-0 z-0 flex flex-col justify-start items-center -top-16 sm:-top-20 md:-top-24 pointer-events-none">
                <img
                    src="/images/laqta_logo_courbe.svg"
                    alt="LEQTA Logo Curve"
                    className="w-2/3 aspect-square object-fill z-0 opacity-70"
                />
            </div>

            {/* Gradient overlay */}
            <div
                className="absolute inset-0 top-0 z-5 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(213, 235, 249, 0.3) 0%, rgba(213, 235, 249, 0.9) 50%, rgba(213, 235, 249, 1) 100%)",
                }}
            />

            <Navigation />

            <main className="relative z-10 flex-1">
                {/* Header Section */}
                <div className="text-center flex flex-col items-center grid-gap-sm section-py-lg section-px">
                    <div
                        className="animate-slide-down"
                        style={{ opacity: 0 }}
                    >
                        <Badge size="md" variant="accent">
                            {t("badge")}
                        </Badge>
                    </div>

                    <h1
                        className="text-neutral-900 text-center animate-slide-up"
                        style={{ opacity: 0, animationDelay: "150ms" }}
                    >
                        {t("title")}
                    </h1>

                    <p
                        className="text-secondary-gray text-body-sm sm:text-body-md lg:text-body-lg xl:text-xl max-w-4xl text-center animate-fade-in"
                        style={{ opacity: 0, animationDelay: "300ms" }}
                    >
                        {t("description")}
                    </p>
                </div>

                {/* Works List */}
                <div
                    className="section-px section-py-md animate-fade-in"
                    style={{ opacity: 0, animationDelay: "450ms" }}
                >
                    {worksError ? (
                        <ErrorFallback
                            title="Unable to load works"
                            message={worksError}
                        />
                    ) : works.length === 0 ? (
                        <ComingSoon
                            title={tComingSoon("worksTitle")}
                            message={tComingSoon("worksMessage")}
                            variant="light"
                        />
                    ) : (
                        <div className="stack-gap-lg flex flex-col max-w-7xl mx-auto">
                            {works.map((work, index) => {
                                // Handle image URL
                                let imageUrl = "/images/workImage.jpg";
                                let imageAlt = work.title || "Project image";

                                if (work.featured_image?.url) {
                                    imageUrl = utils.getFileUrl(
                                        work.featured_image.url,
                                    );
                                    imageAlt =
                                        work.featured_image.alternativeText ||
                                        work.title;
                                }

                                return (
                                    <ProjectCard
                                        key={work.id || index}
                                        imagePosition={
                                            work.imagePosition || "left"
                                        }
                                        category={work.category}
                                        title={work.title}
                                        description={work.description}
                                        metrics={work.metrics || ""}
                                        ctaText={
                                            work.ctaText ||
                                            work.cta_text ||
                                            tNav("learnMore")
                                        }
                                        imageUrl={imageUrl}
                                        imageAlt={imageAlt}
                                        slug={work.slug}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <Footer locale={locale} />
        </div>
    );
};

export default WorksPage;
