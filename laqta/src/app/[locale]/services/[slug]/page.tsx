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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";

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

// Helper function to detect video type and extract embed info
const getVideoEmbedInfo = (url: string): { type: 'youtube' | 'vimeo' | 'unknown'; embedUrl: string | null } => {
    // YouTube patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
        return {
            type: 'youtube',
            embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0`
        };
    }

    // Vimeo patterns
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
        return {
            type: 'vimeo',
            embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
        };
    }

    return { type: 'unknown', embedUrl: null };
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

    // Get video URL (uploaded video)
    const serviceVideoUrl = service.service_video?.url
        ? utils.getFileUrl(service.service_video.url)
        : null;

    // Get external video embed info (YouTube/Vimeo)
    const externalVideoInfo = service.video_url
        ? getVideoEmbedInfo(service.video_url)
        : null;

    // Determine which video to show (prefer uploaded, fallback to external)
    const hasVideo = serviceVideoUrl || (externalVideoInfo?.embedUrl);

    // Gradient colors for icon
    const gradientFrom = service.gradientFrom || "#7F56D9";
    const gradientTo = service.gradientTo || "#5B21B6";
    const glowColor = `${gradientFrom}80`;

    return (
        <div className="min-h-screen bg-primary relative">
            {/* Background SVG Layers */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Union SVG - Full width at top */}
                <img
                    src="/images/union.svg"
                    alt=""
                    className="w-full"
                    aria-hidden="true"
                />

                {/* Vector Courbe - Centered */}
                <div className="absolute w-[80%] lg:w-1/2 top-0 left-1/2 -translate-x-1/2 opacity-70">
                    <img
                        src="/images/vector_courbe.svg"
                        alt=""
                        className="w-full"
                        aria-hidden="true"
                    />
                </div>

                {/* Vector9 - Left side decoration */}
                <div
                    className="absolute left-0 opacity-80"
                    style={{ marginTop: 700 }}
                >
                    <img
                        src="/images/vector9.svg"
                        alt=""
                        aria-hidden="true"
                    />
                </div>
            </div>

            <Navigation />

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="section-px pt-16 pb-12">
                    <div className="max-w-container mx-auto">
                        {/* Back Button */}
                        <Link
                            href="/services"
                            className="inline-flex items-center text-neutral-300 hover:text-white transition-colors mb-8 group animate-fade-in"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
                            <span className="text-body-md">
                                {t("backToServices")}
                            </span>
                        </Link>

                        {/* Service Icon with Glow */}
                        <div
                            className="flex mb-6 animate-slide-down"
                            style={{ opacity: 0 }}
                        >
                            <div
                                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center overflow-hidden bg-white/20 backdrop-blur-sm"
                                style={{
                                    boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor}`,
                                    background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
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
                            className="text-white text-display-md md:text-display-lg lg:text-display-xl font-bold mb-6 animate-slide-up"
                            style={{ opacity: 0, animationDelay: "150ms" }}
                        >
                            {service.title}
                        </h1>

                        {/* Description */}
                        <p
                            className="text-neutral-300 text-body-lg md:text-body-xl leading-relaxed max-w-3xl mb-8 animate-fade-in"
                            style={{ opacity: 0, animationDelay: "300ms" }}
                        >
                            {service.description}
                        </p>

                        {/* Tags */}
                        {service.tags && service.tags.length > 0 && (
                            <div
                                className="flex flex-wrap gap-2 animate-fade-in"
                                style={{ opacity: 0, animationDelay: "350ms" }}
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
                    </div>
                </section>

                {/* Featured Image */}
                {featuredImageUrl && (
                    <div
                        className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden rounded-t-[50px] animate-fade-in"
                        style={{ opacity: 0, animationDelay: "400ms" }}
                    >
                        <Image
                            src={featuredImageUrl}
                            alt={service.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Gradient overlay at bottom for smooth transition */}
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
                    </div>
                )}

                {/* White Content Section */}
                {(service.content || hasVideo) && (
                    <section className="section-px section-py-md bg-white">
                        <div className="max-w-container mx-auto">
                            {/* Video Section */}
                            {hasVideo && (
                                <div
                                    className="rounded-2xl overflow-hidden mb-12 shadow-lg animate-fade-in"
                                    style={{ opacity: 0, animationDelay: "450ms" }}
                                >
                                    {/* Uploaded Video (Priority) */}
                                    {serviceVideoUrl ? (
                                        <video
                                            className="w-full aspect-video"
                                            controls
                                            poster={featuredImageUrl || undefined}
                                            preload="metadata"
                                        >
                                            <source
                                                src={serviceVideoUrl}
                                                type={service.service_video?.mime || "video/mp4"}
                                            />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : externalVideoInfo?.embedUrl ? (
                                        /* External Video Embed (YouTube/Vimeo) */
                                        <iframe
                                            className="w-full aspect-video"
                                            src={externalVideoInfo.embedUrl}
                                            title={`${service.title} video`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    ) : null}
                                </div>
                            )}

                            {/* Rich Text Content */}
                            {service.content && (
                                <div
                                    className="bg-white rounded-3xl shadow-xl card-p-md animate-fade-in"
                                    style={{ opacity: 0, animationDelay: "500ms" }}
                                >
                                    <div className="blog-content prose prose-lg max-w-none prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-strong:text-neutral-900 prose-ul:text-neutral-700 prose-ol:text-neutral-700 prose-li:marker:text-primary prose-a:text-primary hover:prose-a:text-primary-dark prose-blockquote:border-primary prose-blockquote:text-neutral-600">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {service.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="bg-primary section-px section-py-lg relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-30">
                            <img
                                src="/images/vector9.svg"
                                alt=""
                                className="transform rotate-180"
                                aria-hidden="true"
                            />
                        </div>
                    </div>

                    <div
                        className="max-w-container mx-auto text-center relative z-10 animate-fade-in"
                        style={{ opacity: 0, animationDelay: "550ms" }}
                    >
                        <h2 className="text-white text-display-xs md:text-display-sm font-bold mb-4">
                            {t("interestedInService")}
                        </h2>
                        <p className="text-neutral-300 text-body-lg mb-8 max-w-2xl mx-auto">
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
