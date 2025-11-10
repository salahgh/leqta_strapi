import React from "react";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { worksApi, Work, utils } from "@/lib/strapi";
import { defaultWorks } from "@/components/sections/DefaultWorks";
import { getTranslations } from "next-intl/server";
import { ErrorFallback } from "@/components/ui/ErrorFallback";

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

    let works: Work[] = [];
    let hasError = false;
    let errorMessage = '';

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
            errorMessage = error instanceof Error ? error.message : 'Failed to load projects';
            console.error('Error fetching works:', error);
        }
    }

    return (
        <div
            className={`min-h-screen relative bg-gray-100 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 ${className}`}
        >
            <div
                className="absolute inset-0 z-0 flex flex-col justify-start items-center "
                style={{ top: -100 }}
            >
                <img
                    src="/images/laqta_logo_courbe.svg"
                    alt="LAQTA Logo Curve"
                    className="w-2/3 aspect-square object-fill z-0 opacity-40"
                />
            </div>
            {/*<div*/}
            {/*    className={"absolute bg-amber-300 w-full top-0"}*/}
            {/*    style={{*/}
            {/*        height: 1000,*/}
            {/*        top: 0,*/}
            {/*    }}*/}
            {/*></div>*/}
            <div className="px-3 sm:px-6 md:px-12 lg:px-12 xl:px-24 2xl:px-32 z-10">
                {/* Header Section */}
                <div
                    className="text-center flex flex-col
                items-center gap-2 md:gap-6 lg:gap-5 xl:gap-6 md:pb-8"
                >
                    <Badge variant="default" className="">
                        {badge || t("badge")}
                    </Badge>

                    <h2 className="text-gray-900">{title || t("title")}</h2>

                    <p
                        className="text-secondary-gray text-responsive-lg text-justify px-4 md:px-10 md:text-center
                    lg:px-24 xl:px-32 2xl:px-40 max-w-4xl"
                    >
                        {description || t("description")}
                    </p>
                </div>

                {/* Projects Section */}
                <div className="space-y-2 sm:space-y-4 md:space-y-6 lg:space-y-12 xl:space-y-16 flex flex-col">
                    {hasError ? (
                        <ErrorFallback
                            title="Unable to load projects"
                            message={errorMessage}
                        />
                    ) : works.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-neutral-600 text-body-lg">
                                No projects available at the moment.
                            </p>
                        </div>
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
                        } else if (workData?.image?.data?.attributes?.url) {
                            // Fallback to old image structure for backward compatibility
                            imageUrl = utils.getFileUrl(
                                workData.image.data.attributes.url,
                            );
                            imageAlt =
                                workData.image.data.attributes
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
                            />
                        );
                    }))}
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
