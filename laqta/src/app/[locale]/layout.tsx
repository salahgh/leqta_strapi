import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import React from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BackToTop } from "@/components/ui/BackToTop";
import { CookieConsentWrapper } from "@/components/ui/CookieConsentWrapper";
import { TrackingScriptsWrapper } from "@/components/ui/TrackingScriptsWrapper";
import { Poppins, Alexandria } from "next/font/google";
import "../../../styles/globals.css";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
    display: "swap",
});

const alexandria = Alexandria({
    subsets: ["arabic", "latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-alexandria",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Laqta Design System",
    description: "Starter with modern App Router",
};


// Add this function for static generation
export async function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    // Providing all messages to the client side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={`${poppins.variable} ${alexandria.variable}`}>
            <head>
                <title>Laqta</title>
                <link rel="icon" href="/images/fav_icon.jpg" />
            </head>
            <body
                className={`min-h-screen antialiased bg-primary flex flex-col ${
                    locale === "ar" ? "font-alexandria" : "font-poppins"
                }`}
            >
                {/* Skip Navigation Link for Accessibility */}
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:shadow-lg"
                >
                    Skip to main content
                </a>

                <ErrorBoundary>
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <main className="flex-1 w-full" id="main-content">
                            {children}
                        </main>
                        <BackToTop />
                        <CookieConsentWrapper locale={locale} />
                        {/* Law 18-07: Only load tracking scripts after user consent */}
                        <TrackingScriptsWrapper />
                    </NextIntlClientProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}