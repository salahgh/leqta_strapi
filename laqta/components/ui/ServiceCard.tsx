/**
 * ServiceCard Component - Design System
 * Uses design tokens from globals.css and tailwind.config.js
 * Uses variant classes for dynamic gradients instead of inline styles
 */
"use client";

import { ChartColumnBig } from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { cn } from "@/lib/utils";

// Gradient variant type for predefined service gradients
type GradientVariant = "aqua" | "yellow" | "pink" | "blue" | "default";

interface ServiceCardProps {
    title: string;
    description: string;
    tags?: string[];
    gradientVariant?: GradientVariant;
    gradientFrom?: string | null;
    gradientTo?: string | null;
    className?: string;
    icon?: React.ReactNode;
    icon_image?: { url: string; alternativeText?: string } | null;
    featured_image?: { url: string } | null;
    slug?: string | null;
}

// Map gradient variants to CSS classes and glow colors
const gradientConfig: Record<
    GradientVariant,
    { class: string; glowColor: string }
> = {
    aqua: {
        class: "gradient-service-aqua",
        glowColor: "rgba(148, 215, 224, 0.5)",
    },
    yellow: {
        class: "gradient-service-yellow",
        glowColor: "rgba(239, 210, 126, 0.5)",
    },
    pink: {
        class: "gradient-service-pink",
        glowColor: "rgba(228, 56, 213, 0.5)",
    },
    blue: {
        class: "gradient-service-blue",
        glowColor: "rgba(19, 112, 173, 0.5)",
    },
    default: {
        class: "gradient-service-blue",
        glowColor: "rgba(19, 112, 173, 0.5)",
    },
};

// Marquee component for scrolling tags
const TagsMarquee = ({ tags }: { tags: string[] }) => {
    // Duplicate tags for seamless loop
    const duplicatedTags = [...tags, ...tags];

    return (
        <div className="relative overflow-hidden w-full">
            <div
                className="flex animate-marquee"
                style={{ width: "max-content" }}
            >
                {duplicatedTags.map((tag, index) => (
                    <span
                        key={index}
                        className={cn(
                            "badge-base badge-xs sm:badge-sm",
                            "bg-white/10 text-neutral-300 border border-white/10 backdrop-blur-sm",
                            "flex-shrink-0 whitespace-nowrap mr-2",
                        )}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

export const ServiceCard = ({
    title,
    description,
    tags = [],
    gradientVariant = "default",
    gradientFrom = null,
    gradientTo = null,
    className = "",
    icon = <ChartColumnBig className="text-white w-6 h-6" />,
    icon_image = null,
    featured_image = null,
    slug = null,
}: ServiceCardProps) => {
    const { class: gradientClass, glowColor: defaultGlowColor } =
        gradientConfig[gradientVariant];

    // Use custom gradient colors if provided, otherwise use variant
    const hasCustomGradient = gradientFrom && gradientTo;
    const glowColor = hasCustomGradient
        ? `${gradientFrom}80`
        : defaultGlowColor;

    const cardContent = (
        <div
            className={cn(
                "group relative text-neutral-500 rounded-xl p-1 h-full min-h-card overflow-hidden",
                "bg-neutral-800 border border-white/10",
                "hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20",
                "transition-all duration-500 ease-out cursor-pointer",
                className,
            )}
        >
            <div className="relative rounded-lg h-full w-full overflow-hidden flex flex-col">
                {/* Laqta circle logo background */}
                <div
                    className="absolute inset-0 z-[1] flex items-center justify-center opacity-20"
                >
                    <img
                        src="/images/laqta_logo_courbe.svg"
                        alt=""
                        className="w-3/4 h-3/4 object-contain"
                        aria-hidden="true"
                    />
                </div>

                {/* Featured image as base layer */}
                {featured_image?.url && (
                    <div
                        className="absolute inset-0 z-[3] p-8 m-6"
                        style={{
                            backgroundImage: `url(${featured_image.url})`,
                            backgroundSize: "contain",
                            backgroundPosition: "center bottom",
                            backgroundRepeat: "no-repeat",
                        }}
                    />
                )}

                {/* Gradient overlay on top of image */}
                <div
                    className={cn(
                        "absolute inset-0 z-[2] opacity-60",
                        !hasCustomGradient && gradientClass,
                    )}
                    style={
                        hasCustomGradient
                            ? {
                                  background: `linear-gradient(0deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
                              }
                            : undefined
                    }
                />

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-service-overlay z-[5]" />

                {/* Icon at top right with glow effect */}
                <div className="relative z-10 flex justify-end p-3 sm:p-4">
                    <div
                        className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center overflow-hidden",
                            "bg-white/20 backdrop-blur-sm",
                            "transform transition-all duration-500 group-hover:scale-110",
                        )}
                        style={{
                            boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`,
                        }}
                    >
                        {icon_image?.url ? (
                            <img
                                src={icon_image.url}
                                alt={icon_image.alternativeText || title}
                                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                            />
                        ) : (
                            icon
                        )}
                    </div>
                </div>

                {/* Spacer to push content to bottom */}
                <div className="flex-grow" />

                {/* Content at bottom */}
                <div className="relative z-10 pt-8">
                    {/* Title & Description with padding */}
                    <div className="card-p-md pb-0">
                        <h3 className="text-white text-body-lg sm:text-body-xl font-bold mb-2 sm:mb-3 leading-tight transform transition-all duration-300 group-hover:translate-x-1">
                            {title}
                        </h3>
                        <p className="text-neutral-300 text-body-sm sm:text-body-md opacity-90 mb-4 leading-relaxed line-clamp-3">
                            {description}
                        </p>
                    </div>

                    {/* Tags with marquee effect - full width, no padding */}
                    {tags && tags.length > 0 && (
                        <div className="pb-4">
                            <TagsMarquee tags={tags} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Wrap in Link if slug is provided
    if (slug) {
        return (
            <Link href={`/services/${slug}`} className="block h-full">
                {cardContent}
            </Link>
        );
    }

    return cardContent;
};
