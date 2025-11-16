import React from "react";
import { Badge } from "@/components/ui/Badge";
import { useTranslations } from "next-intl";

export const YourPerfectPartner = () => {
    const t = useTranslations('perfectPartner');
    
    return (
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden md:px-24 md:min-h-[550px] lg:min-h-[700px] xl:min-h-[1200px]">
            <div className="absolute inset-0 z-0 invisible md:visible md:h-[550px] lg:h-[650px] xl:h-[1200px]" style={{
                backgroundImage: "url('/images/steps.svg')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center top",
                backgroundSize: "cover",
                opacity: 1,
            }}
            />
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
                <div className="md:mb-8 animate-slide-down" style={{ opacity: 0 }}>
                    <Badge variant="default">{t('badge')}</Badge>
                </div>

                <h1 className="font-medium text-white leading-tight md:max-w-[700px] mt-8 animate-slide-up" style={{ opacity: 0, animationDelay: "150ms" }}>
                    {t('title')}
                </h1>

                <p className="font text-secondary-gray text-responsive-lg mt-4 animate-fade-in" style={{ opacity: 0, animationDelay: "300ms" }}>
                    {t('description')}
                </p>
            </div>
            <div className="flex w-full justify-center md:hidden animate-fade-in" style={{ opacity: 0, animationDelay: "450ms" }}>
                <img
                    src="/images/steps_vertical.svg"
                    alt="Logo"
                    className={""}
                />
            </div>
        </div>
    );
};

export default YourPerfectPartner;
