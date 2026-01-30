"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Shield, Cookie, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./Button";
import { CookieConsentContent } from "@/lib/strapi";

// Cookie consent storage key
const CONSENT_KEY = "leqta_cookie_consent";
const CONSENT_PREFERENCES_KEY = "leqta_cookie_preferences";

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
};

// Default content (fallback if CMS data is not available)
const defaultContent: CookieConsentContent = {
    id: 0,
    title: "We Value Your Privacy",
    description: "We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking \"Accept All\", you consent to our use of cookies.",
    lawReferenceTitle: "Law 18-07 Compliance:",
    lawReferenceDescription: "In accordance with Algerian Law No. 18-07 on the protection of personal data, we require your explicit consent before processing any personal information.",
    acceptAllButtonText: "Accept All",
    rejectAllButtonText: "Reject All",
    savePreferencesButtonText: "Save Preferences",
    managePreferencesText: "Manage cookie preferences",
    privacyPolicyLinkText: "Read our Privacy Policy",
    alwaysActiveText: "Always Active",
    rightsNotice: "You have the right to withdraw your consent at any time. For more information about your rights under Law 18-07, please visit our Privacy Policy.",
    necessaryCookiesTitle: "Necessary Cookies",
    necessaryCookiesDescription: "These cookies are essential for the website to function properly. They enable basic features like page navigation and secure access.",
    analyticsCookiesTitle: "Analytics Cookies",
    analyticsCookiesDescription: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
    marketingCookiesTitle: "Marketing Cookies",
    marketingCookiesDescription: "These cookies are used to track visitors across websites to display relevant advertisements based on your interests.",
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

interface CookieConsentProps {
    content?: CookieConsentContent | null;
}

export const CookieConsent = ({ content }: CookieConsentProps) => {
    const locale = useLocale();
    const isRTL = locale === "ar";

    // Use CMS content or fallback to defaults
    const c = content || defaultContent;

    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

    // Check if consent was already given
    useEffect(() => {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        } else {
            const savedPreferences = localStorage.getItem(CONSENT_PREFERENCES_KEY);
            if (savedPreferences) {
                setPreferences(JSON.parse(savedPreferences));
            }
        }
    }, []);

    const saveConsent = (accepted: boolean, prefs: CookiePreferences) => {
        localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "rejected");
        localStorage.setItem(CONSENT_PREFERENCES_KEY, JSON.stringify(prefs));
        setIsVisible(false);

        window.dispatchEvent(new CustomEvent("cookieConsentChanged", {
            detail: { accepted, preferences: prefs }
        }));
    };

    const handleAcceptAll = () => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            analytics: true,
            marketing: true,
        };
        setPreferences(allAccepted);
        saveConsent(true, allAccepted);
    };

    const handleRejectAll = () => {
        const onlyNecessary: CookiePreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
        };
        setPreferences(onlyNecessary);
        saveConsent(false, onlyNecessary);
    };

    const handleSavePreferences = () => {
        saveConsent(preferences.analytics || preferences.marketing, preferences);
    };

    const togglePreference = (key: keyof CookiePreferences) => {
        if (key === "necessary") return;
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300"
                onClick={() => {}}
            />

            {/* Cookie Consent Banner */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-[9999] transform transition-transform duration-500 ease-out ${
                    isVisible ? "translate-y-0" : "translate-y-full"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
                role="dialog"
                aria-labelledby="cookie-consent-title"
                aria-describedby="cookie-consent-description"
            >
                <div className="bg-white border-t border-gray-200 shadow-2xl">
                    <div className="max-w-7xl mx-auto p-4 md:p-6">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h2
                                    id="cookie-consent-title"
                                    className="text-lg md:text-xl font-bold text-gray-900 mb-1"
                                >
                                    {c.title}
                                </h2>
                                <p
                                    id="cookie-consent-description"
                                    className="text-sm md:text-base text-gray-600"
                                >
                                    {c.description}
                                </p>
                            </div>
                        </div>

                        {/* Law Reference */}
                        {(c.lawReferenceTitle || c.lawReferenceDescription) && (
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                                <p className="text-sm text-blue-800">
                                    {c.lawReferenceTitle && (
                                        <span className="font-semibold">{c.lawReferenceTitle} </span>
                                    )}
                                    {c.lawReferenceDescription}
                                </p>
                            </div>
                        )}

                        {/* Cookie Details Toggle */}
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors mb-4"
                        >
                            <Cookie className="w-4 h-4" />
                            {c.managePreferencesText || "Manage cookie preferences"}
                            {showDetails ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>

                        {/* Cookie Preferences Panel */}
                        {showDetails && (
                            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-4">
                                {/* Necessary Cookies */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">
                                            {c.necessaryCookiesTitle || "Necessary Cookies"}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {c.necessaryCookiesDescription || "Essential for the website to function properly."}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                                            {c.alwaysActiveText || "Always Active"}
                                        </span>
                                    </div>
                                </div>

                                {/* Analytics Cookies */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">
                                            {c.analyticsCookiesTitle || "Analytics Cookies"}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {c.analyticsCookiesDescription || "Help us understand how visitors use our website."}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={() => togglePreference("analytics")}
                                            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                                                preferences.analytics ? "bg-primary" : "bg-gray-300"
                                            }`}
                                            aria-label={c.analyticsCookiesTitle}
                                        >
                                            <span
                                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                                                    preferences.analytics
                                                        ? isRTL ? "right-6" : "left-6"
                                                        : isRTL ? "right-0.5" : "left-0.5"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Marketing Cookies */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">
                                            {c.marketingCookiesTitle || "Marketing Cookies"}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {c.marketingCookiesDescription || "Used to display relevant advertisements."}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={() => togglePreference("marketing")}
                                            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                                                preferences.marketing ? "bg-primary" : "bg-gray-300"
                                            }`}
                                            aria-label={c.marketingCookiesTitle}
                                        >
                                            <span
                                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                                                    preferences.marketing
                                                        ? isRTL ? "right-6" : "left-6"
                                                        : isRTL ? "right-0.5" : "left-0.5"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="flex flex-col sm:flex-row gap-3 flex-1">
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={handleAcceptAll}
                                    className="flex-1 sm:flex-none"
                                >
                                    {c.acceptAllButtonText || "Accept All"}
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="md"
                                    onClick={handleRejectAll}
                                    className="flex-1 sm:flex-none"
                                >
                                    {c.rejectAllButtonText || "Reject All"}
                                </Button>
                                {showDetails && (
                                    <Button
                                        variant="secondary"
                                        size="md"
                                        onClick={handleSavePreferences}
                                        className="flex-1 sm:flex-none"
                                    >
                                        {c.savePreferencesButtonText || "Save Preferences"}
                                    </Button>
                                )}
                            </div>
                            <Link
                                href="/PrivacyPolicy"
                                className="text-sm text-primary hover:text-primary-dark font-medium text-center sm:text-left"
                            >
                                {c.privacyPolicyLinkText || "Read our Privacy Policy"}
                            </Link>
                        </div>

                        {/* Data Subject Rights Notice */}
                        {c.rightsNotice && (
                            <p className="text-xs text-gray-500 mt-4">
                                {c.rightsNotice}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

// Utility hook to check consent status
export const useCookieConsent = () => {
    const [consent, setConsent] = useState<{
        given: boolean;
        preferences: CookiePreferences;
    } | null>(null);

    useEffect(() => {
        const checkConsent = () => {
            const consentValue = localStorage.getItem(CONSENT_KEY);
            const preferencesValue = localStorage.getItem(CONSENT_PREFERENCES_KEY);

            if (consentValue) {
                setConsent({
                    given: consentValue === "accepted",
                    preferences: preferencesValue
                        ? JSON.parse(preferencesValue)
                        : defaultPreferences,
                });
            } else {
                setConsent(null);
            }
        };

        checkConsent();

        const handleConsentChange = () => checkConsent();
        window.addEventListener("cookieConsentChanged", handleConsentChange);

        return () => {
            window.removeEventListener("cookieConsentChanged", handleConsentChange);
        };
    }, []);

    return consent;
};

// Utility to withdraw consent
export const withdrawCookieConsent = () => {
    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(CONSENT_PREFERENCES_KEY);
    window.dispatchEvent(new CustomEvent("cookieConsentChanged", {
        detail: { accepted: false, preferences: defaultPreferences }
    }));
    window.location.reload();
};
