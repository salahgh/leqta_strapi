/**
 * AboutSection Component - Design System
 * Uses design tokens for consistent styling
 * Mobile-first responsive design
 */

import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import "./styles.css";

// Main About Section Component

const AboutSection = ({
    illustration,
    className = "",
}: {
    illustration?: React.ReactNode;
    className?: string;
}) => {
    const t = useTranslations("about");

    return (
        <div
            className={`relative overflow-hidden ${className} rounded-2xl sm:rounded-3xl`}
        >
            {/* Linear Gradient Background */}

            <div
                className="absolute inset-0 z-0"
                style={{ backgroundColor: "rgba(249,213,213,0)" }}
            />

            <div className="absolute inset-0 z-1 flex items-center justify-center p-8">
                <img
                    src="/images/laqta_logo_courbe.svg"
                    alt="LAQTA Logo Curve"
                    className="w-full h-full object-contain opacity-60"
                />
            </div>

            <div className="absolute inset-0 z-5 blue_gradient" />

            {/* Content Layer */}
            <div className="relative z-20 bg-transparent rounded-2xl md:rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-6 md:gap-8 lg:gap-12 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
                {/* Content Section */}
                <div className="stack-gap-md flex-1 py-4 sm:py-6 md:py-8 lg:py-12 w-full text-center md:text-start">
                    {/* Badge */}
                    <div
                        className="flex items-center justify-center md:justify-start animate-slide-down"
                        style={{ opacity: 0 }}
                    >
                        <Badge variant="accent">{t("badge")}</Badge>
                    </div>
                    <h2
                        className="text-neutral-900 text-display-sm sm:text-display-md md:text-display-lg xl:text-display-xl leading-tight animate-slide-up"
                        style={{ opacity: 0, animationDelay: "150ms" }}
                    >
                        {t("title")
                            .split(" ")
                            .map((word, index) => {
                                console.log(word, index);
                                return (
                                    <span
                                        key={index}
                                        style={{
                                            fontWeight:
                                                word?.toString().trim() ===
                                                "LEQTA"
                                                    ? "700"
                                                    : "600",
                                        }}
                                        className={
                                            word?.toString().trim() === "LEQTA"
                                                ? "bg-gradient-to-b from-[#3a8bc0] to-blue-300 bg-clip-text text-transparent"
                                                : ""
                                        }
                                    >
                                        {word}{" "}
                                    </span>
                                );
                            })}
                    </h2>
                    {/* Description */}
                    <p
                        className="text-secondary-gray leading-relaxed text-body-sm sm:text-body-md lg:text-body-xl animate-fade-in md:pe-8 lg:pe-16 xl:pe-32"
                        style={{ opacity: 0, animationDelay: "300ms" }}
                    >
                        {t("description")}
                    </p>
                    {/* Buttons */}
                    <div
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in justify-center md:justify-start"
                        style={{ opacity: 0, animationDelay: "450ms" }}
                    >
                        <Link href="/contact" className="w-full sm:w-auto">
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                className="sm:w-40 md:w-44"
                                rightIcon={<Rocket className="w-4 h-4 ml-2" />}
                                leftIcon={null}
                            >
                                {t("getStarted")}
                            </Button>
                        </Link>
                        <Link href="/about" className="w-full sm:w-auto">
                            <Button
                                variant="secondary"
                                size="lg"
                                fullWidth
                                className="sm:w-40 md:w-44 text-black"
                                leftIcon={null}
                                rightIcon={null}
                            >
                                {t("learnMore")}
                            </Button>
                        </Link>
                    </div>
                </div>
                {/* Illustration Section */}
                <div
                    className="flex flex-1 justify-center items-center w-full md:max-w-80 lg:max-w-xl animate-fade-in mt-6 md:mt-0"
                    style={{ opacity: 0, animationDelay: "600ms" }}
                >
                    {illustration || (
                        // Fallback illustration if none provided
                        <div className="bg-gradient-to-br from-primary-light/20 to-primary-light/40 rounded-2xl p-6 sm:p-8 aspect-square flex items-center justify-center">
                            <div className="text-4xl sm:text-6xl text-primary-light">
                                🎬
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutSection;
