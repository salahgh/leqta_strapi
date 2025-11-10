import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormInput } from "@/components/ui/FormInput";
import { useTranslations } from "next-intl";

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

// Custom hook for handling form input changes
function useFormInput(name, formik) {
    return {
        name,
        value: formik.values[name],
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        error: formik.touched[name] && formik.errors[name],
    };
}

const PersonalInfoForm = ({
    initialValues = {
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
    },
    currentStep = 1,
    totalSteps = 3,
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

    const formik = useFormik({
        initialValues,
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
                {...useFormInput("fullName", formik)}
                placeholder={t('fullNamePlaceholder')}
                variant={"compact"}
                style={{
                    backgroundColor: "#141733",
                    color: "#D2D2D3",
                }}
            />

            {/* Email Field */}
            <FormInput
                label={t('email')}
                {...useFormInput("email", formik)}
                placeholder={t('emailPlaceholder')}
                variant={"compact"}
                type="email"
                style={{
                    backgroundColor: "#141733",
                    color: "#D2D2D3",
                }}
            />

            {/* Phone Number Field */}
            <FormInput
                label={t('phoneNumber')}
                {...useFormInput("phoneNumber", formik)}
                variant={"compact"}
                placeholder={t('phoneNumberPlaceholder')}
                style={{
                    backgroundColor: "#141733",
                    color: "#D2D2D3",
                }}
            />

            // Industry Dropdown
            {/* Industry Dropdown */}
            <div className="spacing-form-tight">
                <label className="form-label-base text-responsive-lg mb-0.5 md:mb-1">
                    {t('industry')}
                </label>
                <select
                    {...useFormInput("industry", formik)}
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

            // Conditional Other Industry Field
            {formik.values.industry === "other" && (
                <FormInput
                    label={t('otherIndustry')}
                    {...useFormInput("otherIndustry", formik)}
                    placeholder={t('otherIndustryPlaceholder')}
                    variant={"compact"}
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                    }}
                />
            )}

            {/* Company Name Field */}
            <FormInput
                label={t('companyName')}
                {...useFormInput("companyName", formik)}
                placeholder={t('companyNamePlaceholder')}
                variant={"compact"}
                style={{
                    backgroundColor: "#141733",
                    color: "#D2D2D3",
                }}
            />

            {/* Job Title Field */}
            <FormInput
                label={t('jobTitle')}
                {...useFormInput("jobTitle", formik)}
                placeholder={t('jobTitlePlaceholder')}
                variant={"compact"}
                style={{
                    backgroundColor: "#141733",
                    color: "#D2D2D3",
                }}
            />

            {/* Website Field */}
            <FormInput
                label={t('website')}
                {...useFormInput("website", formik)}
                placeholder={t('websitePlaceholder')}
                variant={"compact"}
                type="url"
                style={{
                    backgroundColor: "#141733",
                    color: "#D2D2D3",
                }}
            />

            {/* Social Media Links */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-300">{t('socialMediaLinks')}</h3>
                
                <FormInput
                    label={t('facebook')}
                    name="socialMedia.facebook"
                    value={formik.values.socialMedia.facebook}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.socialMedia?.facebook && formik.errors.socialMedia?.facebook}
                    placeholder={t('facebookPlaceholder')}
                    variant={"compact"}
                    type="url"
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                    }}
                />

                <FormInput
                    label={t('instagram')}
                    name="socialMedia.instagram"
                    value={formik.values.socialMedia.instagram}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.socialMedia?.instagram && formik.errors.socialMedia?.instagram}
                    placeholder={t('instagramPlaceholder')}
                    variant={"compact"}
                    type="url"
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                    }}
                />

                <FormInput
                    label={t('tiktok')}
                    name="socialMedia.tiktok"
                    value={formik.values.socialMedia.tiktok}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.socialMedia?.tiktok && formik.errors.socialMedia?.tiktok}
                    placeholder={t('tiktokPlaceholder')}
                    variant={"compact"}
                    type="url"
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                    }}
                />

                <FormInput
                    label={t('linkedin')}
                    name="socialMedia.linkedin"
                    value={formik.values.socialMedia.linkedin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.socialMedia?.linkedin && formik.errors.socialMedia?.linkedin}
                    placeholder={t('linkedinPlaceholder')}
                    variant={"compact"}
                    type="url"
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                    }}
                />
            </div>
        </form>
    );
};

export default PersonalInfoForm;
