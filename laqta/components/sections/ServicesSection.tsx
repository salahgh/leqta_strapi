import { ArrowRight, ChartColumnBig, Film, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Badge } from "@/components/ui/Badge";
import { Service, servicesApi } from "@/lib/strapi";
import { getTranslations } from "next-intl/server";
import { ErrorFallback } from "@/components/ui/ErrorFallback";

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
async function getServices(locale: string): Promise<{ data: Service[], error?: string }> {
    try {
        const response = await servicesApi.getAll({
            populate: "featured_image", // Make sure to populate the featured_image
            pageSize: 10,
            locale: locale,
        });
        return { data: response.data };
    } catch (error) {
        console.error("Error fetching services:", error);
        return {
            data: [],
            error: error instanceof Error ? error.message : 'Failed to load services'
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
    slug: service.slug, // Add slug for linking
    // Add featured_image with full URL
    featured_image: service.featured_image ? {
        ...service.featured_image,
        url: service.featured_image.url.startsWith('http')
            ? service.featured_image.url
            : `${process.env.NEXT_PUBLIC_STRAPI_URL_2}${service.featured_image.url}`
    } : null,
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
    const finalButtonText = buttonText || "Go to services";

    const { data: strapiServices, error: servicesError } = await getServices(locale);

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
            <div
                className="absolute top-1/4 left-0 right-0 bottom-0 z-10"
                style={{
                    background:
                        "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(245, 158, 11, 0) 50%, transparent 100%)",
                }}
            />

            {/* Vector Curve SVG Layer */}
            <div className="absolute inset-0 z-10 flex justify-center ">
                <img
                    src="/images/vector_courbe.svg"
                    alt="Vector Curve Background"
                    className="w-full h-full object-fill "
                />
            </div>

            {/* Content Layer */}
            <div className="relative z-20 flex flex-col">
                {/* Header - Fully Responsive */}
                <div className="text-center flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 2xl:py-32">
                    <div className="animate-slide-down" style={{ opacity: 0 }}>
                        <Badge variant="default">{finalBadge}</Badge>
                    </div>

                    <h2 className="text-white text-center animate-slide-up" style={{ opacity: 0, animationDelay: "150ms" }}>{t("title")}</h2>

                    <p className="text-secondary-gray text-justify px-4 sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xlsm:px-6 md:px-8 animate-fade-in" style={{ opacity: 0, animationDelay: "300ms" }}>
                        {finalDescription}
                    </p>
                </div>

                {/* Services Grid - Fully Responsive */}
                <div
                    className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 animate-fade-in"
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
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3
                            gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14 justify-center items-stretch">
                            {servicesToRender.map((service, index) => (
                                <div key={index} className="w-full">
                                    <ServiceCard
                                        title={service.title}
                                        description={service.description}
                                        tags={service.tags}
                                        gradientFrom={service.gradientFrom}
                                        gradientTo={service.gradientTo}
                                        icon={service.icon}
                                        featured_image={service.featured_image}
                                        slug={service.slug}
                                        className="h-full"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA Button - Fully Responsive */}
                <div
                    className="text-center flex items-center justify-center mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24
                2xl:mt-28 pb-8 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-24 2xl:pb-32 animate-fade-in"
                    style={{ opacity: 0, animationDelay: "600ms" }}
                >
                    <div className="h-10 sm:h-11 md:h-12 lg:h-14 xl:h-16 2xl:h-18">
                        <Button
                            variant="primary"
                            leftIcon={null}
                            rightIcon={
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                            }
                            className=""
                        >
                            {finalButtonText}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Add revalidation for server-side rendering
export const revalidate = 600; // 10 minutes
