import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import React from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BackToTop } from "@/components/ui/BackToTop";
import "../../../styles/globals.css";

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
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Gotham:wght@100;200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
                <title>Laqta</title>
            </head>
            <body
                className={`min-h-screen font-sans antialiased bg-black flex flex-col items-center ${
                    locale === "ar" ? "font-arabic" : ""
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
                    <main className="flex-1 w-full" style={{ maxWidth: 1540 }} id="main-content">
                        <NextIntlClientProvider messages={messages}>
                            {children}
                        </NextIntlClientProvider>
                    </main>
                    <BackToTop />
                </ErrorBoundary>
            </body>
        </html>
    );
}