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
            className="bg-gray-200 bg-gradient-to-br from-gray-100/10
        to-blue-100/10 backdrop-blur-sm rounded-3xl border border-gray-200/20 p-4 md:p-8"
        >
            <div className="text-center space-y-4 py-8 flex flex-col items-center md:text-center">
                <Badge>{t('badge')}</Badge>

                <div className={"w-full flex justify-center"}>
                    <h2 className="text-white w-1/2">{t('title')}</h2>
                </div>
                <p className="text-responsive-lg text-secondary-gray max-w-xl">
                    {t('description')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {advantages.map((advantage, index) => (
                    <div
                        key={index}
                        className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20 flex items-center"
                    >
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mr-4 text-blue-400">
                            {advantage.icon}
                        </div>
                        <h1 className="text-white font-semibold">
                            {advantage.title}
                        </h1>
                    </div>
                ))}
            </div>
        </section>
    );
};
