"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormInput } from "@/components/ui/FormInput";
import { useFormInput } from "@/lib/formik-helpers";
import { ConsentCheckbox } from "@/components/ui/ConsentCheckbox";
import { DataControllerInfo } from "@/components/ui/DataControllerInfo";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { useTranslations } from "next-intl";
import { CheckCircle, AlertCircle } from "lucide-react";
import { partnerRequestApi, partnershipTypesApi, PartnershipType } from "@/lib/strapi";

const createValidationSchema = (t: (key: string) => string) =>
    Yup.object({
        firstName: Yup.string()
            .min(2, t("firstNameMin"))
            .max(50, t("firstNameMax"))
            .matches(/^[\p{L}\s]+$/u, t("firstNameInvalid"))
            .required(t("firstNameRequired")),
        lastName: Yup.string()
            .min(2, t("lastNameMin"))
            .max(50, t("lastNameMax"))
            .matches(/^[\p{L}\s]+$/u, t("lastNameInvalid"))
            .required(t("lastNameRequired")),
        companyName: Yup.string()
            .min(2, t("companyNameMin"))
            .max(100, t("companyNameMax"))
            .required(t("companyNameRequired")),
        email: Yup.string()
            .email(t("emailInvalid"))
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                t("emailInvalid"),
            )
            .required(t("emailRequired")),
        phone: Yup.string()
            .matches(/^[+]?[\d\s\-()]+$/, t("phoneInvalid"))
            .test(
                "phone-length",
                t("phoneMin"),
                (value) => {
                    if (!value) return false;
                    return value.replace(/\D/g, "").length >= 10;
                },
            )
            .required(t("phoneRequired")),
        partnershipType: Yup.string().required(t("partnershipTypeRequired")),
        message: Yup.string()
            .min(10, t("messageMin"))
            .max(500, t("messageMax"))
            .required(t("messageRequired")),
        consentGiven: Yup.boolean()
            .oneOf([true], t("consentRequired"))
            .required(t("consentRequired")),
    });

interface BecomePartnerFormProps {
    locale: string;
}

