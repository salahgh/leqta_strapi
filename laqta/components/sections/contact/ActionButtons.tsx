import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";

export const ActionButtons = ({
    handleGoBack,
    currentStep,
    totalSteps,
    isSubmitting,
    formId
}) => {
    const t = useTranslations('contactPage.buttons');
    
    return (
        <div className={"flex w-full justify-end items-center gap-4 h-12"}>
            <Button
                type="button"
                variant="secondary"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                rightIcon={null}
                onClick={handleGoBack}
            >
                {t('goBack')}
            </Button>

            <Button
                type="submit"
                form={formId}
                variant="primary"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                leftIcon={null}
                disabled={isSubmitting}
            >
                {currentStep === totalSteps ? t('submit') : t('next')} {currentStep}/{totalSteps}
            </Button>
        </div>
    );
};
