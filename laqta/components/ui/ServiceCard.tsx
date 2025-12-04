/**
 * ServiceCard Component - Design System
 * Uses design tokens from globals.css and tailwind.config.js
 * Uses variant classes for dynamic gradients instead of inline styles
 */
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
    className?: string;
    icon?: React.ReactNode;
    featured_image?: { url: string } | null;
    slug?: string | null;
}

// Map gradient variants to CSS classes and glow colors
const gradientConfig: Record<GradientVariant, { class: string; glowColor: string }> = {
    aqua: { class: "gradient-service-aqua", glowColor: "rgba(148, 215, 224, 0.5)" },
    yellow: { class: "gradient-service-yellow", glowColor: "rgba(239, 210, 126, 0.5)" },
    pink: { class: "gradient-service-pink", glowColor: "rgba(228, 56, 213, 0.5)" },
    blue: { class: "gradient-service-blue", glowColor: "rgba(19, 112, 173, 0.5)" },
    default: { class: "gradient-service-blue", glowColor: "rgba(19, 112, 173, 0.5)" },
};

export const ServiceCard = ({
    title,
    description,
    tags = ["Strategy", "Publishing", "Production", "Reporting"],
    gradientVariant = "default",
    className = "",
    icon = <ChartColumnBig className="text-white" />,
    featured_image = null,
    slug = null,
}: ServiceCardProps) => {
    const { class: gradientClass, glowColor } = gradientConfig[gradientVariant];

    const cardContent = (
        <div
            className={cn(
                "group relative text-neutral-500 rounded-xl p-1 h-full min-h-card overflow-hidden",
                "bg-neutral-800 border border-white/10",
                "hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20",
                "transition-all duration-500 ease-out cursor-pointer",
                className
            )}
        >
            <div
                className={cn(
                    "relative rounded-lg h-full w-full overflow-hidden flex flex-col",
                    !featured_image?.url && gradientClass
                )}
                style={featured_image?.url ? {
                    backgroundImage: `url(${featured_image.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                } : undefined}
            >
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-service-overlay" />

                {/* Icon at top right with glow effect */}
                <div className="relative z-10 flex justify-end p-3 sm:p-4">
                    <div
                        className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center",
                            "bg-white/20 backdrop-blur-sm",
                            "transform transition-all duration-500 group-hover:scale-110"
                        )}
                        style={{ boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}` }}
                    >
                        {icon}
                    </div>
                </div>

                {/* Spacer to push content to bottom */}
                <div className="flex-grow" />

                {/* Content at bottom */}
                <div className="relative z-10 card-p-md pt-8">
                    {/* Title */}
                    <h3 className="text-white text-body-lg sm:text-body-xl font-bold mb-2 sm:mb-3 leading-tight transform transition-all duration-300 group-hover:translate-x-1">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-neutral-300 text-body-sm sm:text-body-md opacity-90 mb-4 sm:mb-6 leading-relaxed line-clamp-3">
                        {description}
                    </p>

                    {/* Tags using badge pattern */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {tags?.map((tag, index) => (
                            <span
                                key={index}
                                className={cn(
                                    "badge-base badge-xs sm:badge-sm",
                                    "bg-white/10 text-neutral-300 border border-white/10 backdrop-blur-sm",
                                    "transition-all duration-300 hover:bg-white/20 hover:scale-105 cursor-default"
                                )}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
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
