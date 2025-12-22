// Plan Card Component
import { Check, Sparkles } from "lucide-react";
import React from "react";
import { Link } from "@/src/i18n/navigation";
import { Button } from "@/components/ui/Button";

interface PlanCardProps {
    title: string;
    description: string;
    price?: string;
    buttonText: string;
    features?: string[];
    equipment?: string[];
    variant?: "basic" | "premium";
    featuresTitle?: string;
    equipmentTitle?: string;
}

export const PlanCard = ({
    title,
    description,
    price,
    buttonText,
    features,
    equipment,
    variant = "basic",
    featuresTitle = "What's Included",
    equipmentTitle = "Equipment Included",
}: PlanCardProps) => {
    const isPremium = variant === "premium";

    return (
        <div
            className={`
                relative rounded-2xl md:rounded-3xl overflow-hidden h-full
                ${
                    isPremium
                        ? "bg-gradient-to-b from-primary/60 to-pink-600/80"
                        : "bg-primary/80 border border-white/10"
                }
                backdrop-blur-sm shadow-2xl
                hover:shadow-3xl hover:border-white/20 transition-all duration-300
            `}
        >
            {/* Premium background logo */}
            {isPremium && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <img
                        src="/images/vector_courbe.svg"
                        alt=""
                        className="w-full h-full object-contain"
                        aria-hidden="true"
                    />
                    {/* Gradient overlay to fade logo at top */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(to bottom, rgba(88, 28, 135, 0.80) 0%, rgba(88, 28, 135, 0.7) 20%, transparent 50%)",
                        }}
                    />
                </div>
            )}

            {/* Premium highlight bar */}
            {isPremium && (
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
            )}

            <div className="relative z-10 flex flex-col h-full p-5 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        {isPremium && (
                            <Sparkles className="w-5 h-5 text-pink-400" />
                        )}
                        <h3 className="text-display-xs md:text-display-sm font-bold text-white">
                            {title}
                        </h3>
                    </div>
                    <p className="text-body-sm md:text-body-md text-neutral-300 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Features Section */}
                {features && features.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-body-md font-semibold text-white mb-4">
                            {featuresTitle}
                        </h4>
                        <ul className="space-y-3">
                            {features.map((feature, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3"
                                >
                                    <div
                                        className={`
                                        flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5
                                        ${isPremium ? "bg-pink-500/20" : "bg-accent-blue/20"}
                                    `}
                                    >
                                        <Check
                                            className={`w-3 h-3 ${isPremium ? "text-pink-400" : "text-accent-blue"}`}
                                        />
                                    </div>
                                    <span className="text-body-sm text-neutral-300">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Equipment Section */}
                {equipment && equipment.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-body-md font-semibold text-white mb-4">
                            {equipmentTitle}
                        </h4>
                        <ul className="space-y-3">
                            {equipment.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3"
                                >
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                                        <Check className="w-3 h-3 text-green-400" />
                                    </div>
                                    <span className="text-body-sm text-neutral-300">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Divider */}
                <div
                    className={`border-t ${isPremium ? "border-pink-500/20" : "border-white/10"} my-4`}
                />

                {/* Footer with Price and CTA */}
                <div className="flex items-center justify-between gap-4">
                    {price ? (
                        <div>
                            <span className="text-display-xs md:text-display-sm font-bold text-white">
                                {price}
                            </span>
                        </div>
                    ) : (
                        <div className="text-body-sm text-neutral-400">
                            Custom pricing
                        </div>
                    )}

                    <Link href="/contact">
                        <Button
                            variant={isPremium ? "primary" : "secondary"}
                            size="md"
                            leftIcon={null}
                            rightIcon={null}
                            darkMode
                        >
                            {buttonText}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
