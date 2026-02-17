"use client";

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

const CompanyInfoStep = ({ initialValues, onSubmit }: { initialValues?: Partial<CompanyInfoFormValues>; onSubmit: (values: CompanyInfoFormValues) => void }) => {
    const t = useTranslations('contactPage.form');
    const tValidation = useTranslations('contactPage.form.validation');

    const validationSchema = Yup.object({
        industry: Yup.string().required(tValidation('industryRequired')),
        otherIndustry: Yup.string().when("industry", {
            is: "other",
            then: (schema) => schema.required(tValidation('otherIndustryRequired')),
            otherwise: (schema) => schema.notRequired(),
        }),
        companyName: Yup.string()
            .min(2, tValidation('minLength', { min: 2 }))
            .max(100, tValidation('maxLength', { max: 100 }))
            .required(tValidation('companyNameRequired')),
        jobTitle: Yup.string()
            .min(2, tValidation('minLength', { min: 2 }))
            .max(100, tValidation('maxLength', { max: 100 }))
            .required(tValidation('jobTitleRequired')),
        website: Yup.string().matches(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-.~:/?#[\]@!$&'()*+,;=%]*)?$/, { message: tValidation('url'), excludeEmptyString: true }).nullable(),
    });
    
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
            <div className="mb-4 sm:mb-6">
                <h2 className="text-body-lg sm:text-body-xl md:text-display-xs font-bold text-white mb-1 sm:mb-2">{t('companyInfoTitle')}</h2>
                <p className="text-secondary-gray text-body-sm sm:text-body-md">{t('companyInfoDescription')}</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="form-group" id="step-2-form">
                <div className="spacing-form-tight">
                    <label className="form-label text-body-md sm:text-body-lg">
                        {t('industry')}
                    </label>
                    <select
                        {...useFormInput<CompanyInfoFormValues>("industry", formik)}
                        className="input-sm text-body-md sm:text-body-lg rounded-full w-full bg-form-bg text-form-text"
                    >
                        {industryOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-form-bg text-form-text">
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {formik.touched.industry && formik.errors.industry && (
                        <div className="form-error">{formik.errors.industry}</div>
                    )}
                </div>

                {formik.values.industry === "other" && (
                    <FormInput
                        label={t('otherIndustry')}
                        {...useFormInput<CompanyInfoFormValues>("otherIndustry", formik)}
                        placeholder={t('otherIndustryPlaceholder')}
                        size="sm"
                        className="bg-form-bg text-form-text"
                    />
                )}

                <FormInput
                    label={t('companyName')}
                    {...useFormInput<CompanyInfoFormValues>("companyName", formik)}
                    placeholder={t('companyNamePlaceholder')}
                    size="sm"
                    className="bg-form-bg text-form-text"
                />

                <FormInput
                    label={t('jobTitle')}
                    {...useFormInput<CompanyInfoFormValues>("jobTitle", formik)}
                    placeholder={t('jobTitlePlaceholder')}
                    size="sm"
                    className="bg-form-bg text-form-text"
                />

                <FormInput
                    label={t('website')}
                    {...useFormInput<CompanyInfoFormValues>("website", formik)}
                    placeholder={t('websitePlaceholder')}
                    size="sm"
                    type="url"
                    className="bg-form-bg text-form-text"
                />
            </form>
        </div>
    );
};

export default CompanyInfoStep;