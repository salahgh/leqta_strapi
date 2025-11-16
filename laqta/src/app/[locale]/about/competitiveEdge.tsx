// Competitive Edge Component
import { Clock, Edit, Eye, RefreshCw } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/Badge";
import { getTranslations } from "next-intl/server";

export const CompetitiveEdge = async () => {
    const t = await getTranslations('competitiveEdge');
    
    const advantages = [
        {
            icon: <Edit className="w-6 h-6" />,
            title: t('advantages.creativity'),
        },
        {
            icon: <RefreshCw className="w-6 h-6" />,
            title: t('advantages.resilience'),
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: t('advantages.attention'),
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: t('advantages.commitment'),
        },
    ];

    return (
        <section
            className="bg-gradient-to-br from-gray-800/30 to-blue-900/30 backdrop-blur-md rounded-3xl border border-gray-700/30 p-6 md:p-10 lg:p-12
            shadow-2xl hover:border-gray-600/40 transition-all duration-500"
        >
            <div className="text-center space-y-4 md:space-y-6 py-6 md:py-8 flex flex-col items-center animate-fade-in" style={{ opacity: 0 }}>
                <div className="animate-slide-down" style={{ opacity: 0 }}>
                    <Badge>{t('badge')}</Badge>
                </div>

                <h2 className="text-white max-w-2xl leading-tight animate-slide-up" style={{ animationDelay: "150ms", opacity: 0 }}>
                    {t('title')}
                </h2>
                <p className="text-responsive-lg text-gray-300 max-w-2xl leading-relaxed animate-fade-in" style={{ animationDelay: "300ms", opacity: 0 }}>
                    {t('description')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
                {advantages.map((advantage, index) => (
                    <div
                        key={index}
                        className="group bg-gradient-to-br from-blue-900/40 to-purple-900/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-blue-400/20 flex items-center
                        hover:from-blue-800/50 hover:to-purple-800/40 hover:border-blue-400/40 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20
                        transition-all duration-500 cursor-default animate-fade-in"
                        style={{ animationDelay: `${450 + index * 150}ms`, opacity: 0 }}
                    >
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mr-4 md:mr-6 text-blue-400
                        group-hover:from-blue-500/40 group-hover:to-purple-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                            {advantage.icon}
                        </div>
                        <h3 className="text-white font-semibold text-lg md:text-xl group-hover:translate-x-2 transition-transform duration-500">
                            {advantage.title}
                        </h3>
                    </div>
                ))}
            </div>
        </section>
    );
};
