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
}) => {
    const t = useTranslations('about');
    
    return (
        <div className={`relative overflow-hidden ${className} rounded-3xl`}>
            {/* Linear Gradient Background */}
            <div className="absolute inset-0 z-0 blue_gradient" />

            {/* LAQTA Logo SVG in the middle */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
                <img
                    src="/images/laqta_logo_courbe.svg"
                    alt="LAQTA Logo Curve"
                    className="w-full h-full object-contain opacity-20"
                />
            </div>

            {/* Content Layer */}
            <div className="relative z-20 bg-transparent rounded-2xl md:rounded-3xl shadow-2xl pt-8 md:p-12 md:flex p-4 md:gap-8">
                {/* Content Section */}
                <div className="space-y-6 flex-1">
                    {/* Badge */}
                    <div className="items-center justify-center">
                        <Badge>{t('badge')}</Badge>
                    </div>
                    <h2 className="text-black text-display-md md:text-display-lg xl:text-display-xl leading-tight">
                        {t('title').split(" ").map((word, index) => (
                            <span
                                key={index}
                                style={{
                                    fontWeight:
                                        word === "LEQTA" ? "700" : "500",
                                }}
                                className={
                                    word === "LEQTA"
                                        ? "bg-gradient-to-b from-[#1370AD] to-[#ABDEFF] bg-clip-text text-transparent"
                                        : ""
                                }
                            >
                                {word}{" "}
                            </span>
                        ))}
                    </h2>
                    {/* Description */}
                    <p className="text-secondary-gray leading-relaxed text-responsive-lg">
                        {t('description')}
                    </p>
                    {/*Buttons*/}
                    <div className="flex gap-4" style={{ height: 61 }}>
                        <div className={"h-12 md:h-16"}>
                            <Link href="/contact">
                                <Button
                                    variant="primary"
                                    className=""
                                    rightIcon={<Rocket className="w-4 h-4 ml-2" />}
                                    leftIcon={null}
                                >
                                    {t('getStarted')}
                                </Button>
                            </Link>
                        </div>
                        <div className={"h-12 md:h-16"}>
                            <Link href="/about">
                                <Button
                                    variant="secondary"
                                    className="text-blue-300"
                                    leftIcon={null}
                                    rightIcon={null}
                                >
                                    {t('learnMore')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Illustration Section */}
                <div className="flex justify-center items-center md:max-w-80 lg:max-w-xl">
                    {illustration || (
                        // Fallback illustration if none provided
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 aspect-square flex items-center justify-center">
                            <div className="text-6xl text-blue-500">🎬</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutSection;
