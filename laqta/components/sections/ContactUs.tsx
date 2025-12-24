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

// Contact Form Props
interface ContactFormProps {
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
}

// Form Values
interface ContactFormValues {
    fullname: string;
    email: string;
    phone: string;
    message: string;
}

const ContactForm = ({ contactEmail, contactPhone, address }: ContactFormProps) => {
    const t = useTranslations("contact.form");

    const formik = useFormik<ContactFormValues>({
        initialValues: {
            fullname: "",
            email: "",
            phone: "",
            message: "",
        },
        validationSchema: Yup.object({
            fullname: Yup.string().trim().required(t("fullnameRequired")),
            email: Yup.string()
                .trim()
                .email(t("invalidEmail"))
                .required(t("emailRequired")),
            phone: Yup.string().trim().required(t("phoneRequired")),
            message: Yup.string().trim().required(t("messageRequired")),
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
                    alert(t("successMessage"));
                    resetForm();
                } else {
                    throw new Error("Failed to send message");
                }
            } catch (error) {
                alert(t("errorMessage"));
                console.error("Error:", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="bg-primary flex md:flex-row gap-16  section-py-md px-16 py-32 pb-44">
            <div className="animate-slide-right flex-1" style={{ opacity: 0 }}>
                <ContactInfo
                    contactEmail={contactEmail}
                    contactPhone={contactPhone}
                    address={address}
                />
            </div>

            <div
                className="flex-1 md:w-auto  animate-fade-in"
                style={{ opacity: 0, animationDelay: "300ms" }}
            >
                {/* Outer gradient border wrapper */}
                <div className=" bg-primary p-0.5 rounded-2xl shadow-2xl pt-2 md:pt-8 relative z-20">
                    {/* Inner content */}
                    <div className=" rounded-2xl shadow-2xl w-full card-p-sm sm:card-p-md relative z-10">
                        <form onSubmit={formik.handleSubmit} className="h-full">
                            <div className="form-group p-1 sm:p-2 lg:p-3">
                                <FormInput
                                    label={t("fullname")}
                                    name="fullname"
                                    placeholder={t("fullnamePlaceholder")}
                                    value={formik.values.fullname}
                                    onChange={formik.handleChange}
                                    error={
                                        Boolean(formik.touched.fullname)
                                            ? formik.errors.fullname
                                            : ""
                                    }
                                    size="lg"
                                />

                                <FormInput
                                    label={t("email")}
                                    name="email"
                                    type="email"
                                    placeholder={t("emailPlaceholder")}
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={
                                        Boolean(formik.touched.email)
                                            ? formik.errors.email
                                            : ""
                                    }
                                    size="lg"
                                />

                                <FormInput
                                    label={t("phone")}
                                    name="phone"
                                    placeholder={t("phonePlaceholder")}
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.phone
                                            ? formik.errors.phone
                                            : ""
                                    }
                                    size="lg"
                                />

                                <FormInput
                                    label={t("message")}
                                    name="message"
                                    as="textarea"
                                    placeholder={t("messagePlaceholder")}
                                    value={formik.values.message}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.message
                                            ? formik.errors.message
                                            : ""
                                    }
                                    size="lg"
                                />
                            </div>

                            <div className={"py-6"}>
                                <SubmitButton
                                    isSubmitting={formik.isSubmitting}
                                    text={t("submit")}
                                    className={"w-full"}
                                    buttonClassname={""}
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
