/**
 * ServicesSection Component - Design System
 * Uses design tokens for consistent styling
 * Mobile-first responsive design
 */

import { ArrowRight, ChartColumnBig, Film, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Badge } from "@/components/ui/Badge";
import { Service, servicesApi, utils } from "@/lib/strapi";
import { getTranslations } from "next-intl/server";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { Link } from "@/src/i18n/navigation";

// Types
interface ServicesSectionProps {
    badge?: string;
    description?: string;
    buttonText?: string;
    services?: Service[];
    className?: string;
    locale: string;
}

// Server-side function to fetch services with revalidation and locale support
// Homepage only shows 3 featured services
async function getServices(
    locale: string,
): Promise<{ data: Service[]; error?: string }> {
    try {
        const response = await servicesApi.getAll({
            populate: "*", // Populate all relations including featured_image and icon_image
            pageSize: 6, // Fetch a few more to filter by slug
            locale: locale,
        });
        // Filter to only services with slugs and limit to 3 for homepage
        const servicesWithSlugs = response.data.filter(service => service.slug);
        return { data: servicesWithSlugs.slice(0, 3) };
    } catch (error) {
        console.error("Error fetching services:", error);
        return {
            data: [],
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to load services",
        };
    }
}

// Get icon component based on string
const getIconComponent = (iconName?: string) => {
    switch (iconName) {
        case "chart":
            return <ChartColumnBig className="w-6 h-6 text-white" />;
        case "rocket":
            return <Rocket className="w-6 h-6 text-white" />;
        case "film":
            return <Film className="w-6 h-6 text-white" />;
        default:
            return <ChartColumnBig className="w-6 h-6 text-white" />;
    }
};

// Transform Strapi services to match ServiceCard props
const transformStrapiService = (service: Service) => ({
    title: service.title,
    description: service.description,
    tags: service.tags,
    gradientFrom: service.gradientFrom,
    gradientTo: service.gradientTo,
    icon: getIconComponent(service.icon),
    slug: service.slug,
    // Add icon_image with full URL
    icon_image: service.icon_image
        ? {
              ...service.icon_image,
              url: utils.getFileUrl(service.icon_image.url),
          }
        : null,
    // Add featured_image with full URL
    featured_image: service.featured_image
        ? {
              ...service.featured_image,
              url: utils.getFileUrl(service.featured_image.url),
          }
        : null,
});

// Main Services Section Component - Server-side with revalidation
export default async function ServicesSection({
    badge,
    description,
    buttonText,
    className = "",
    locale,
}: ServicesSectionProps) {
    const t = await getTranslations("services");

    // Use translations as fallback values
    const finalBadge = badge || t("badge");
    const finalDescription = description || t("description");
    const finalButtonText = buttonText || t("buttonText");

    const { data: strapiServices, error: servicesError } =
        await getServices(locale);

    // Determine which services to render
    const servicesToRender = (() => {
        if (strapiServices.length > 0) {
            return strapiServices.map(transformStrapiService);
        }
        return [];
    })();

    return (
        <section className={`relative overflow-hidden bg-primary ${className}`}>
            {/* Amber Gradient Layer - from bottom to mid */}
            <div className="absolute top-1/4 left-0 right-0 bottom-0 z-10 bg-gradient-to-t from-black via-transparent to-transparent" />

            {/* Vector Curve SVG Layer */}
            <div className="absolute inset-0 z-10 flex justify-center">
                <img
                    src="/images/vector_courbe.svg"
                    alt="Vector Curve Background"
                    className="w-full h-full object-fill"
                />
            </div>

            {/* Content Layer */}
            <div className="relative z-20 flex flex-col">
                {/* Header - Using design system spacing */}
                <div className="text-center flex flex-col items-center grid-gap-sm section-py-lg">
                    <div className="animate-slide-down" style={{ opacity: 0 }}>
                        <Badge size="md" variant="accent">
                            {finalBadge}
                        </Badge>
                    </div>

                    <h2
                        className="text-white text-center animate-slide-up"
                        style={{ opacity: 0, animationDelay: "150ms" }}
                    >
                        {t("title")}
                    </h2>

                    <p
                        className="text-secondary-gray text-body-sm sm:text-body-md lg:text-body-lg xl:text-xl  section-px sm:max-w-sm md:max-w-2xl
                         lg:max-w-4xl xl:max-w-5xl animate-fade-in"
                        style={{ opacity: 0, animationDelay: "300ms" }}
                    >
                        {finalDescription}
                    </p>
                </div>

                {/* Services Grid - Using design system spacing */}
                <div
                    className="section-px animate-fade-in"
                    style={{ opacity: 0, animationDelay: "450ms" }}
                >
                    {servicesError ? (
                        <ErrorFallback
                            title="Unable to load services"
                            message={servicesError}
                        />
                    ) : servicesToRender.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-white text-body-lg">
                                No services available at the moment.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-gap-lg justify-center items-stretch">
                            {servicesToRender.map((service, index) => (
                                <div key={index} className="w-full">
                                    <ServiceCard
                                        title={service.title}
                                        description={service.description}
                                        tags={service.tags}
                                        icon={service.icon}
                                        icon_image={service.icon_image}
                                        featured_image={service.featured_image}
                                        slug={service.slug}
                                        gradientFrom={service.gradientFrom}
                                        gradientTo={service.gradientTo}
                                        className="h-full"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA Button - Using design system spacing */}
                <div
                    className="text-center flex items-center justify-center section-py-lg animate-fade-in"
                    style={{ opacity: 0, animationDelay: "600ms" }}
                >
                    <Link href="/services">
                        <Button
                            variant="primary"
                            size="lg"
                            leftIcon={null}
                            rightIcon={
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            }
                        >
                            {finalButtonText}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

// Add revalidation for server-side rendering
export const revalidate = 600; // 10 minutes
