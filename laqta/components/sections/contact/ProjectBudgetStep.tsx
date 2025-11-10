import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";

const validationSchema = Yup.object({
    projectType: Yup.string().required("Project type is required"),
    budget: Yup.string().required("Budget range is required"),
    timeline: Yup.string().required("Timeline is required"),
});

function useFormInput(name, formik) {
    return {
        name,
        value: formik.values[name],
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        error: formik.touched[name] && formik.errors[name],
    };
}

const ProjectBudgetStep = ({ initialValues, onSubmit }) => {
    const t = useTranslations('contactPage.form');
    
    const projectTypeOptions = [
        { value: "", label: t('selectProjectType') },
        { value: "web-development", label: t('projectTypes.webDevelopment') },
        { value: "mobile-app", label: t('projectTypes.mobileApp') },
        { value: "ecommerce", label: t('projectTypes.ecommerce') },
        { value: "digital-marketing", label: t('projectTypes.digitalMarketing') },
        { value: "branding-design", label: t('projectTypes.brandingDesign') },
        { value: "seo-optimization", label: t('projectTypes.seoOptimization') },
        { value: "other", label: t('projectTypes.other') },
    ];

    const budgetOptions = [
        { value: "", label: t('selectBudget') },
        { value: "under-5k", label: t('budgetRanges.under5k') },
        { value: "5k-10k", label: t('budgetRanges.5kTo10k') },
        { value: "10k-25k", label: t('budgetRanges.10kTo25k') },
        { value: "25k-50k", label: t('budgetRanges.25kTo50k') },
        { value: "50k-100k", label: t('budgetRanges.50kTo100k') },
        { value: "over-100k", label: t('budgetRanges.over100k') },
    ];

    const timelineOptions = [
        { value: "", label: t('selectTimeline') },
        { value: "asap", label: t('timelines.asap') },
        { value: "1-2-weeks", label: t('timelines.oneToTwoWeeks') },
        { value: "1-month", label: t('timelines.oneMonth') },
        { value: "2-3-months", label: t('timelines.twoToThreeMonths') },
        { value: "3-6-months", label: t('timelines.threeToSixMonths') },
        { value: "6-plus-months", label: t('timelines.sixPlusMonths') },
        { value: "flexible", label: t('timelines.flexible') },
    ];
    
    const formik = useFormik({
        initialValues: {
            projectType: "",
            budget: "",
            timeline: "",
            ...initialValues
        },
        validationSchema,
        onSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4" id="step-3-form">
            <div className="spacing-form-tight">
                <label className="form-label-base text-responsive-lg mb-0.5 md:mb-1">
                    {t('projectType')}
                </label>
                <select
                    {...useFormInput("projectType", formik)}
                    className="form-input-base text-responsive-lg padding-responsive-sm rounded-full w-full"
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                    }}
                >
                    {projectTypeOptions.map((option) => (
                        <option key={option.value} value={option.value} style={{ backgroundColor: "#141733", color: "#D2D2D3" }}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {formik.touched.projectType && formik.errors.projectType && (
                    <div className="text-red-400 mt-0.5 md:mt-1">{formik.errors.projectType}</div>
                )}
            </div>

            <div className="spacing-form-tight">
                <label className="form-label-base text-responsive-lg mb-0.5 md:mb-1">
                    {t('budget')}
                </label>
                <select
                    {...useFormInput("budget", formik)}
                    className="form-input-base text-responsive-lg padding-responsive-sm rounded-full w-full"
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                    }}
                >
                    {budgetOptions.map((option) => (
                        <option key={option.value} value={option.value} style={{ backgroundColor: "#141733", color: "#D2D2D3" }}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {formik.touched.budget && formik.errors.budget && (
                    <div className="text-red-400 mt-0.5 md:mt-1">{formik.errors.budget}</div>
                )}
            </div>

            <div className="spacing-form-tight">
                <label className="form-label-base text-responsive-lg mb-0.5 md:mb-1">
                    {t('timeline')}
                </label>
                <select
                    {...useFormInput("timeline", formik)}
                    className="form-input-base text-responsive-lg padding-responsive-sm rounded-full w-full"
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                    }}
                >
                    {timelineOptions.map((option) => (
                        <option key={option.value} value={option.value} style={{ backgroundColor: "#141733", color: "#D2D2D3" }}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {formik.touched.timeline && formik.errors.timeline && (
                    <div className="text-red-400 mt-0.5 md:mt-1">{formik.errors.timeline}</div>
                )}
            </div>
        </form>
    );
};

export default ProjectBudgetStep;