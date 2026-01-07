/**
 * PlansSection Component - Design System
 * Displays pricing plans with features
 * Mobile-first responsive design
 */

import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plan, plansApi } from "@/lib/strapi";
import { getTranslations } from "next-intl/server";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { Link } from "@/src/i18n/navigation";

// Types
interface PlansSectionProps {
    badge?: string;
    title?: string;
    description?: string;
    className?: string;
    locale: string;
}

// Server-side function to fetch plans
async function getPlans(
    locale: string,
): Promise<{ data: Plan[]; error?: string }> {
    try {
        const response = await plansApi.getAll({
            sort: "order:asc",
            locale: locale,
        });

        return { data: response.data || [] };
    } catch (error) {
        console.error("Error fetching plans:", error);
        return {
            data: [],
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to load plans",
        };
    }
}

// Plan Card Component
function PlanCard({ plan, isPopular }: { plan: Plan; isPopular?: boolean }) {
    return (
        <div
            className={`relative flex flex-col rounded-2xl p-6 lg:p-8 h-full transition-all duration-300 ${
                isPopular
                    ? "bg-primary text-white shadow-2xl scale-105 border-2 border-primary-light"
                    : "bg-white text-neutral-900 shadow-lg border border-neutral-200 hover:shadow-xl"
            }`}
        >
            {/* Popular Badge */}
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="accent" size="sm">
                        Most Popular
                    </Badge>
                </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-6">
                <h3
                    className={`text-xl lg:text-2xl font-bold mb-2 ${
                        isPopular ? "text-white" : "text-neutral-900"
                    }`}
                >
                    {plan.title}
                </h3>
                {plan.description && (
                    <p
                        className={`text-body-sm ${
                            isPopular ? "text-white/80" : "text-neutral-600"
                        }`}
                    >
                        {plan.description}
                    </p>
                )}
            </div>

            {/* Price */}
            <div className="text-center mb-6">
                {plan.isCustomPricing ? (
                    <div>
                        <p
                            className={`text-lg font-semibold ${
                                isPopular ? "text-white" : "text-primary"
                            }`}
                        >
                            {plan.customPricingText || "Custom Pricing"}
                        </p>
                    </div>
                ) : (
                    <div>
                        <span
                            className={`text-3xl lg:text-4xl font-bold ${
                                isPopular ? "text-white" : "text-primary"
                            }`}
                        >
                            {plan.price}
                        </span>
                    </div>
                )}
            </div>

            {/* Sections & Features */}
            <div className="flex-1 space-y-6 mb-6">
                {plan.sections?.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                        <h4
                            className={`text-sm font-semibold uppercase tracking-wide mb-3 ${
                                isPopular ? "text-white/90" : "text-neutral-700"
                            }`}
                        >
                            {section.title}
                        </h4>
                        <ul className="space-y-2">
                            {section.points?.map((point, pointIndex) => (
                                <li
                                    key={pointIndex}
                                    className="flex items-start gap-3"
                                >
                                    {point.included ? (
                                        <Check
                                            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                                isPopular
                                                    ? "text-green-300"
                                                    : "text-green-500"
                                            }`}
                                        />
                                    ) : (
                                        <X
                                            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                                isPopular
                                                    ? "text-white/40"
                                                    : "text-neutral-400"
                                            }`}
                                        />
                                    )}
                                    <span
                                        className={`text-body-sm ${
                                            point.included
                                                ? isPopular
                                                    ? "text-white"
                                                    : "text-neutral-700"
                                                : isPopular
                                                  ? "text-white/50 line-through"
                                                  : "text-neutral-400 line-through"
                                        }`}
                                    >
                                        {point.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* CTA Button */}
            <Link href={plan.buttonLink || "/contact"} className="mt-auto">
                <Button
                    variant={isPopular ? "secondary" : "primary"}
                    size="lg"
                    className="w-full"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                    {plan.buttonText || "Get Started"}
                </Button>
            </Link>
        </div>
    );
}

// Main Plans Section Component
export default async function PlansSection({
    badge,
    title,
    description,
    className = "",
    locale,
}: PlansSectionProps) {
    const t = await getTranslations("plans");

    // Use translations as fallback values
    const finalBadge = badge || t("badge");
    const finalTitle = title || t("title");
    const finalDescription = description || t("description");

    const { data: plans, error: plansError } = await getPlans(locale);

    return (
        <section
            id="plans"
            className={`relative overflow-hidden bg-neutral-50 section-py ${className}`}
        >
            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="text-center flex flex-col items-center gap-4 section-px mb-12 lg:mb-16">
                    <div className="animate-slide-down" style={{ opacity: 0 }}>
                        <Badge size="md" variant="primary">
                            {finalBadge}
                        </Badge>
                    </div>

                    <h2
                        className="text-neutral-900 text-center animate-slide-up"
                        style={{ opacity: 0, animationDelay: "150ms" }}
                    >
                        {finalTitle}
                    </h2>

                    <p
                        className="text-neutral-600 text-body-sm sm:text-body-md lg:text-body-lg max-w-2xl animate-fade-in"
                        style={{ opacity: 0, animationDelay: "300ms" }}
                    >
                        {finalDescription}
                    </p>
                </div>

                {/* Plans Grid */}
                <div
                    className="section-px animate-fade-in"
                    style={{ opacity: 0, animationDelay: "450ms" }}
                >
                    {plansError ? (
                        <ErrorFallback
                            title="Unable to load plans"
                            message={plansError}
                        />
                    ) : plans.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-neutral-600 text-body-lg">
                                No plans available at the moment.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6 max-w-6xl mx-auto items-stretch">
                            {plans.map((plan, index) => (
                                <PlanCard
                                    key={plan.id || index}
                                    plan={plan}
                                    isPopular={plan.featured}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

// Add revalidation for server-side rendering
export const revalidate = 600; // 10 minutes
