// Hero Section Component
import { ArrowRight, Rocket } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import Image from "next/image";

export const HeroSection = async () => {
    const t = await getTranslations('aboutHero');

    return (
        <section className="flex lg:flex-row flex-col items-center px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20 gap-8 md:gap-12 lg:gap-16 max-w-7xl mx-auto">
            <div className="flex-1 space-y-4 md:space-y-6 lg:space-y-8">
                <div className="animate-slide-down" style={{ opacity: 0 }}>
                    <Badge>{t('badge')}</Badge>
                </div>

                <h2 className="text-gray-200 leading-tight py-2 animate-slide-up" style={{ opacity: 0 }}>
                    {t('title').split(" ").map((word, index) => (
                        <span
                            key={index}
                            style={{
                                fontWeight: word === "LEQTA" ? "700" : "500",
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

                <p className="leading-relaxed text-gray-300 text-responsive-lg max-w-xl animate-fade-in" style={{ animationDelay: "300ms", opacity: 0 }}>
                    {t('description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 animate-fade-in" style={{ animationDelay: "500ms", opacity: 0 }}>
                    <Link href="/contact" className="w-full sm:w-auto">
                        <Button
                            variant={"primary"}
                            rightIcon={<Rocket />}
                            leftIcon={undefined}
                        >
                            {t('getStarted')}
                        </Button>
                    </Link>
                    <Link href="/contact" className="w-full sm:w-auto">
                        <Button
                            variant={"secondary"}
                            rightIcon={<ArrowRight />}
                            leftIcon={undefined}
                        >
                            {t('contactUs')}
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex-1 w-full lg:w-auto animate-fade-in" style={{ animationDelay: "700ms", opacity: 0 }}>
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                    <div className="relative hover:scale-[1.02] transition-transform duration-500">
                        <Image
                            src="/images/hero_section_2.png"
                            alt="About Laqta Hero"
                            width={800}
                            height={600}
                            className="w-full h-auto rounded-2xl shadow-2xl"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
