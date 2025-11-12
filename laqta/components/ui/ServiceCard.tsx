// Service Card Component - Updated to support featured_image background with gradient overlay
import { ChartColumnBig } from "lucide-react";
import { Link } from "@/src/i18n/navigation";

export const ServiceCard = (props) => {
    const {
        title,
        description,
        tags = ["Strategy", "Publishing", "Production", "Reporting"],
        gradientFrom = null,
        gradientTo = null,
        iconBg = "rgba(255,255,255,0.2)",
        className = "",
        icon = <ChartColumnBig />,
        featured_image = null, // New prop for featured image
        slug = null, // New prop for linking to detail page
    } = props;

    // Determine background style - always include image if available
    const getBackgroundStyle = () => {
        if (featured_image?.url) {
            return {
                backgroundImage: `url(${featured_image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            };
        }
        return {
            background: `linear-gradient(0deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        };
    };

    // Generate gradient overlay style - transparent black at bottom, gradientTo at top
    const getGradientOverlay = () => {
        if (featured_image?.url && gradientTo) {
            return {
                background: `linear-gradient(0deg, rgba(0,0,0,1) 0%, ${gradientTo} 100%)`,
                opacity: 0.8, // Adjust opacity to blend with image
            };
        }
        return {};
    };

    const cardContent = (
        <div
            className={`group relative text-gray-600 rounded-xl p-2 h-full overflow-hidden
            hover:scale-[1.03] hover:shadow-2xl hover:shadow-purple-500/20
            transition-all duration-500 ease-out cursor-pointer ${className}`}
            style={{
                backgroundColor: "#605e68",
            }}
        >
            <div
                className={"relative rounded-xl h-full w-full p-6 overflow-hidden"}
                style={getBackgroundStyle()}
            >
                {/* Gradient overlay - applied on top of image when both are present */}
                {featured_image?.url && gradientTo && (
                    <div
                        className="absolute inset-0 rounded-xl transition-opacity duration-500 group-hover:opacity-90"
                        style={getGradientOverlay()}
                    ></div>
                )}

                {/* Dark overlay for better text readability */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${featured_image?.url ? 'bg-black bg-opacity-30 group-hover:bg-opacity-40' : 'bg-black bg-opacity-20 group-hover:bg-opacity-30'}`}></div>

                {/* Animated glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                    {/* Icon in top right with enhanced styling */}
                    <div className="flex justify-end mb-6">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg"
                            style={{ background: iconBg }}
                        >
                            {icon}
                        </div>
                    </div>

                    {/* Title with enhanced animation */}
                    <h3 className="text-white text-body-xl font-bold mb-4 leading-tight transform transition-all duration-300 group-hover:translate-x-1">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-white text-responsive-md opacity-95 mb-8 leading-relaxed flex-grow transition-opacity duration-300 group-hover:opacity-100">
                        {description}
                    </p>

                    {/* Tags with enhanced hover effect */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-white bg-opacity-20 text-white text-body-sm rounded-full backdrop-blur-sm
                                transition-all duration-300 hover:bg-opacity-30 hover:scale-105 cursor-default"
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
