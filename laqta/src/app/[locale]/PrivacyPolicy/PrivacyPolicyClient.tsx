"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

const SectionWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className={"text-start w-full"}>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{title}</h2>
        {children}
    </div>
);

export default function PrivacyPolicyClient() {
    const [activeSection, setActiveSection] = useState("dataProtection");
    const t = useTranslations("privacyPolicy");

    const sections = [
        { id: "informationCollect", label: t("sections.informationCollect.title") },
        { id: "howWeUse", label: t("sections.howWeUse.title") },
        { id: "dataProtection", label: t("sections.dataProtection.title") },
        { id: "sharing", label: t("sections.sharing.title") },
        { id: "cookies", label: t("sections.cookies.title") },
        { id: "rights", label: t("sections.rights.title") },
        { id: "thirdParty", label: t("sections.thirdParty.title") },
        { id: "changes", label: t("sections.changes.title") },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "informationCollect":
                return (
                    <SectionWrapper title={t("sections.informationCollect.title")}>
                        <div>
                            <p className="text-gray-700 text-lg mb-6">
                                {t("sections.informationCollect.intro")}
                            </p>
                            <ul className="space-y-4">
                                <li className="text-gray-700 text-lg">
                                    <span className="font-semibold">
                                        {t("sections.informationCollect.personalInfo")}
                                    </span>{" "}
                                    {t("sections.informationCollect.personalInfoDesc")}
                                </li>
                                <li className="text-gray-700 text-lg">
                                    <span className="font-semibold">
                                        {t("sections.informationCollect.usageData")}
                                    </span>{" "}
                                    {t("sections.informationCollect.usageDataDesc")}
                                </li>
                            </ul>
                        </div>
                    </SectionWrapper>
                );
            case "howWeUse":
                return (
                    <SectionWrapper title={t("sections.howWeUse.title")}>
                        <p className="text-gray-700 text-lg">
                            {t("sections.howWeUse.content")}
                        </p>
                    </SectionWrapper>
                );
            case "dataProtection":
                return (
                    <SectionWrapper title={t("sections.dataProtection.title")}>
                        <p className="text-gray-700 text-lg">
                            {t("sections.dataProtection.content")}
                        </p>
                    </SectionWrapper>
                );
            case "sharing":
                return (
                    <SectionWrapper title={t("sections.sharing.title")}>
                        <p className="text-gray-700 text-lg">
                            {t("sections.sharing.content")}
                        </p>
                    </SectionWrapper>
                );
            case "cookies":
                return (
                    <SectionWrapper title={t("sections.cookies.title")}>
                        <p className="text-gray-700 text-lg">
                            {t("sections.cookies.content")}
                        </p>
                    </SectionWrapper>
                );
            case "rights":
                return (
                    <SectionWrapper title={t("sections.rights.title")}>
                        <div>
                            <p className="text-gray-700 text-lg mb-6">
                                {t("sections.rights.intro")}
                            </p>
                            <ul className="space-y-3">
                                <li className="text-gray-700 text-lg">
                                    • {t("sections.rights.access")}
                                </li>
                                <li className="text-gray-700 text-lg">
                                    • {t("sections.rights.corrections")}
                                </li>
                                <li className="text-gray-700 text-lg">
                                    • {t("sections.rights.withdraw")}
                                </li>
                            </ul>
                        </div>
                    </SectionWrapper>
                );
            case "thirdParty":
                return (
                    <SectionWrapper title={t("sections.thirdParty.title")}>
                        <p className="text-gray-700 text-lg">
                            {t("sections.thirdParty.content")}
                        </p>
                    </SectionWrapper>
                );
            case "changes":
                return (
                    <SectionWrapper title={t("sections.changes.title")}>
                        <p className="text-gray-700 text-lg">
                            {t("sections.changes.content")}
                        </p>
                    </SectionWrapper>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center flex-col items-center text-center">
            <div className={"text-white"} style={{ fontSize: 65 }}>
                {t("title")}
            </div>
            <div className="text-center mb-12">
                <p
                    className=""
                    style={{
                        color: "#C6BBBB",
                        fontSize: 24,
                        maxWidth: 900,
                    }}
                >
                    {t("description")}
                </p>
            </div>

            {/* Main Content Container */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100/50 overflow-hidden backdrop-blur-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row min-h-[600px]">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-1/3 bg-gray-50/50 p-8 border-e border-gray-100">
                        <nav className="space-y-2">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() =>
                                        setActiveSection(section.id)
                                    }
                                    className={`w-full text-start px-4 py-3 rounded-lg transition-all duration-200 text-lg font-medium ${
                                        activeSection === section.id
                                            ? "bg-white text-gray-900 shadow-sm border-s-4 border-blue-400"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                                    }`}
                                    style={{ fontSize: 20 }}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="lg:w-2/3 p-8 lg:p-12">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}
