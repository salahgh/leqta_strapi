"use client";

import React from "react";
import {
    User,
    Building,
    DollarSign,
    FileText,
    CheckCircle,
    Share,
    LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface StepperComponentProps {
    currentStep?: number;
}

interface Step {
    id: number;
    icon: LucideIcon;
    title: string;
    description: string;
    completed: boolean;
    active: boolean;
}

export const Stepper: React.FC<StepperComponentProps> = ({
    currentStep = 1,
}) => {
    const t = useTranslations("contactPage.stepper");

    const steps: Step[] = [
        {
            id: 1,
            icon: User,
            title: t("personalInfo"),
            description: t("personalInfoDescription"),
            completed: currentStep > 1,
            active: currentStep === 1,
        },
        {
            id: 2,
            icon: Building,
            title: t("companyInfo"),
            description: t("companyInfoDescription"),
            completed: currentStep > 2,
            active: currentStep === 2,
        },
        {
            id: 3,
            icon: Share,
            title: t("socialMedia"),
            description: t("socialMediaDescription"),
            completed: currentStep > 3,
            active: currentStep === 3,
        },
        {
            id: 4,
            icon: FileText,
            title: t("reviewSubmit"),
            description: t("reviewSubmitDescription"),
            completed: currentStep > 4,
            active: currentStep === 4,
        },
    ];

    return (
        <div className="w-full max-w-md mx-auto px-4 py-6">
            <div className="relative">
                {/* Vertical Progress Line - centered through circles, stops at last step */}
                {/* Height calculation: (steps - 1) * gap(32px from space-y-8) = 3 * 32 = 96px */}
                <div
                    className="absolute left-[23px] rtl:right-[23px] rtl:left-auto top-6 w-0.5 bg-slate-700"
                    style={{ height: `${(steps.length - 1) * 32}px` }}
                >
                    <div
                        className="w-full bg-gradient-to-b from-blue-500 to-blue-400 transition-all duration-700 ease-in-out"
                        style={{
                            height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                        }}
                    />
                </div>

                {/* Steps */}
                <div className="space-y-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.id}
                                className="flex items-start relative z-10"
                            >
                                {/* Step Circle */}
                                <div
                                    className={`
                                        w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out transform
                                        ${
                                            step.completed
                                                ? "bg-gradient-to-br from-green-500 to-green-400 text-white shadow-lg shadow-green-500/30 scale-110"
                                                : step.active
                                                  ? "bg-gradient-to-br from-blue-500 to-blue-400 text-white shadow-lg shadow-blue-500/30 scale-110 animate-pulse"
                                                  : "bg-slate-700/50 text-slate-400 backdrop-blur-sm border border-slate-600"
                                        }
                                    `}
                                >
                                    {step.completed ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                </div>

                                {/* Step Content - vertically centered with circle */}
                                <div className="ms-4 flex-1 min-w-0 pt-1">
                                    <div
                                        className={`
                                            transition-all duration-300 ease-in-out
                                            ${
                                                step.active
                                                    ? "transform rtl:-translate-x-1 ltr:translate-x-1"
                                                    : ""
                                            }
                                        `}
                                    >
                                        <h3
                                            className={`
                                                text-lg font-semibold transition-all duration-300 leading-tight
                                                ${
                                                    step.active ||
                                                    step.completed
                                                        ? "text-white"
                                                        : "text-slate-400"
                                                }
                                            `}
                                        >
                                            {step.title}
                                        </h3>
                                        <p
                                            className={`
                                                text-sm mt-1 transition-all duration-300 leading-relaxed
                                                ${
                                                    step.active ||
                                                    step.completed
                                                        ? "text-slate-300"
                                                        : "text-slate-500"
                                                }
                                            `}
                                        >
                                            {step.description}
                                        </p>

                                        {/* Progress indicator for active step */}
                                        {step.active && (
                                            <div className="mt-2 w-8 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full animate-pulse" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