export function BecomePartnerForm({ locale }: BecomePartnerFormProps) {
    const t = useTranslations("partnerForm");
    const tValidation = useTranslations("partnerForm.validation");

    const [partnershipTypes, setPartnershipTypes] = useState<PartnershipType[]>([]);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Fetch partnership types from Strapi
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await partnershipTypesApi.getAll({ locale });
                setPartnershipTypes(response.data || []);
            } catch {
                console.error("Failed to fetch partnership types");
            }
        };
        fetchTypes();
    }, [locale]);

    const initialValues = {
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        phone: "",
        partnershipType: "",
        message: "",
        consentGiven: false,
    };

    const validationSchema = createValidationSchema((key: string) => tValidation(key));

    const onSubmit = async (
        values: typeof initialValues,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
    ) => {
        setSubmitError(null);
        try {
            await partnerRequestApi.submit({
                ...values,
                locale,
            });
            setSubmitSuccess(true);
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : t("error.generic"),
            );
        } finally {
            setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    // Success screen
    if (submitSuccess) {
        return (
            <div className="max-w-2xl mx-auto text-center section-py-md section-px">
                <div className="animate-fade-in" style={{ opacity: 0 }}>
                    <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                    <h1 className="text-white text-display-lg md:text-display-xl mb-4">
                        {t("success.title")}
                    </h1>
                    <p className="text-secondary-gray text-body-lg md:text-body-xl mb-8">
                        {t("success.description")}
                    </p>
                    <a
                        href={`/${locale}/partners`}
                        className="inline-flex items-center text-accent-blue hover:text-accent-blue/80 transition-colors text-body-lg"
                    >
                        {t("success.backToPartners")}
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto relative z-10 section-py-md section-px">
            {/* Header */}
            <div className="text-center mb-12">
                <div
                    className="mb-8 mt-32 animate-slide-down"
                    style={{ opacity: 0 }}
                >
                    <span className="badge-lg badge-outline text-accent-blue border-accent-blue">
                        {t("badge")}
                    </span>
                </div>

                <h1
                    className="text-white mb-2 animate-slide-up text-display-lg md:text-display-xl lg:text-display-2xl"
                    style={{ opacity: 0, animationDelay: "150ms" }}
                >
                    {t("title")}
                </h1>

                <p
                    className="text-secondary-gray animate-fade-in text-body-lg md:text-body-xl max-w-4xl mx-auto"
                    style={{ opacity: 0, animationDelay: "300ms" }}
                >
                    {t("description")}
                </p>
            </div>

            {/* Error Banner */}
            {submitError && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-300 text-body-sm">{submitError}</p>
                </div>
            )}

            {/* Form */}
            <form
                onSubmit={formik.handleSubmit}
                className="form-group animate-fade-in"
                style={{ opacity: 0, animationDelay: "450ms" }}
            >
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 grid-gap-sm">
                    <FormInput
                        label={t("fields.firstName")}
                        {...useFormInput("firstName", formik)}
                        placeholder={t("fields.firstNamePlaceholder")}
                        size="md"
                        className="bg-form-bg text-form-text"
                    />
                    <FormInput
                        label={t("fields.lastName")}
                        {...useFormInput("lastName", formik)}
                        placeholder={t("fields.lastNamePlaceholder")}
                        size="md"
                        className="bg-form-bg text-form-text"
                    />
                </div>

                {/* Company Name */}
                <FormInput
                    label={t("fields.companyName")}
                    {...useFormInput("companyName", formik)}
                    placeholder={t("fields.companyNamePlaceholder")}
                    size="md"
                    className="bg-form-bg text-form-text"
                />

                {/* Email */}
                <FormInput
                    label={t("fields.email")}
                    {...useFormInput("email", formik)}
                    type="email"
                    placeholder={t("fields.emailPlaceholder")}
                    size="md"
                    className="bg-form-bg text-form-text"
                />

                {/* Phone */}
                <FormInput
                    label={t("fields.phone")}
                    {...useFormInput("phone", formik)}
                    type="tel"
                    placeholder={t("fields.phonePlaceholder")}
                    size="md"
                    className="bg-form-bg text-form-text"
                />

                {/* Partnership Type Select */}
                <div className="flex flex-col gap-1">
                    <label className="text-white text-body-sm font-medium">
                        {t("fields.partnershipType")}
                    </label>
                    <select
                        name="partnershipType"
                        value={formik.values.partnershipType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full rounded-xl border border-white/10 bg-form-bg text-form-text px-4 py-3 text-body-md focus:outline-none focus:border-accent-blue/50 transition-colors"
                    >
                        <option value="">{t("fields.partnershipTypePlaceholder")}</option>
                        {partnershipTypes.map((type) => (
                            <option key={type.id} value={type.name}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                    {formik.touched.partnershipType && formik.errors.partnershipType && (
                        <p className="text-red-400 text-body-sm mt-1">
                            {formik.errors.partnershipType}
                        </p>
                    )}
                </div>

                {/* Message */}
                <FormInput
                    label={t("fields.message")}
                    {...useFormInput("message", formik)}
                    as="textarea"
                    placeholder={t("fields.messagePlaceholder")}
                    size="md"
                    className="bg-form-bg text-form-text w-full min-h-[200px]"
                />

                {/* Character Counter */}
                {formik.values.message && (
                    <div className="text-right text-body-sm text-secondary-gray -mt-4">
                        {formik.values.message.length}/500 {t("fields.characters")}
                    </div>
                )}

                {/* Law 18-07 Compliance */}
                <div className="mt-6 space-y-4">
                    <DataControllerInfo className="bg-neutral-800 border-neutral-700" />
                    <ConsentCheckbox
                        checked={formik.values.consentGiven}
                        onChange={(checked) =>
                            formik.setFieldValue("consentGiven", checked)
                        }
                        error={
                            formik.touched.consentGiven
                                ? formik.errors.consentGiven
                                : undefined
                        }
                        className="text-white [&_span]:text-neutral-300 [&_a]:text-primary-light"
                    />
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <SubmitButton
                        isSubmitting={formik.isSubmitting}
                        text={
                            formik.isSubmitting
                                ? t("submitting")
                                : t("submitButton")
                        }
                    />
                </div>
            </form>
        </div>
    );
}
