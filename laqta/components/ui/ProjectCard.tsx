import React from "react";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/src/i18n/navigation";

interface ProjectCardProps {
    imagePosition?: "left" | "right";
    title: string;
    category: string;
    description: string;
    metrics?: string;
    ctaText?: string;
    imageUrl?: string;
    imageAlt?: string;
    className?: string;
    slug?: string; // New prop for linking to detail page
}

export const ProjectCard: React.FC<ProjectCardProps> = (props) => {
    const {
        imagePosition = "left",
        title,
        category,
        description,
        metrics,
        ctaText = "Learn more",
        imageUrl = "/images/workImage.jpg",
        imageAlt = "Project image",
        className = "",
        slug,
    } = props;

    const isLeftImage = imagePosition === "left";

    const cardContent = (
        <div
            className={`bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${slug ? 'cursor-pointer' : ''} ${className}`}
        >
            <div
                className={`flex gap-3 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 ${
                    isLeftImage ? "lg:flex-row" : "lg:flex-row-reverse"
                } flex-col lg:items-center`}
            >
                {/* Project Image - Updated to be square and 30% width */}
                <div className="flex w-full lg:w-[30%] justify-center items-center flex-shrink-0">
                    <img
                        src={imageUrl}
                        alt={imageAlt}
                        className="w-full max-w-sm lg:max-w-none rounded-lg sm:rounded-xl object-cover aspect-square"
                    />
                </div>

                {/* Project Content - Updated to take remaining 70% width */}
                <div className="flex-1 lg:w-[70%] space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                    <Badge variant="compact" className="">
                        {category}
                    </Badge>

                    <h1 className="font-semibold text-body-lg md:text-display-md text-gray-900 leading-tight">
                        {title}
                    </h1>

                    <p
                        className="text-responsive-lg text-secondary-gray
                    leading-relaxed"
                    >
                        {description}
                    </p>

                    {metrics && (
                        <p
                            className="text-body-sm sm:text-body-md md:text-display-xs lg:text-display-sm
                        xl:text-display-md text-gray-600 font-medium"
                        >
                            {metrics}
                        </p>
                    )}

                    <div className="flex max-w-max pt-2 sm:pt-3 md:pt-4 h-14 md:h-20 self-start">
                        <Button
                            size="lg"
                            className=""
                            rightIcon={
                                <Rocket className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-2" />
                            }
                            leftIcon={null}
                        >
                            {ctaText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Wrap in Link if slug is provided
    if (slug) {
        return (
            <Link href={`/works/${slug}`} className="block h-full">
                {cardContent}
            </Link>
        );
    }

    return cardContent;
};
