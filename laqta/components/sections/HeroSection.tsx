import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Rocket } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Navigation } from "@/components/layout/Navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import React from "react";

const ArrowIcon: React.FC = () => (
    <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
    </svg>
);

export const HeroSection: React.FC = () => {
    const t = useTranslations("hero");

    return (
        <div className="relative bg-primary flex flex-col items-center justify-center w-full text-center p-4 sm:p-12 md:pb-24 lg:pb-36 overflow-hidden">
            <div
                className="absolute inset-0 z-20"
                style={{
                    background:
                        "linear-gradient(to bottom, #FFFFFF00, #000000)",
                }}
            />
            {/* Vector Courbe SVG Layer */}
            <div className="absolute z-30 w-[80%] lg:w-1/2">
                <img
                    src="/images/vector_courbe.svg"
                    alt="Vector Curve Background"
                    className="h-full aspect-square object-cover"
                />
            </div>
            {/* Union SVG Layer */}
            <div className="absolute z-10 w-full" style={{ top: 0, left: 0 }}>
                <img
                    src="/images/union.svg"
                    alt="Union Background"
                    className="object-fill bg"
                />
            </div>
            {/* Content Layer */}
            <div className="relative z-40 w-full">
                <Navigation />
                <div className={"pt-4 flex justify-center"}>
                    <Logo className={"md:hidden"} />
                </div>
                <img
                    src="/images/wherecreativitymeetsstrategy.svg"
                    alt={t("title")}
                    className={"w-full pt-2 px-2 lg:px-44"}
                />
                <p
                    className="text-responsive-lg font-medium text-secondary-gray padding-responsive-lg
                text-justify
                 sm:text-center md:px-12 md:text-justify lg:text-center xl:px-40"
                >
                    {t("description")}
                </p>
                <div className={"h-8 md:h-[56px]"}></div>
                <div className="flex w-full flex-col items-center justify-center gap-4 md:w-auto md:flex-row">
                    <div className={"h-12 w-full md:h-16 md:w-auto"}>
                        <Link href="/services">
                            <Button
                                leftIcon={null}
                                rightIcon={<Rocket className="ml-2 h-10 w-4" />}
                            >
                                {t("getStarted")}
                            </Button>
                        </Link>
                    </div>
                    <div className={"h-12 w-full md:h-16 md:w-auto"}>
                        <Link href="/contact">
                            <Button variant="secondary" leftIcon={null} rightIcon={null}>{t("contactUs")}</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
