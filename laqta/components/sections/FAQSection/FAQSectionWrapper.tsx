import React, { Suspense } from "react";
import FAQSection from "./FAQSection"; // Your async FAQ component

interface FAQSectionWrapperProps {
    loadingComponent?: React.ReactNode;
    locale: string;
}

// Sync wrapper for FAQSection
export const FAQSectionWrapper: React.FC<FAQSectionWrapperProps> = ({
    loadingComponent,
    locale,
}) => {
    const defaultLoadingComponent = (
        <div className="py-16 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-600">Loading FAQs...</span>
        </div>
    );

    return (
        <Suspense fallback={loadingComponent || defaultLoadingComponent}>
            {/* @ts-expect-error Server Component */}
            <FAQSection locale={locale} />
        </Suspense>
    );
};

export default FAQSectionWrapper;
