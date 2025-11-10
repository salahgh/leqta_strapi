import React from "react";
import { FAQ, faqsApi } from "@/lib/strapi";
import { FAQSectionClient } from "./FAQSectionClient";

const FAQSection = async ({ locale }: { locale: string }) => {
    let faqs: FAQ[] | null = null;
    let error: string | null = null;

    try {
        const response = await faqsApi.getAll({
            sort: "order:asc",
            pageSize: 20,
            locale: locale,
        });

        if (response.data && response.data.length > 0) {
            faqs = response.data;
        }
    } catch (err) {
        console.error("Failed to fetch FAQs from Strapi:", err);
        error = err instanceof Error ? err.message : 'Failed to load FAQs';
    }

    return <FAQSectionClient faqs={faqs} error={error} />;
};

export default FAQSection;
