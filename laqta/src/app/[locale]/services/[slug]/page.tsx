import { servicesApi, utils } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Link } from "@/src/i18n/navigation";
import {
    ChevronRight,
    ChevronLeft,
    ChartColumnBig,
    Film,
    Rocket,
} from "lucide-react";

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
            return <ChartColumnBig className="w-8 h-8 text-white" />;
        case "rocket":
            return <Rocket className="w-8 h-8 text-white" />;
        case "film":
            return <Film className="w-8 h-8 text-white" />;
        default:
            return <ChartColumnBig className="w-8 h-8 text-white" />;
    }
};

export default async function ServiceDetailPage({
    params,
}: ServiceDetailPageProps) {
    const { locale, slug } = await params;
    const t = await getTranslations("services");
    const tNav = await getTranslations("navigation");

    // Fetch service data
    let service;
    try {
        const response = await servicesApi.getBySlug(slug, {
            populate: "*",
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

    // Get full image URLs
    const featuredImageUrl = service.featured_image?.url
        ? utils.getFileUrl(service.featured_image.url)
        : null;

    const iconImageUrl = service.icon_image?.url
        ? utils.getFileUrl(service.icon_image.url)
        : null;

    // Gradient colors
    const gradientFrom = service.gradientFrom || "#7F56D9";
    const gradientTo = service.gradientTo || "#5B21B6";
    const glowColor = `${gradientFrom}80`;

    return (
        <div className="relative min-h-screen flex flex-col bg-neutral-900">
            {/* Background Gradient Layer */}
            <div
                className="absolute inset-0 z-0 opacity-40"
                style={{
                    background: `linear-gradient(180deg, ${gradientFrom} 0%, ${gradientTo} 50%, transparent 100%)`,
                }}
            />

            {/* Vector Curve SVG Layer */}
            {/*<div className="absolute inset-0 z-[1] flex justify-center pointer-events-none">*/}
            {/*    <img*/}
            {/*        src="/images/vector_courbe.svg"*/}
            {/*        alt=""*/}
            {/*        className="w-full h-full object-fill opacity-30"*/}
            {/*        aria-hidden="true"*/}
            {/*    />*/}
            {/*</div>*/}

            {/* Laqta Logo Background */}
            <div className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none">
                <img
                    src="/images/laqta_logo_courbe.svg"
                    alt=""
                    className="w-1/2 max-w-3xl aspect-square object-contain opacity-10"
                    aria-hidden="true"
                />
            </div>

            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 z-[3] bg-gradient-to-b from-transparent via-neutral-900/50 to-neutral-900 pointer-events-none" />

            <Navigation />

            <main className="relative z-10 flex-1">
                {/* Hero Section */}
                <section className="section-px section-py-lg">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Button */}
                        <Link
                            href="/services"
                            className="inline-flex items-center text-neutral-400 hover:text-white transition-colors mb-8 group"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
                            <span className="text-body-md">
                                {t("backToServices")}
                            </span>
                        </Link>

                        {/* Service Card Style Container */}
                        <div
                            className="relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-800/80 backdrop-blur-sm"
                            style={{
                                boxShadow: `0 0 60px ${glowColor}, 0 0 120px ${glowColor}`,
                            }}
                        >
                            {/* Featured Image Background */}
                            {featuredImageUrl && (
                                <div
                                    className="absolute inset-0 z-[1] "
                                    style={{
                                        backgroundImage: `url(${featuredImageUrl})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        opacity: 1,
                                    }}
                                />
                            )}

                            {/* Gradient Overlay */}
                            <div
                                className="absolute inset-0 z-[2] opacity-60"
                                style={{
                                    background: `linear-gradient(0deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
                                }}
                            />

                            {/* Dark overlay for text readability */}
                            <div className="absolute inset-0 z-[3] bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent" />

                            {/* Content */}
                            <div className="relative z-10 p-8 md:p-12">
                                {/* Icon with Glow */}
                                <div className="flex justify-end mb-8">
                                    <div
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center overflow-hidden bg-white/20 backdrop-blur-sm"
                                        style={{
                                            boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor}`,
                                        }}
                                    >
                                        {iconImageUrl ? (
                                            <img
                                                src={iconImageUrl}
                                                alt={service.title}
                                                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                                            />
                                        ) : (
                                            getIconComponent(service.icon)
                                        )}
                                    </div>
                                </div>

                                {/* Title */}
                                <h1
                                    className="text-white text-display-md md:text-display-lg font-bold mb-6 animate-slide-up"
                                    style={{ opacity: 0 }}
                                >
                                    {service.title}
                                </h1>

                                {/* Tags */}
                                {service.tags && service.tags.length > 0 && (
                                    <div
                                        className="flex flex-wrap gap-2 mb-8 animate-fade-in"
                                        style={{
                                            opacity: 0,
                                            animationDelay: "150ms",
                                        }}
                                    >
                                        {service.tags.map(
                                            (tag: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 bg-white/10 text-neutral-300 text-body-sm rounded-full border border-white/10 backdrop-blur-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                )}

                                {/* Description */}
                                <p
                                    className="text-neutral-300 text-body-lg md:text-body-xl leading-relaxed animate-fade-in"
                                    style={{
                                        opacity: 0,
                                        animationDelay: "300ms",
                                    }}
                                >
                                    {service.description}
                                </p>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div
                            className="mt-12 p-8 md:p-12 rounded-2xl border border-white/10 bg-neutral-800/50 backdrop-blur-sm text-center animate-fade-in"
                            style={{ opacity: 0, animationDelay: "450ms" }}
                        >
                            <h2 className="text-white text-display-xs md:text-display-sm font-bold mb-4">
                                {t("interestedInService")}
                            </h2>
                            <p className="text-neutral-400 text-body-lg mb-8 max-w-2xl mx-auto">
                                {t("contactUsDescription")}
                            </p>
                            <Link href="/contact">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    rightIcon={
                                        <ChevronRight className="w-5 h-5" />
                                    }
                                >
                                    {t("getStarted")}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer locale={locale} />
        </div>
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
