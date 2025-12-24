import React from "react";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Service, servicesApi, utils } from "@/lib/strapi";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { ChartColumnBig, Film, Rocket } from "lucide-react";

// Disable caching for real-time CMS updates
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Services | Laqta",
    description:
        "Explore Laqta's services - Content marketing, video production, and more.",
};

// Helper function to generate slug from title
function generateSlug(title: string): string {
    return (
        title
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || ""
    );
}

// Server-side function to fetch services with revalidation and locale support
async function getServices(
    locale: string,
): Promise<{ data: Service[]; error?: string }> {
    try {
        const response = await servicesApi.getAll({
            populate: "*",
            pageSize: 20,
            locale: locale,
        });

        // Ensure all services have slugs (generate from title if missing)
        const servicesWithSlugs = response.data.map((service) => ({
            ...service,
            slug:
                service.slug ||
                generateSlug(service.title) ||
                service.documentId,
        }));

        return { data: servicesWithSlugs };
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
    icon_image: service.icon_image
        ? {
              ...service.icon_image,
              url: utils.getFileUrl(service.icon_image.url),
          }
        : null,
    featured_image: service.featured_image
        ? {
              ...service.featured_image,
              url: utils.getFileUrl(service.featured_image.url),
          }
        : null,
});

// Add revalidation for server-side rendering
export const revalidate = 600; // 10 minutes

// Main Component
const ServicesPage = async ({
    params,
}: {
    params: Promise<{ locale: string }>;
}) => {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "services" });

    const { data: strapiServices, error: servicesError } =
        await getServices(locale);

    // Filter out services without slugs (they can't be navigated to)
    const servicesWithSlugs = strapiServices.filter((service) => service.slug);
    const servicesToRender = servicesWithSlugs.map(transformStrapiService);

    return (
        <div className="relative min-h-screen flex flex-col bg-primary">
            {/* Background Logo - similar to OurWorksSection */}

            {/* Vector Curve SVG Layer */}
            <div className="absolute inset-0 z-5 flex justify-center pointer-events-none">
                <img
                    src="/images/vector_courbe.svg"
                    alt="Vector Curve Background"
                    className="w-2/3 h-2/3 object-fill opacity-70"
                />
            </div>

            {/* Gradient overlay from bottom */}
            <div className="absolute top-1/3 left-0 right-0 bottom-0 z-5 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

            <Navigation />

            <main className="relative z-10 flex-1">
                {/* Header Section */}
                <div className="text-center flex flex-col items-center grid-gap-sm section-py-lg section-px">
                    <div className="animate-slide-down" style={{ opacity: 0 }}>
                        <Badge size="md" variant="accent">
                            {t("badge")}
                        </Badge>
                    </div>

                    <h1
                        className="text-white text-center animate-slide-up"
                        style={{ opacity: 0, animationDelay: "150ms" }}
                    >
                        {t("title")}
                    </h1>

                    <p
                        className="text-secondary-gray text-body-sm sm:text-body-md lg:text-body-lg xl:text-xl max-w-4xl animate-fade-in"
                        style={{ opacity: 0, animationDelay: "300ms" }}
                    >
                        {t("description")}
                    </p>
                </div>

                {/* Services Grid */}
                <div
                    className="section-px section-py-md animate-fade-in"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-gap-lg max-w-7xl mx-auto">
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
            </main>

            {/* Footer */}
            <Footer locale={locale} />
        </div>
    );
};

export default ServicesPage;
