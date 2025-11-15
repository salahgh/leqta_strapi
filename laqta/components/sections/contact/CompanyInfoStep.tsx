import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormInput } from "@/components/ui/FormInput";
import { useTranslations } from "next-intl";
import { useFormInput } from "@/lib/formik-helpers";

interface CompanyInfoFormValues {
    industry: string;
    otherIndustry: string;
    companyName: string;
    jobTitle: string;
    website: string;
}

const validationSchema = Yup.object({
    industry: Yup.string().required("Industry is required"),
    otherIndustry: Yup.string().when("industry", {
        is: "other",
        then: (schema) => schema.required("Please specify your industry"),
        otherwise: (schema) => schema.notRequired(),
    }),
    companyName: Yup.string()
        .min(2, "Company name must be at least 2 characters")
        .max(100, "Company name must be less than 100 characters")
        .required("Company name is required"),
    jobTitle: Yup.string()
        .min(2, "Job title must be at least 2 characters")
        .max(100, "Job title must be less than 100 characters")
        .required("Job title is required"),
    website: Yup.string().url("Please enter a valid URL").nullable(),
});

const CompanyInfoStep = ({ initialValues, onSubmit }: { initialValues?: Partial<CompanyInfoFormValues>; onSubmit: (values: CompanyInfoFormValues) => void }) => {
    const t = useTranslations('contactPage.form');
    
    const industryOptions = [
        { value: "", label: t('selectIndustry') },
        { value: "technology", label: t('industries.technology') },
        { value: "healthcare", label: t('industries.healthcare') },
        { value: "finance", label: t('industries.finance') },
        { value: "education", label: t('industries.education') },
        { value: "retail", label: t('industries.retail') },
        { value: "manufacturing", label: t('industries.manufacturing') },
        { value: "consulting", label: t('industries.consulting') },
        { value: "media", label: t('industries.media') },
        { value: "nonprofit", label: t('industries.nonprofit') },
        { value: "government", label: t('industries.government') },
        { value: "other", label: t('industries.other') },
    ];
    
    const formik = useFormik<CompanyInfoFormValues>({
        initialValues: {
            industry: "",
            otherIndustry: "",
            companyName: "",
            jobTitle: "",
            website: "",
            ...initialValues
        },
        validationSchema,
        onSubmit,
    });

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Company & Industry Information</h2>
                <p className="text-slate-300">Tell us about your company and role.</p>
            </div>
            
            <form onSubmit={formik.handleSubmit} className="space-y-4" id="step-2-form">
                <div className="spacing-form-tight">
                    <label className="form-label-base text-responsive-lg mb-0.5 md:mb-1">
                        {t('industry')}
                    </label>
                    <select
                        {...useFormInput<CompanyInfoFormValues>("industry", formik)}
                        className="form-input-base text-responsive-lg padding-responsive-sm rounded-full w-full"
                        style={{
                            backgroundColor: "#141733",
                            color: "#D2D2D3",
                        }}
                    >
                        {industryOptions.map((option) => (
                            <option key={option.value} value={option.value} style={{ backgroundColor: "#141733", color: "#D2D2D3" }}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {formik.touched.industry && formik.errors.industry && (
                        <div className="text-red-400 mt-0.5 md:mt-1">{formik.errors.industry}</div>
                    )}
                </div>

                {formik.values.industry === "other" && (
                    <FormInput
                        label={t('otherIndustry')}
                        {...useFormInput<CompanyInfoFormValues>("otherIndustry", formik)}
                        placeholder={t('otherIndustryPlaceholder')}
                        variant={"compact"}
                        style={{
                            backgroundColor: "#141733",
                            color: "#D2D2D3",
                        }}
                    />
                )}

                <FormInput
                    label={t('companyName')}
                    {...useFormInput<CompanyInfoFormValues>("companyName", formik)}
                    placeholder={t('companyNamePlaceholder')}
                    variant={"compact"}
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                    }}
                />

                <FormInput
                    label={t('jobTitle')}
                    {...useFormInput<CompanyInfoFormValues>("jobTitle", formik)}
                    placeholder={t('jobTitlePlaceholder')}
                    variant={"compact"}
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                    }}
                />

                <FormInput
                    label={t('website')}
                    {...useFormInput<CompanyInfoFormValues>("website", formik)}
                    placeholder={t('websitePlaceholder')}
                    variant={"compact"}
                    type="url"
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                    }}
                />
            </form>
        </div>
    );
};

export default CompanyInfoStep;