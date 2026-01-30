"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PrivacyPolicy } from "@/lib/strapi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PrivacyPolicyClientProps {
    cmsData: PrivacyPolicy | null;
    locale: string;
}

const SectionWrapper = ({ title, children, isRTL }: { title: string; children: React.ReactNode; isRTL: boolean }) => (
    <div className={`w-full ${isRTL ? "text-right" : "text-left"}`}>
        <h2 className="text-display-xs md:text-display-sm font-bold text-gray-900 mb-4 md:mb-6">{title}</h2>
        <div className="text-body-md md:text-body-lg text-gray-700 leading-relaxed">
            {children}
        </div>
    </div>
);

// CMS Content Component - renders markdown content from CMS
const CMSContent = ({
    privacyPolicy,
    activeSection,
    isRTL
}: {
    privacyPolicy: PrivacyPolicy;
    activeSection: string;
    isRTL: boolean;
}) => {
    const section = privacyPolicy.sections?.find(s => s.sectionId === activeSection);

    if (!section) {
        return (
            <div className="text-gray-700 text-lg">
                Section content not available.
            </div>
        );
    }

    return (
        <SectionWrapper title={section.title} isRTL={isRTL}>
            <div className={`prose prose-base md:prose-lg max-w-none prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-ul:space-y-2 prose-ol:space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {section.content}
                </ReactMarkdown>
            </div>
        </SectionWrapper>
    );
};

// Empty State Component - shown when CMS data is unavailable
const EmptyState = ({ isRTL }: { isRTL: boolean }) => {
    const t = useTranslations("privacyPolicy");

    return (
        <div className={`flex flex-col items-center justify-center min-h-[400px] text-center ${isRTL ? "text-right" : "text-left"}`}>
            <div className="w-16 h-16 mb-6 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
            </div>
            <h3 className="text-display-xs font-semibold text-gray-900 mb-2">
                {t("emptyState.title")}
            </h3>
            <p className="text-body-md text-gray-500 max-w-md">
                {t("emptyState.message")}
            </p>
        </div>
    );
};

export default function PrivacyPolicyClient({ cmsData, locale }: PrivacyPolicyClientProps) {
    const t = useTranslations("privacyPolicy");
    const currentLocale = useLocale();
    const isRTL = currentLocale === "ar" || locale === "ar";

    // Check if CMS data is available
    const hasCMSData = cmsData && cmsData.sections && cmsData.sections.length > 0;

    // Build sections list from CMS only
    const sections = hasCMSData && cmsData.sections
        ? cmsData.sections.map(section => ({
              id: section.sectionId,
              label: section.title,
          }))
        : [];

    const [activeSection, setActiveSection] = useState(sections[0]?.id || "");

    // Update active section when sections change
    useEffect(() => {
        if (sections.length > 0 && !sections.find(s => s.id === activeSection)) {
            setActiveSection(sections[0].id);
        }
    }, [sections, activeSection]);

    // Get title and description from CMS or translations for header
    const title = hasCMSData && cmsData.title ? cmsData.title : t("title");
    const description = hasCMSData && cmsData.description ? cmsData.description : t("description");

    // If no CMS data, show empty state
    if (!hasCMSData) {
        return (
            <div
                className="max-w-6xl mx-auto section-px py-12 md:py-16 lg:py-20"
                dir={isRTL ? "rtl" : "ltr"}
            >
                {/* Header Section */}
                <div className="text-center mb-10 md:mb-14">
                    <h1 className="text-display-md md:text-display-lg lg:text-display-xl font-bold text-white mb-4 md:mb-6">
                        {t("title")}
                    </h1>
                </div>

                {/* Empty State Container */}
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl shadow-blue-100/50 overflow-hidden border border-gray-100">
                    <EmptyState isRTL={isRTL} />
                </div>
            </div>
        );
    }

    return (
        <div
            className="max-w-6xl mx-auto section-px py-12 md:py-16 lg:py-20"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Header Section */}
            <div className="text-center mb-10 md:mb-14">
                <h1 className="text-display-md md:text-display-lg lg:text-display-xl font-bold text-white mb-4 md:mb-6">
                    {title}
                </h1>
                <p className="text-body-md md:text-body-lg lg:text-body-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Main Content Container */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl shadow-blue-100/50 overflow-hidden border border-gray-100">
                <div className={`flex flex-col lg:flex-row min-h-[500px] md:min-h-[600px] ${isRTL ? "lg:flex-row-reverse" : ""}`}>
                    {/* Sidebar Navigation - Right side in RTL */}
                    <div className={`lg:w-1/3 bg-gray-50/50 p-5 md:p-6 lg:p-8 border-b lg:border-b-0 border-gray-100 ${isRTL ? "lg:border-l" : "lg:border-r"}`}>
                        <nav className="space-y-1 md:space-y-2">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-all duration-200 text-body-sm md:text-body-md font-medium ${isRTL ? "text-right" : "text-left"} ${
                                        activeSection === section.id
                                            ? `bg-white text-gray-900 shadow-sm border-primary ${isRTL ? "border-r-4" : "border-l-4"}`
                                            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                                    }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Area - Left side in RTL */}
                    <div className="lg:w-2/3 p-5 md:p-8 lg:p-10">
                        <CMSContent privacyPolicy={cmsData} activeSection={activeSection} isRTL={isRTL} />
                    </div>
                </div>
            </div>
        </div>
    );
}
