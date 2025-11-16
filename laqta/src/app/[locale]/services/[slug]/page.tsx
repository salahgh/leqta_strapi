import { servicesApi } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Link } from "@/src/i18n/navigation";
import { ChevronRight, ChartColumnBig, Film, Rocket } from "lucide-react";

interface ServiceDetailPageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

// Get icon component based on string
const getIconComponent = (iconName?: string) => {
    switch (iconName) {
        case "chart":
            return <ChartColumnBig className="w-12 h-12 text-white" />;
        case "rocket":
            return <Rocket className="w-12 h-12 text-white" />;
        case "film":
            return <Film className="w-12 h-12 text-white" />;
        default:
            return <ChartColumnBig className="w-12 h-12 text-white" />;
    }
};

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
    const { locale, slug } = await params;
    const t = await getTranslations("services");

    // Fetch service data
    let service;
    try {
        const response = await servicesApi.getBySlug(slug, {
            populate: "featured_image",
            locale: locale,
        });
        service = response.data;
    } catch (error) {
        console.error("Error fetching service:", error);
        notFound();
    }

    if (!service) {
        notFound();
    }

    // Get full image URL
    const getImageUrl = (url?: string) => {
        if (!url) return null;
        return url.startsWith("http")
            ? url
            : `${process.env.NEXT_PUBLIC_STRAPI_URL_2}${url}`;
    };

    const imageUrl = getImageUrl(service.featured_image?.url);

    return (
        <>
            <Navigation />

            {/* Hero Section */}
            <section
                className="relative min-h-[60vh] flex items-center justify-center bg-primary overflow-hidden"
                style={{
                    background: service.gradientFrom && service.gradientTo
                        ? `linear-gradient(135deg, ${service.gradientFrom} 0%, ${service.gradientTo} 100%)`
                        : undefined,
                }}
            >
                {/* Background Image with Overlay */}
                {imageUrl && (
                    <>
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60" />
                    </>
                )}

                {/* Content */}
                <div className="relative z-10 container mx-auto px-6 py-20 text-center">
                    {/* Icon */}
                    {service.icon && (
                        <div className="flex justify-center mb-6 animate-slide-down" style={{ opacity: 0 }}>
                            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                {getIconComponent(service.icon)}
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-white text-display-lg md:text-display-xl font-bold mb-6 animate-slide-up" style={{ opacity: 0, animationDelay: "150ms" }}>
                        {service.title}
                    </h1>

                    {/* Tags */}
                    {service.tags && service.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in" style={{ opacity: 0, animationDelay: "300ms" }}>
                            {service.tags.map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-white/20 text-white text-body-md rounded-full backdrop-blur-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Content Section */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    {/* Description */}
                    <div className="prose prose-lg max-w-none mb-12 animate-fade-in" style={{ opacity: 0, animationDelay: "150ms" }}>
                        <p className="text-gray-700 text-body-xl leading-relaxed whitespace-pre-wrap">
                            {service.description}
                        </p>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center animate-fade-in" style={{ opacity: 0, animationDelay: "300ms" }}>
                        <h2 className="text-gray-900 text-display-sm font-bold mb-4">
                            {t("interestedInService")}
                        </h2>
                        <p className="text-gray-600 text-body-lg mb-6">
                            {t("contactUsDescription")}
                        </p>
                        <Link href="/contact">
                            <Button
                                variant="primary"
                                leftIcon={null}
                                rightIcon={<ChevronRight className="w-5 h-5" />}
                            >
                                {t("getStarted")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Back to Services */}
            <section className="bg-gray-50 py-12">
                <div className="container mx-auto px-6 text-center">
                    <Link href="/services" className="inline-flex items-center text-primary hover:underline text-body-lg font-medium">
                        <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
                        {t("backToServices")}
                    </Link>
                </div>
            </section>

            <Footer locale={locale} />
        </>
    );
}

// Generate static params for all services
export async function generateStaticParams() {
    try {
        const response = await servicesApi.getAll({
            pageSize: 100,
        });

        return response.data
            .filter((service) => service.slug)
            .map((service) => ({
                slug: service.slug,
            }));
    } catch (error) {
        console.error("Error generating static params for services:", error);
        return [];
    }
}

// Revalidate every 10 minutes
export const revalidate = 600;
