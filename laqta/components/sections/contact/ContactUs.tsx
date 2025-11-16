"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import PersonalInfoStep from "./PersonalInfoStep";
import CompanyInfoStep from "./CompanyInfoStep";
import SocialMediaStep from "./SocialMediaStep";
import ProjectDetailsStep from "./ProjectDetailsStep";
import SuccessStep from "@/components/sections/contact/SuccessStep";
import { ActionButtons } from "@/components/sections/contact/ActionButtons";
import { Navigation } from "@/components/layout/Navigation";
import { StepperComponent } from "@/components/sections/contact/StepperComponent";

interface ContactFormData {
  // Personal Information
  fullName: string;
  email: string;
  phoneNumber: string;
  industry: string;
  otherIndustry: string;
  
  // Company Information
  companyName: string;
  jobTitle: string;
  website: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  
  // Project Information
  projectType: string;
  budget: string;
  timeline: string;
  projectDescription: string;
  goals: string;
}

const ContactUs = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const totalSteps = 5; // Updated to 5 steps
    const t = useTranslations('contactPage.buttons');

    // Initialize form data state
    const [formData, setFormData] = useState<ContactFormData>({
        fullName: "",
        email: "",
        phoneNumber: "",
        industry: "",
        otherIndustry: "",
        companyName: "",
        jobTitle: "",
        website: "",
        facebook: "",
        instagram: "",
        tiktok: "",
        linkedin: "",
        projectType: "",
        budget: "",
        timeline: "",
        projectDescription: "",
        goals: "",
    });

    const handleGoBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleGoNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleGoToMainPage = () => {
        window.location.href = '/';
    };

    const handleStepSubmit = (stepData: Partial<ContactFormData>) => {
        setFormData((prev) => {
            const updated = { ...prev, ...stepData };
            return updated;
        });
        handleGoNext();
    };

    // Handle final submission to Odoo
    const handleFinalSubmit = async (finalStepData: Partial<ContactFormData>) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Combine all form data
            const completeFormData = { ...formData, ...finalStepData };
            
            // Send to Odoo CRM
            const response = await fetch('/api/odoo/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(completeFormData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit form');
            }

            // Success - move to success step
            setIsSubmitted(true);
            setCurrentStep(5);
            
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitError(error instanceof Error ? error.message : 'An error occurred while submitting the form');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderCurrentStepForm = () => {
        const commonProps = {
            initialValues: formData,
            onSubmit: handleStepSubmit,
        };

        switch (currentStep) {
            case 1:
                return <PersonalInfoStep {...commonProps} />;
            case 2:
                return <CompanyInfoStep {...commonProps} />;
            case 3:
                return <SocialMediaStep {...commonProps} />;
            case 4:
                return (
                    <ProjectDetailsStep 
                        initialValues={formData}
                        onSubmit={handleFinalSubmit}
                        onBack={handleGoBack}
                        isSubmitting={isSubmitting}
                        submitError={submitError}
                        allFormData={formData}
                    />
                );
            case 5:
                return <SuccessStep onGoToMainPage={handleGoToMainPage} />;
            default:
                return <PersonalInfoStep {...commonProps} />;
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white min-h-screen">
            {/* Header */}
            <div className="">
                <Navigation></Navigation>
            </div>

            {/* Go Back Button */}
            <div className="px-6 py-4 animate-slide-right" style={{ opacity: 0 }}>
                <button
                    onClick={handleGoToMainPage}
                    className="flex items-center space-x-2 px-4 py-2 border border-slate-600 rounded-full hover:bg-slate-700/30
          transition-colors text-responsive-lg text-secondary-gray"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t("goBack")}</span>
                </button>
            </div>

            {/* Main Content - Responsive Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in" style={{ opacity: 0, animationDelay: "150ms" }}>
                {/* Mobile Progress Bar - Visible only on mobile/tablet */}
                <div className="lg:hidden mb-6">
                    <div className="flex justify-between items-center gap-2 px-2">
                        {Array.from({ length: totalSteps - 1 }).map((_, i) => {
                            const stepNum = i + 1;
                            return (
                                <div key={i} className="flex-1">
                                    <div
                                        className={`h-2 w-full rounded-full transition-all duration-300 ${
                                            stepNum < currentStep
                                                ? "bg-blue-500"
                                                : stepNum === currentStep
                                                ? "bg-blue-400"
                                                : "bg-slate-700"
                                        }`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-center text-sm text-slate-400 mt-3">
                        {currentStep < 5 ? `Step ${currentStep} of ${totalSteps - 1}` : 'Complete!'}
                    </p>
                </div>

                {/* Desktop/Tablet Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-8 min-h-[600px]">
                    {/* Left Side - Vertical Stepper (Desktop only) */}
                    <div className="hidden lg:block">
                        <div className="sticky top-8">
                            <StepperComponent currentStep={currentStep} />
                        </div>
                    </div>

                    {/* Right Side - Form Content */}
                    <div className="w-full max-w-2xl mx-auto lg:mx-0">
                        <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-slate-700/50">
                            {renderCurrentStepForm()}

                            {/* Action Buttons - Hide on success step and final step (handled internally) */}
                            {currentStep < totalSteps && currentStep !== 4 && (
                                <div className="mt-6 sm:mt-8">
                                    <ActionButtons
                                        handleGoBack={handleGoBack}
                                        currentStep={currentStep}
                                        totalSteps={totalSteps - 1}
                                        isSubmitting={false}
                                        formId={`step-${currentStep}-form`}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
