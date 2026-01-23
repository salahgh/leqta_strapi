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

// Fallback Content Component - uses translations when CMS data is unavailable
const FallbackContent = ({ activeSection, t, isRTL }: { activeSection: string; t: any; isRTL: boolean }) => {
    switch (activeSection) {
        case "informationCollect":
            return (
                <SectionWrapper title={t("sections.informationCollect.title")} isRTL={isRTL}>
                    <p className="mb-4">{t("sections.informationCollect.intro")}</p>
                    <ul className={`space-y-3 ${isRTL ? "list-disc pr-5" : "list-disc pl-5"}`}>
                        <li>
                            <span className="font-semibold">{t("sections.informationCollect.personalInfo")}</span>{" "}
                            {t("sections.informationCollect.personalInfoDesc")}
                        </li>
                        <li>
                            <span className="font-semibold">{t("sections.informationCollect.usageData")}</span>{" "}
                            {t("sections.informationCollect.usageDataDesc")}
                        </li>
                    </ul>
                </SectionWrapper>
            );
        case "howWeUse":
            return (
                <SectionWrapper title={t("sections.howWeUse.title")} isRTL={isRTL}>
                    <p>{t("sections.howWeUse.content")}</p>
                </SectionWrapper>
            );
        case "dataProtection":
            return (
                <SectionWrapper title={t("sections.dataProtection.title")} isRTL={isRTL}>
                    <p>{t("sections.dataProtection.content")}</p>
                </SectionWrapper>
            );
        case "sharing":
            return (
                <SectionWrapper title={t("sections.sharing.title")} isRTL={isRTL}>
                    <p>{t("sections.sharing.content")}</p>
                </SectionWrapper>
            );
        case "cookies":
            return (
                <SectionWrapper title={t("sections.cookies.title")} isRTL={isRTL}>
                    <p>{t("sections.cookies.content")}</p>
                </SectionWrapper>
            );
        case "rights":
            return (
                <SectionWrapper title={t("sections.rights.title")} isRTL={isRTL}>
                    <p className="mb-4">{t("sections.rights.intro")}</p>
                    <ul className={`space-y-2 ${isRTL ? "list-disc pr-5" : "list-disc pl-5"}`}>
                        <li>{t("sections.rights.access")}</li>
                        <li>{t("sections.rights.corrections")}</li>
                        <li>{t("sections.rights.withdraw")}</li>
                    </ul>
                </SectionWrapper>
            );
        case "thirdParty":
            return (
                <SectionWrapper title={t("sections.thirdParty.title")} isRTL={isRTL}>
                    <p>{t("sections.thirdParty.content")}</p>
                </SectionWrapper>
            );
        case "changes":
            return (
                <SectionWrapper title={t("sections.changes.title")} isRTL={isRTL}>
                    <p>{t("sections.changes.content")}</p>
                </SectionWrapper>
            );
        default:
            return null;
    }
};

export default function PrivacyPolicyClient({ cmsData, locale }: PrivacyPolicyClientProps) {
    const t = useTranslations("privacyPolicy");
    const currentLocale = useLocale();
    const isRTL = currentLocale === "ar" || locale === "ar";

    // Use CMS data if available, otherwise use fallback translations
    const useCMS = cmsData && cmsData.sections && cmsData.sections.length > 0;

    // Build sections list from CMS or fallback
    const sections = useCMS && cmsData.sections
        ? cmsData.sections.map(section => ({
              id: section.sectionId,
              label: section.title,
          }))
        : [
              { id: "informationCollect", label: t("sections.informationCollect.title") },
              { id: "howWeUse", label: t("sections.howWeUse.title") },
              { id: "dataProtection", label: t("sections.dataProtection.title") },
              { id: "sharing", label: t("sections.sharing.title") },
              { id: "cookies", label: t("sections.cookies.title") },
              { id: "rights", label: t("sections.rights.title") },
              { id: "thirdParty", label: t("sections.thirdParty.title") },
              { id: "changes", label: t("sections.changes.title") },
          ];

    const [activeSection, setActiveSection] = useState(sections[0]?.id || "dataProtection");

    // Update active section when sections change
    useEffect(() => {
        if (sections.length > 0 && !sections.find(s => s.id === activeSection)) {
            setActiveSection(sections[0].id);
        }
    }, [sections, activeSection]);

    // Get title and description from CMS or translations
    const title = useCMS && cmsData.title ? cmsData.title : t("title");
    const description = useCMS && cmsData.description ? cmsData.description : t("description");

    const renderContent = () => {
        if (useCMS && cmsData) {
            return <CMSContent privacyPolicy={cmsData} activeSection={activeSection} isRTL={isRTL} />;
        }
        return <FallbackContent activeSection={activeSection} t={t} isRTL={isRTL} />;
    };

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
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}
