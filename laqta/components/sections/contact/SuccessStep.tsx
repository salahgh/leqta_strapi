"use client";

import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";

interface SuccessStepProps {
    onGoToMainPage?: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ onGoToMainPage }) => {
    const t = useTranslations();

    const handleGoHome = () => {
        if (onGoToMainPage) {
            onGoToMainPage();
        }
        // Navigate to main page in real implementation
    };

    return (
        <div
            className="border border-primary-light/50 rounded-xl shadow-lg bg-neutral-900/30 backdrop-blur-sm
            card-p-lg text-center stack-gap-lg w-full flex flex-col items-center justify-center"
        >
            {/* Success Icon */}
            <div
                className="flex justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full
                        items-center shadow-2xl"
            >
                <CheckCircle className="w-12 h-12 text-white" />
            </div>

            {/* Success Title */}
            <div className="stack-gap-sm">
                <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 text-display-lg sm:text-display-xl leading-tight">
                    {t('contactPage.success.title')}
                </h1>

                <p className="text-accent-success text-body-lg sm:text-body-xl leading-relaxed">
                    {t('contactPage.success.description')}
                </p>
            </div>

            {/* Additional Success Details */}
            <div className="bg-neutral-800/30 backdrop-blur-sm rounded-xl card-p-md border border-neutral-700/50">
                <div className="stack-gap-sm text-left">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-secondary-gray">
                            {t('contactPage.success.personalInfoSubmitted')}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-secondary-gray">
                            {t('contactPage.success.companyInfoSubmitted')}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-secondary-gray">
                            {t('contactPage.success.socialMediaSubmitted')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-900/30 backdrop-blur-sm rounded-xl card-p-md border border-primary-light/50">
                <h3 className="text-body-lg font-semibold text-blue-200 mb-3">
                    {t('contactPage.success.nextStepsTitle')}
                </h3>
                <div className="stack-gap-xs text-left text-body-sm text-blue-100">
                    <p>
                        • {t('contactPage.success.reviewSubmission')}
                    </p>
                    <p>• {t('contactPage.success.confirmationEmail')}</p>
                    <p>• {t('contactPage.success.scheduleCall')}</p>
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
                <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    leftIcon={null}
                    onClick={handleGoHome}
                    className="w-full max-w-xs mx-auto bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-500/30"
                >
                    {t('contactPage.buttons.goBackToMainPage')}
                </Button>
            </div>

            {/* Reference ID */}
            <div className="text-body-xs text-neutral-500">
                {t('contactPage.success.referenceId')} #LEQTA-
                {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
        </div>
    );
};

export default SuccessStep;
