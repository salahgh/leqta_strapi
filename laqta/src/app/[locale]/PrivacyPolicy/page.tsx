import React from "react";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

interface PrivacyPolicyPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function PrivacyPolicyPage({ params }: PrivacyPolicyPageProps) {
    const { locale } = await params;

    return (
        <div className="bg-primary">
            <Navigation />

            <div className="animate-fade-in" style={{ opacity: 0, animationDelay: "150ms" }}>
                <PrivacyPolicyClient />
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
