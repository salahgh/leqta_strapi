// Service Card Component - Updated design with icon glow, bottom text, and gradient overlay
import { ChartColumnBig } from "lucide-react";
import { Link } from "@/src/i18n/navigation";

export const ServiceCard = (props) => {
    const {
        title,
        description,
        tags = ["Strategy", "Publishing", "Production", "Reporting"],
        gradientFrom = "#000000",
        gradientTo = "#1a1a2e",
        iconBg = "rgba(255,255,255,0.2)",
        className = "",
        icon = <ChartColumnBig />,
        featured_image = null,
        slug = null,
    } = props;

    // Background style - gradient from service color to black
    const getBackgroundStyle = () => {
        if (featured_image?.url) {
            return {
                backgroundImage: `url(${featured_image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            };
        }
        // Gradient from gradientTo (top) to black (bottom)
        return {
            background: `linear-gradient(180deg, ${gradientTo} 0%, #000000 100%)`,
        };
    };

    const cardContent = (
        <div
            className={`group relative text-gray-600 rounded-xl p-1 h-full min-h-[400px] overflow-hidden
            hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20
            transition-all duration-500 ease-out cursor-pointer ${className}`}
            style={{
                backgroundColor: "#2a2a3a",
                border: "1px solid rgba(255,255,255,0.1)",
            }}
        >
            <div
                className={"relative rounded-lg h-full w-full overflow-hidden flex flex-col"}
                style={getBackgroundStyle()}
            >
                {/* Gradient overlay from black (bottom) to transparent (top) for text readability */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, transparent 100%)`,
                    }}
                />

                {/* Icon at top right with glow effect */}
                <div className="relative z-10 flex justify-end p-4">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110"
                        style={{
                            background: iconBg,
                            boxShadow: `0 0 20px ${gradientTo}80, 0 0 40px ${gradientTo}40, 0 0 60px ${gradientTo}20`,
                        }}
                    >
                        {icon}
                    </div>
                </div>

                {/* Spacer to push content to bottom */}
                <div className="flex-grow" />

                {/* Content at bottom with gradient background */}
                <div className="relative z-10 p-6 pt-8">
                    {/* Title */}
                    <h3 className="text-white text-body-xl font-bold mb-3 leading-tight transform transition-all duration-300 group-hover:translate-x-1">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-300 text-responsive-md opacity-90 mb-6 leading-relaxed line-clamp-3">
                        {description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-white bg-opacity-10 text-gray-300 text-body-sm rounded-full backdrop-blur-sm
                                border border-white/10 transition-all duration-300 hover:bg-opacity-20 hover:scale-105 cursor-default"
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
