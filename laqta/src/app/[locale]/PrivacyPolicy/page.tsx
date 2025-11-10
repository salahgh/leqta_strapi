"use client";

import React, { useState, useParams } from "react";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";

const PRIVACY_SECTIONS = {
    "information-collect": {
        title: "Information We Collect",
        content: (
            <div>
                <p className="text-gray-700 text-lg mb-6">
                    We may collect the following types of information:
                </p>
                <ul className="space-y-4">
                    <li className="text-gray-700 text-lg">
                        <span className="font-semibold">
                            Personal Information:
                        </span>{" "}
                        such as your name, email address, phone number, and any
                        other information you provide through our contact forms.
                    </li>
                    <li className="text-gray-700 text-lg">
                        <span className="font-semibold">Usage Data:</span>{" "}
                        including your IP address, browser type, device
                        information, and pages visited, collected through
                        cookies and analytics tools.
                    </li>
                </ul>
            </div>
        ),
    },
    "how-we-use": {
        title: "How We Use Your Information",
        content: (
            <p className="text-gray-700 text-lg">
                We use the information we collect to provide and improve our
                services, communicate with you, and ensure the security of our
                platform. This includes responding to your inquiries, sending
                updates about our services, and analyzing usage patterns to
                enhance user experience.
            </p>
        ),
    },
    "data-protection": {
        title: "How We Protect Your Data",
        content: (
            <p className="text-gray-700 text-lg">
                We take appropriate security measures to protect your personal
                information from unauthorized access, disclosure, alteration, or
                destruction.
            </p>
        ),
    },
    sharing: {
        title: "Sharing of Information",
        content: (
            <p className="text-gray-700 text-lg">
                We do not sell, trade, or rent your personal information. We may
                share information with trusted service providers who help us
                operate the website — but only when necessary and under strict
                confidentiality agreements.
            </p>
        ),
    },
    cookies: {
        title: "Cookies",
        content: (
            <p className="text-gray-700 text-lg">
                We use cookies to understand website traffic and improve your
                experience. You can control or disable cookies through your
                browser settings.
            </p>
        ),
    },
    rights: {
        title: "Your Rights",
        content: (
            <div>
                <p className="text-gray-700 text-lg mb-6">
                    You have the right to:
                </p>
                <ul className="space-y-3">
                    <li className="text-gray-700 text-lg">
                        • Access the personal data we hold about you
                    </li>
                    <li className="text-gray-700 text-lg">
                        • Request corrections or deletion
                    </li>
                    <li className="text-gray-700 text-lg">
                        • Withdraw consent at any time
                    </li>
                </ul>
            </div>
        ),
    },
    "third-party": {
        title: "Third-Party Links",
        content: (
            <p className="text-gray-700 text-lg">
                Our website may contain links to other sites. We are not
                responsible for their content or privacy practices.
            </p>
        ),
    },
    changes: {
        title: "Changes to This Policy",
        content: (
            <p className="text-gray-700 text-lg">
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page with an updated effective date.
            </p>
        ),
    },
};

const SectionWrapper = ({ title, children }) => (
    <div className={"text-left w-full"}>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{title}</h2>
        {children}
    </div>
);

const renderContent = (activeSection) => {
    const section = PRIVACY_SECTIONS[activeSection];

    if (!section) {
        return null;
    }

    return (
        <SectionWrapper title={section.title}>{section.content}</SectionWrapper>
    );
};

export default function Page() {
    const params = useParams();
    const locale = (params?.locale as string) || "en";
    const [activeSection, setActiveSection] = useState("data-protection");

    const sections = [
        { id: "information-collect", label: "Information We Collect" },
        { id: "how-we-use", label: "How We Use Your Information" },
        { id: "data-protection", label: "How We Protect Your Data" },
        { id: "sharing", label: "Sharing of Information" },
        { id: "cookies", label: "Cookies" },
        { id: "rights", label: "Your Rights" },
        { id: "third-party", label: "Third-Party Links" },
        { id: "changes", label: "Changes to This Policy" },
    ];

    return (
        <div className="bg-primary">
            {/* Header */}
            <Navigation />

            {/* Privacy Policy Introduction */}
            <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center flex-col items-center text-center">
                <div className={"text-white"} style={{ fontSize: 65 }}>
                    Privacy Policy
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
                        At LAQTA, your privacy matters. This Privacy Policy
                        explains how we collect, use, and protect your personal
                        information when you visit our website or contact us.
                    </p>
                </div>

                {/* Main Content Container */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100/50 overflow-hidden backdrop-blur-sm border border-gray-100">
                    <div className="flex flex-col lg:flex-row min-h-[600px]">
                        {/* Sidebar Navigation */}
                        <div className="lg:w-1/3 bg-gray-50/50 p-8 border-r border-gray-100">
                            <nav className="space-y-2">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() =>
                                            setActiveSection(section.id)
                                        }
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 text-lg font-medium ${
                                            activeSection === section.id
                                                ? "bg-white text-gray-900 shadow-sm border-l-4 border-blue-400"
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
                            {renderContent(activeSection)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200/15 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-200/15 rounded-full blur-3xl"></div>
            </div>
            <Footer locale={locale} />
        </div>
    );
}
