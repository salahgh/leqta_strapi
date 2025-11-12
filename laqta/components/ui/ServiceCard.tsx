// Service Card Component - Updated to support featured_image background with gradient overlay
import { ChartColumnBig } from "lucide-react";

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

    return (
        <div
            className={`relative text-gray-600 rounded-lg p-2 h-full overflow-hidden hover:scale-[1.02] 
            transition-all duration-300 ${className}`}
            style={{
                backgroundColor: "#605e68",
            }}
        >
            <div
                className={"relative rounded-lg h-full w-full p-6"}
                style={getBackgroundStyle()}
            >
                {/* Gradient overlay - applied on top of image when both are present */}
                {featured_image?.url && gradientTo && (
                    <div 
                        className="absolute inset-0 rounded-lg" 
                        style={getGradientOverlay()}
                    ></div>
                )}

                {/* Dark overlay for better text readability */}
                <div className={`absolute inset-0 ${featured_image?.url ? 'bg-black bg-opacity-30' : 'bg-black bg-opacity-20'}`}></div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                    {/* Icon in top right */}
                    <div className="flex justify-end mb-6">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: iconBg }}
                        >
                            {icon}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-white text-body-xl font-bold mb-4 leading-tight">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-white text-responsive-md opacity-95 mb-8 leading-relaxed flex-grow">
                        {description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-white bg-opacity-20 text-white text-body-sm rounded-full backdrop-blur-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
