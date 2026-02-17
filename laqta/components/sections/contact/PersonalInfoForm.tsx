import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormInput } from "@/components/ui/FormInput";
import { useTranslations } from "next-intl";
import { useFormInput } from "@/lib/formik-helpers";

interface SocialMedia {
    facebook: string;
    instagram: string;
    tiktok: string;
    linkedin: string;
}

interface PersonalInfoFormValues {
    fullName: string;
    email: string;
    phoneNumber: string;
    industry: string;
    otherIndustry: string;
    companyName: string;
    jobTitle: string;
    website: string;
    socialMedia: SocialMedia;
}

// Yup validation schema
const validationSchema = Yup.object({
    fullName: Yup.string()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name must be less than 100 characters")
        .matches(/^[A-Za-z\s]+$/, "Full name can only contain letters")
        .required("Full name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email",
        )
        .required("Email is required"),
    phoneNumber: Yup.string()
        .matches(/^[+]?[\d\s\-\(\)]+$/, "Invalid phone number format")
        .test(
            "phone-length",
            "Phone number must be at least 10 digits",
            (value) => {
                if (!value) return false;
                return value.replace(/\D/g, "").length >= 10;
            },
        )
        .required("Phone number is required"),
    industry: Yup.string()
        .required("Industry is required"),
    otherIndustry: Yup.string()
        .when("industry", {
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
    website: Yup.string()
        .url("Please enter a valid URL")
        .nullable(),
    socialMedia: Yup.object({
        facebook: Yup.string().url("Please enter a valid Facebook URL").nullable(),
        instagram: Yup.string().url("Please enter a valid Instagram URL").nullable(),
        tiktok: Yup.string().url("Please enter a valid TikTok URL").nullable(),
        linkedin: Yup.string().url("Please enter a valid LinkedIn URL").nullable(),
    }),
});

const PersonalInfoForm = ({
    initialValues,
    currentStep = 1,
    totalSteps = 3,
}: {
    initialValues?: Partial<PersonalInfoFormValues>;
    currentStep?: number;
    totalSteps?: number;
}) => {
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

    const onSubmit = (values, formikBag) => {
        // Handle form submission logic here
        formikBag.setSubmitting(false);
    };

    const formik = useFormik<PersonalInfoFormValues>({
        initialValues: {
            fullName: "",
            email: "",
            phoneNumber: "",
            industry: "",
            otherIndustry: "",
            companyName: "",
            jobTitle: "",
            website: "",
            socialMedia: {
                facebook: "",
                instagram: "",
                tiktok: "",
                linkedin: "",
            },
            ...initialValues
        },
        validationSchema,
        onSubmit: (values, formikBag) => {
            if (onSubmit) {
                onSubmit(values, formikBag);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <FormInput
                label={t('fullName')}
                {...useFormInput<PersonalInfoFormValues>("fullName", formik)}
                placeholder={t('fullNamePlaceholder')}
                size="sm"
                className="bg-form-bg text-form-text"
            />

            {/* Email Field */}
            <FormInput
                label={t('email')}
                {...useFormInput<PersonalInfoFormValues>("email", formik)}
                placeholder={t('emailPlaceholder')}
                size="sm"
                type="email"
                className="bg-form-bg text-form-text"
            />

            {/* Phone Number Field */}
            <FormInput
                label={t('phoneNumber')}
                {...useFormInput<PersonalInfoFormValues>("phoneNumber", formik)}
                size="sm"
                placeholder={t('phoneNumberPlaceholder')}
                className="bg-form-bg text-form-text"
            />

            {/* Industry Dropdown */}
            <div className="spacing-form-tight">
                <label className="form-label text-body-md sm:text-body-lg">
                    {t('industry')}
                </label>
                <select
                    {...useFormInput<PersonalInfoFormValues>("industry", formik)}
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

            {/* Conditional Other Industry Field */}
            {formik.values.industry === "other" && (
                <FormInput
                    label={t('otherIndustry')}
                    {...useFormInput<PersonalInfoFormValues>("otherIndustry", formik)}
                    placeholder={t('otherIndustryPlaceholder')}
                    size="sm"
                    className="bg-form-bg text-form-text"
                />
            )}

            {/* Company Name Field */}
            <FormInput
                label={t('companyName')}
                {...useFormInput<PersonalInfoFormValues>("companyName", formik)}
                placeholder={t('companyNamePlaceholder')}
                size="sm"
                className="bg-form-bg text-form-text"
            />

            {/* Job Title Field */}
            <FormInput
                label={t('jobTitle')}
                {...useFormInput<PersonalInfoFormValues>("jobTitle", formik)}
                placeholder={t('jobTitlePlaceholder')}
                size="sm"
                className="bg-form-bg text-form-text"
            />

            {/* Website Field */}
            <FormInput
                label={t('website')}
                {...useFormInput<PersonalInfoFormValues>("website", formik)}
                placeholder={t('websitePlaceholder')}
                size="sm"
                type="text"
                className="bg-form-bg text-form-text"
            />

            {/* Social Media Links */}
            <div className="stack-gap-sm">
                <h3 className="text-body-sm font-medium text-secondary-gray">{t('socialMediaLinks')}</h3>

                <FormInput
                    label={t('facebook')}
                    name="socialMedia.facebook"
                    value={formik.values.socialMedia.facebook}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.socialMedia?.facebook && formik.errors.socialMedia?.facebook ? String(formik.errors.socialMedia.facebook) : undefined}
                    placeholder={t('facebookPlaceholder')}
                    size="sm"
                    type="text"
                    className="bg-form-bg text-form-text"
                />

                <FormInput
                    label={t('instagram')}
                    name="socialMedia.instagram"
                    value={formik.values.socialMedia.instagram}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.socialMedia?.instagram && formik.errors.socialMedia?.instagram ? String(formik.errors.socialMedia.instagram) : undefined}
                    placeholder={t('instagramPlaceholder')}
                    size="sm"
                    type="text"
                    className="bg-form-bg text-form-text"
                />

                <FormInput
                    label={t('tiktok')}
                    name="socialMedia.tiktok"
                    value={formik.values.socialMedia.tiktok}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.socialMedia?.tiktok && formik.errors.socialMedia?.tiktok ? String(formik.errors.socialMedia.tiktok) : undefined}
                    placeholder={t('tiktokPlaceholder')}
                    size="sm"
                    type="text"
                    className="bg-form-bg text-form-text"
                />

                <FormInput
                    label={t('linkedin')}
                    name="socialMedia.linkedin"
                    value={formik.values.socialMedia.linkedin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.socialMedia?.linkedin && formik.errors.socialMedia?.linkedin ? String(formik.errors.socialMedia.linkedin) : undefined}
                    placeholder={t('linkedinPlaceholder')}
                    size="sm"
                    type="text"
                    className="bg-form-bg text-form-text"
                />
            </div>
        </form>
    );
};

export default PersonalInfoForm;
