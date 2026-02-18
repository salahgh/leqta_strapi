/**
 * OurWorksSection Component - Design System
 * Uses design tokens for consistent styling
 * Mobile-first responsive design
 */

import React from "react";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { worksApi, Work, utils } from "@/lib/strapi";
import { defaultWorks } from "@/components/sections/DefaultWorks";
import { getTranslations } from "next-intl/server";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { ComingSoon } from "@/components/ui/ComingSoon";

interface OurWorksSectionProps {
    badge?: string;
    title?: string;
    description?: string;
    works?: Work[];
    className?: string;
    fetchFromStrapi?: boolean;
    locale: string;
}

// Server-side component with revalidation
export async function OurWorksSection({
    badge,
    title,
    description,
    works: providedWorks,
    className = "",
    fetchFromStrapi = true,
    locale,
}: OurWorksSectionProps) {
    const t = await getTranslations("works");
    const tNav = await getTranslations("navigation");
    const tComingSoon = await getTranslations("comingSoon");

    let works: Work[] = [];
    let hasError = false;
    let errorMessage = "";

    // Determine which works to use
    if (providedWorks && providedWorks.length > 0) {
        works = providedWorks;
    } else if (fetchFromStrapi) {
        try {
            const response = await worksApi.getAll({
                populate: "featured_image", // Make sure to populate the featured_image
                sort: "createdAt:desc",
                pageSize: 10,
                locale: locale,
            });

            works = response.data;
        } catch (error) {
            hasError = true;
            errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to load projects";
            console.error("Error fetching works:", error);
        }
    }

    return (
        <div
            className={`min-h-screen relative section-py-lg ${className}`}
            style={{ backgroundColor: "#d5ebf9" }}
        >
            {/* Background Logo */}
            <div className="absolute inset-0 z-0 flex flex-col justify-start items-center -top-16 sm:-top-20 md:-top-24">
                <img
                    src="/images/laqta_logo_courbe.svg"
                    alt="LEQTA Logo Curve"
                    className="w-2/3 aspect-square object-fill z-0 opacity-70"
                />
            </div>

            <div
                className="absolute inset-0 top-0 z-5 blue_gradient"
                style={{ height: "100%" }}
            />

            <div className="section-px z-10 relative bg-transparent max-w-container mx-auto">
                {/* Header Section */}
                <div className="text-center flex flex-col items-center grid-gap-sm pb-6 sm:pb-8 md:pb-12">
                    <div className="animate-slide-down" style={{ opacity: 0 }}>
                        <Badge variant="accent">{badge || t("badge")}</Badge>
                    </div>

                    <h2
                        className="text-neutral-900 animate-slide-up "
                        style={{ opacity: 0, animationDelay: "150ms" }}
                    >
                        {title || t("title")}
                    </h2>

                    <p
                        className="text-secondary-gray text-body-sm md:text-body-md lg:text-body-xl sm:text-body-md text-justify sm:text-center max-w-4xl animate-fade-in"
                        style={{ opacity: 0, animationDelay: "300ms" }}
                    >
                        {description || t("description")}
                    </p>
                </div>

                {/* Projects Section */}
                <div
                    className="stack-gap-lg flex flex-col animate-fade-in"
                    style={{ opacity: 0, animationDelay: "450ms" }}
                >
                    {hasError ? (
                        <ErrorFallback
                            title="Unable to load projects"
                            message={errorMessage}
                        />
                    ) : works.length === 0 ? (
                        <ComingSoon
                            title={tComingSoon("worksTitle")}
                            message={tComingSoon("worksMessage")}
                            variant="light"
                        />
                    ) : (
                        works.map((work, index) => {
                            const workData = work;

                            // Updated image handling to prioritize featured_image
                            let imageUrl = "/images/workImage.jpg"; // default fallback
                            let imageAlt = workData?.title || "Project image";

                            if (workData?.featured_image?.url) {
                                // Use the new featured_image structure
                                imageUrl = utils.getFileUrl(
                                    workData.featured_image.url,
                                );
                                imageAlt =
                                    workData.featured_image.alternativeText ||
                                    workData.title;
                            } else if (
                                (workData as any)?.image?.data?.attributes?.url
                            ) {
                                // Fallback to old image structure for backward compatibility
                                imageUrl = utils.getFileUrl(
                                    (workData as any).image.data.attributes.url,
                                );
                                imageAlt =
                                    (workData as any).image.data.attributes
                                        .alternativeText || workData.title;
                            }

                            return (
                                <ProjectCard
                                    key={work.id || index}
                                    imagePosition={
                                        workData?.imagePosition ||
                                        workData?.image_position ||
                                        "left"
                                    }
                                    category={workData?.category}
                                    title={workData?.title}
                                    description={workData?.description}
                                    metrics={workData?.metrics || ""}
                                    ctaText={
                                        workData?.ctaText ||
                                        workData?.cta_text ||
                                        tNav("learnMore")
                                    }
                                    imageUrl={imageUrl}
                                    imageAlt={imageAlt}
                                    slug={workData?.slug}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

// Add revalidation for server-side rendering
export const revalidate = 600; // 10 minutes

// Client-side version for compatibility
export default function OurWorksWrapper(props: OurWorksSectionProps) {
    return (
        <>
            {/* @ts-expect-error Server Component */}
            <OurWorksSection {...props} />
        </>
    );
}

// Export for server-side usage
export { OurWorksSection as OurWorksSection_SSR };
