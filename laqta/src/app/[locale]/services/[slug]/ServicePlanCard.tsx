"use client";

import { Plan } from "@/lib/strapi";
import { Button } from "@/components/ui/Button";
import { Check, X, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

interface ServicePlanCardProps {
    plan: Plan;
    serviceName: string;
    serviceSlug: string;
}

export const ServicePlanCard = ({
    plan,
    serviceName,
    serviceSlug,
}: ServicePlanCardProps) => {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("services");
    const isFeatured = plan.featured;

    const handleSelectPlan = () => {
        const params = new URLSearchParams({
            service: serviceSlug,
            serviceName: serviceName,
            plan: plan.documentId || plan.id.toString(),
            planName: plan.title,
        });
        router.push(`/${locale}/contact?${params.toString()}`);
    };

    // Determine price display
    const getPriceDisplay = () => {
        if (plan.isCustomPricing && plan.customPricingText) {
            return plan.customPricingText;
        }
        if (plan.price) {
            return plan.price;
        }
        return t("contactForPricing");
    };

    return (
        <div
            className={`
                relative rounded-2xl md:rounded-3xl overflow-hidden h-full flex flex-col
                ${
                    isFeatured
                        ? "bg-gradient-to-b from-primary/60 to-pink-600/80 scale-[1.02] z-10"
                        : "bg-primary/80 border border-white/10"
                }
                backdrop-blur-sm shadow-2xl
                hover:shadow-3xl hover:border-white/20 transition-all duration-300
            `}
        >
            {/* Featured background decoration */}
            {isFeatured && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <img
                        src="/images/vector_courbe.svg"
                        alt=""
                        className="w-full h-full object-contain"
                        aria-hidden="true"
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(to bottom, rgba(88, 28, 135, 0.80) 0%, rgba(88, 28, 135, 0.7) 20%, transparent 50%)",
                        }}
                    />
                </div>
            )}

            {/* Featured highlight bar */}
            {isFeatured && (
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
            )}

            <div className="relative z-10 flex flex-col h-full p-5 md:p-6">
                {/* Header */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        {isFeatured && (
                            <Sparkles className="w-5 h-5 text-pink-400" />
                        )}
                        <h3 className="text-display-xs md:text-display-sm font-bold text-white">
                            {plan.title}
                        </h3>
                    </div>
                    {plan.description && (
                        <p className="text-body-sm md:text-body-md text-neutral-300 leading-relaxed">
                            {plan.description}
                        </p>
                    )}
                </div>

                {/* Price */}
                <div className="mb-6">
                    <span className="text-display-xs md:text-display-sm font-bold text-white">
                        {getPriceDisplay()}
                    </span>
                </div>

                {/* Sections with Points */}
                {plan.sections && plan.sections.length > 0 && (
                    <div className="space-y-4 mb-6">
                        {plan.sections.map((section) => (
                            <div key={section.id}>
                                <h4 className="text-body-md font-semibold text-white mb-3">
                                    {section.title}
                                </h4>
                                {section.points && section.points.length > 0 && (
                                    <ul className="space-y-2">
                                        {section.points.map((point) => (
                                            <li
                                                key={point.id}
                                                className="flex items-start gap-3"
                                            >
                                                <div
                                                    className={`
                                                        flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5
                                                        ${
                                                            point.included
                                                                ? isFeatured
                                                                    ? "bg-pink-500/20"
                                                                    : "bg-accent-blue/20"
                                                                : "bg-neutral-500/20"
                                                        }
                                                    `}
                                                >
                                                    {point.included ? (
                                                        <Check
                                                            className={`w-3 h-3 ${
                                                                isFeatured
                                                                    ? "text-pink-400"
                                                                    : "text-accent-blue"
                                                            }`}
                                                        />
                                                    ) : (
                                                        <X className="w-3 h-3 text-neutral-500" />
                                                    )}
                                                </div>
                                                <span
                                                    className={`text-body-sm ${
                                                        point.included
                                                            ? "text-neutral-300"
                                                            : "text-neutral-500 line-through"
                                                    }`}
                                                >
                                                    {point.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Divider */}
                <div
                    className={`border-t ${
                        isFeatured ? "border-pink-500/20" : "border-white/10"
                    } my-4`}
                />

                {/* CTA Button */}
                <Button
                    variant={isFeatured ? "primary" : "secondary"}
                    size="md"
                    onClick={handleSelectPlan}
                    darkMode
                    fullWidth
                >
                    {plan.buttonText || t("selectPlan")}
                </Button>
            </div>
        </div>
    );
};
