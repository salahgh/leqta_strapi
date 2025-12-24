// Hero Section Component
import { ArrowRight, Rocket } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import Image from "next/image";

export const HeroSection = async () => {
    const t = await getTranslations("aboutHero");

    return (
        <section className="flex lg:flex-row flex-col items-center section-px py-8 sm:py-12 md:py-16 lg:py-20 gap-6 sm:gap-8 md:gap-12 lg:gap-16 max-w-7xl mx-auto">
            <div className="flex-1 space-y-2 md:space-y-4 lg:space-y-4 ">
                <div className="animate-slide-down" style={{ opacity: 0 }}>
                    <Badge size="md" variant="accent">
                        {t("badge")}
                    </Badge>
                </div>

                <h2
                    className="text-gray-200 space-x-3 leading-tight py-2 animate-slide-up"
                    style={{ opacity: 0 }}
                >
                    {t("title")
                        .split(" ")
                        .map((word, index) => (
                            <span
                                key={index}
                                style={{
                                    fontWeight:
                                        word?.toString().trim() === "LEQTA"
                                            ? "700"
                                            : "",
                                    animationDelay: `${index * 100}ms`,
                                    opacity: 0,
                                }}
                                className={
                                    word === "LEQTA"
                                        ? "bg-gradient-to-b from-[#1370AD] to-[#ABDEFF] bg-clip-text text-transparent inline-block animate-fade-in drop-shadow-lg"
                                        : "inline-block animate-fade-in"
                                }
                            >
                                {word}{" "}
                            </span>
                        ))}
                </h2>

                <p
                    className="leading-relaxed text-secondary-gray text-responsive-lg max-w-xl animate-fade-in"
                    style={{ animationDelay: "300ms", opacity: 0 }}
                >
                    {t("description")}
                </p>

                <div
                    className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 animate-fade-in"
                    style={{ animationDelay: "500ms", opacity: 0 }}
                >
                    <Link href="/contact" className="w-full sm:w-auto">
                        <Button
                            variant={"primary"}
                            rightIcon={<Rocket />}
                            leftIcon={undefined}
                            size={"lg"}
                        >
                            {t("getStarted")}
                        </Button>
                    </Link>
                    <Link href="/contact" className="w-full sm:w-auto">
                        <Button
                            variant={"secondary"}
                            leftIcon={undefined}
                            size={"lg"}
                        >
                            {t("contactUs")}
                        </Button>
                    </Link>
                </div>
            </div>
            <div
                className="flex-1 w-full lg:w-auto animate-fade-in relative hover:scale-[1.02] transition-transform duration-500 "
                style={{ animationDelay: "700ms", opacity: 0 }}
            >
                <Image
                    src="/images/hero_section_2.png"
                    alt="About Laqta Hero"
                    width={900}
                    height={700}
                    className="rounded-2xl shadow-2xl"
                    priority
                />
            </div>
        </section>
    );
};
