"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { useFormInput } from "@/lib/formik-helpers";
import { ConsentCheckbox } from "@/components/ui/ConsentCheckbox";
import { DataControllerInfo } from "@/components/ui/DataControllerInfo";
import { useTranslations } from "next-intl";

// Yup validation schema factory (consent error message is localized)
const createValidationSchema = (consentError: string) => Yup.object({
    firstName: Yup.string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters")
        .matches(/^[A-Za-z\s]+$/, "First name can only contain letters")
        .required("First name is required"),
    lastName: Yup.string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters")
        .matches(/^[A-Za-z\s]+$/, "Last name can only contain letters")
        .required("Last name is required"),
    companyName: Yup.string()
        .min(2, "Company name must be at least 2 characters")
        .max(100, "Company name must be less than 100 characters")
        .required("Company name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email",
        )
        .required("Email is required"),
    phone: Yup.string()
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
    service: Yup.string().required("Please select a service"),
    message: Yup.string()
        .min(10, "Message must be at least 10 characters")
        .max(500, "Message must not exceed 500 characters")
        .required("Message is required"),
    consentGiven: Yup.boolean()
        .oneOf([true], consentError)
        .required(consentError),
});

// useFormInput hook moved to @/lib/formik-helpers.ts

function PartnershipFormPage() {
    const params = useParams();
    const locale = (params?.locale as string) || "en";
    const tConsent = useTranslations("formConsent");

    const serviceOptions = [
        "Web Development",
        "Mobile App Development",
        "UI/UX Design",
        "Digital Marketing",
        "Content Creation",
        "Brand Strategy",
        "Other",
    ];

    const initialValues = {
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        phone: "",
        service: "",
        message: "",
        consentGiven: false,
    };

    const validationSchema = createValidationSchema(tConsent("validation.consentRequired"));

    const onSubmit = (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        console.log("Form submitted with values:", values);
        // Handle form submission logic here
        setSubmitting(false);
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <div className="min-h-screen bg-neutral-900 section-py-md section-px">
            <Navigation />
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="mb-8 mt-32 animate-slide-down" style={{ opacity: 0 }}>
                        <span className="badge-lg badge-outline text-accent-blue border-accent-blue">
                            Become a Partner
                        </span>
                    </div>

                    <h1 className="text-white mb-2 animate-slide-up text-display-lg md:text-display-xl lg:text-display-2xl" style={{ opacity: 0, animationDelay: "150ms" }}>
                        Partnership Form
                    </h1>

                    <p
                        className="text-secondary-gray animate-fade-in text-body-lg md:text-body-xl max-w-4xl mx-auto"
                        style={{ opacity: 0, animationDelay: "300ms" }}
                    >
                        Want to collaborate with LEQTA? Let's build something
                        unforgettable together. Fill out the form below and
                        we'll get back to you shortly.
                    </p>
                </div>

                {/* Form */}
                <div className="form-group animate-fade-in" style={{ opacity: 0, animationDelay: "450ms" }}>
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 grid-gap-sm">
                        <FormInput
                            label="First Name"
                            {...useFormInput("firstName", formik)}
                            placeholder="Sarah"
                            size="md"
                            className="bg-form-bg text-form-text"
                        />
                        <FormInput
                            label="Last Name"
                            {...useFormInput("lastName", formik)}
                            placeholder="e.g. Benyamina"
                            size="md"
                            className="bg-form-bg text-form-text"
                        />
                    </div>

                    {/* Company Name */}
                    <FormInput
                        label="Company Name"
                        {...useFormInput("companyName", formik)}
                        placeholder="e.g. BrightHive"
                        size="md"
                        className="bg-form-bg text-form-text"
                    />

                    {/* Email Field */}
                    <FormInput
                        label="Email Address"
                        {...useFormInput("email", formik)}
                        type="email"
                        placeholder="e.g. sarah.benyamina@email.com"
                        size="md"
                        className="bg-form-bg text-form-text"
                    />

                    {/* Phone Field */}
                    <FormInput
                        label="Phone Number"
                        {...useFormInput("phone", formik)}
                        type="tel"
                        placeholder="e.g. +213 555 123 456"
                        size="md"
                        className="bg-form-bg text-form-text"
                    />

                    {/* Message Field */}
                    <FormInput
                        label="Message"
                        {...useFormInput("message", formik)}
                        as="textarea"
                        placeholder="Tell us more about what you're looking for..."
                        size="md"
                        className="bg-form-bg text-form-text w-full min-h-[200px]"
                    />

                    {/* Character Count for Message */}
                    {formik.values.message && (
                        <div className="text-right text-body-sm text-secondary-gray -mt-4">
                            {formik.values.message.length}/500 characters
                        </div>
                    )}

                    {/* Law 18-07 Compliance Section */}
                    <div className="mt-6 space-y-4">
                        {/* Data Controller Info */}
                        <DataControllerInfo className="bg-neutral-800 border-neutral-700" />

                        {/* Consent Checkbox */}
                        <ConsentCheckbox
                            checked={formik.values.consentGiven}
                            onChange={(checked) => formik.setFieldValue("consentGiven", checked)}
                            error={formik.touched.consentGiven ? formik.errors.consentGiven : undefined}
                            className="text-white [&_span]:text-neutral-300 [&_a]:text-primary-light"
                        />
                    </div>

                    <div className="h-16 flex justify-end mt-6">
                        <Button
                            onClick={formik.handleSubmit}
                            disabled={formik.isSubmitting}
                            leftIcon={null}
                            rightIcon={null}
                            size="lg"
                            className="w-full sm:w-auto min-w-[200px]"
                        >
                            {formik.isSubmitting
                                ? "Submitting..."
                                : "Submit Application"}
                        </Button>
                    </div>
                </div>
            </div>
            <Footer locale={locale} />
        </div>
    );
}

export default PartnershipFormPage;
