"use client";

/**
 * ContactUs Component - Design System
 * Uses design tokens for consistent styling
 * Mobile-first responsive design with gradient utilities
 */

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";

import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormInput } from "@/components/ui/FormInput";
import { ContactInfo } from "@/components/ui/CntactInfo";

// Main Contact Form Component
interface ContactFormValues {
    fullname: string;
    email: string;
    phone: string;
    message: string;
}

const ContactForm = () => {
    const t = useTranslations('contact.form');

    const formik = useFormik<ContactFormValues>({
        initialValues: {
            fullname: "",
            email: "",
            phone: "",
            message: "",
        },
        validationSchema: Yup.object({
            fullname: Yup.string().trim().required(t('fullnameRequired')),
            email: Yup.string()
                .trim()
                .email(t('invalidEmail'))
                .required(t('emailRequired')),
            phone: Yup.string().trim().required(t('phoneRequired')),
            message: Yup.string().trim().required(t('messageRequired')),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const response = await fetch(
                    "https://jsonplaceholder.typicode.com/posts",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(values),
                    },
                );

                if (response.ok) {
                    alert(t('successMessage'));
                    resetForm();
                } else {
                    throw new Error("Failed to send message");
                }
            } catch (error) {
                alert(t('errorMessage'));
                console.error("Error:", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="bg-primary flex flex-col md:flex-row items-center justify-center section-py-md">
            <div className="animate-slide-right" style={{ opacity: 0 }}>
                <ContactInfo />
            </div>

            <div className="w-full md:w-auto p-2 sm:p-4 md:p-8 lg:p-12 mt-2 md:mt-4 animate-fade-in" style={{ opacity: 0, animationDelay: "300ms" }}>
                {/* Outer gradient border wrapper */}
                <div className="bg-gradient-contact-outer p-0.5 rounded-2xl shadow-2xl pt-2 md:pt-8 relative z-20">
                    {/* Inner content */}
                    <div className="bg-gradient-contact-inner rounded-2xl shadow-2xl w-full card-p-sm sm:card-p-md relative z-10">
                        <form onSubmit={formik.handleSubmit} className="h-full">
                            <div className="form-group p-1 sm:p-2 lg:p-3">
                                <FormInput
                                    label={t('fullname')}
                                    name="fullname"
                                    placeholder="Benyamina Sarah"
                                    value={formik.values.fullname}
                                    onChange={formik.handleChange}
                                    error={
                                        Boolean(formik.touched.fullname)
                                            ? formik.errors.fullname
                                            : ""
                                    }
                                    size="sm"
                                />

                                <FormInput
                                    label={t('email')}
                                    name="email"
                                    type="email"
                                    placeholder="sarah.benyamina@email.com"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={
                                        Boolean(formik.touched.email)
                                            ? formik.errors.email
                                            : ""
                                    }
                                    size="sm"
                                />

                                <FormInput
                                    label={t('phone')}
                                    name="phone"
                                    placeholder="05 0000 00 00"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.phone
                                            ? formik.errors.phone
                                            : ""
                                    }
                                    size="sm"
                                />

                                <FormInput
                                    label={t('message')}
                                    name="message"
                                    as="textarea"
                                    placeholder="Tell us more about what you're looking for..."
                                    value={formik.values.message}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.message
                                            ? formik.errors.message
                                            : ""
                                    }
                                    size="sm"
                                />
                            </div>
                            <div className="mt-2 sm:mt-3 md:mt-4">
                                <SubmitButton
                                    isSubmitting={formik.isSubmitting}
                                    text={t('submit')}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
