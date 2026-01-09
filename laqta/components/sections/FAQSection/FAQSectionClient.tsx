"use client";

import React, { useState } from "react";
import { FAQ } from "@/lib/strapi";
import { FAQItem } from "@/components/sections/FAQSection/FAQItem";
import { Badge } from "@/components/ui/Badge";
import { useTranslations } from "next-intl";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import "@/components/sections/styles.css";

interface FAQSectionClientProps {
    faqs: FAQ[] | null;
    error?: string | null;
}

export const FAQSectionClient: React.FC<FAQSectionClientProps> = ({
    faqs,
    error,
}) => {
    const [openIndex, setOpenIndex] = useState(0);
    const t = useTranslations("faq");

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section className="relative section-py-lg overflow-hidden" style={{ backgroundColor: "#d5ebf9" }}>
            {/* Decorative Background */}
            <div className="absolute inset-0 z-0 flex flex-col justify-start items-center">
                <img
                    src="/images/laqta_logo_courbe.svg"
                    alt=""
                    className="w-2/3 aspect-square object-fill opacity-70"
                    aria-hidden="true"
                />
            </div>

            {/* Gradient Overlay */}
            <div
                className="absolute inset-0 z-5 blue_gradient"
                style={{ height: "100%" }}
            />

            <div className="section-px relative z-10">
                <div className="max-w-container mx-auto text-center flex items-center flex-col space-y-6 md:space-y-12">
                    <div className="animate-slide-down" style={{ opacity: 0 }}>
                        <Badge variant="accent">{t("badge")}</Badge>
                    </div>
                    <h2
                        className="text-gray-900 mx-auto animate-slide-up"
                        style={{ opacity: 0, animationDelay: "150ms" }}
                    >
                        {t("title")}
                    </h2>
                    <p
                        className="text-secondary-gray text-body-md sm:text-body-lg md:text-body-xl max-w-4xl text-center animate-fade-in"
                        style={{ opacity: 0, animationDelay: "300ms" }}
                    >
                        {t("description")}
                    </p>

                    <div
                        className="animate-fade-in border-gray-200 mx-auto w-full max-w-container rounded-2xl md:rounded-3xl border-2 p-4 sm:p-8 md:p-16"
                        style={{ opacity: 0, animationDelay: "450ms" }}
                    >
                        {error ? (
                            <ErrorFallback
                                title="Unable to load FAQs"
                                message={error}
                            />
                        ) : !faqs || faqs.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-neutral-600 text-body-lg">
                                    No FAQs available at the moment.
                                </p>
                            </div>
                        ) : (
                            faqs.map((faq, index) => (
                                <FAQItem
                                    key={faq.id}
                                    question={faq.question}
                                    answer={faq.answer}
                                    isOpen={openIndex === index}
                                    onToggle={() => handleToggle(index)}
                                    isLast={index === faqs.length - 1}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
