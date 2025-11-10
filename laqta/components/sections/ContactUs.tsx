"use client";

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
    const tCommon = useTranslations('common');
    
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
        <div className="bg-primary flex flex-col md:flex-row items-center justify-center py-8">
            <ContactInfo />

            <div className={"w-full md:w-auto md:p-12 p-2 mt-2 md:mt-4 "}>
                <div
                    style={{
                        background:
                            "linear-gradient(358deg, rgba(0, 0, 0, 0.8) 0%, rgba(255, 255, 255, 0.2) 100%)",
                        padding: 2,
                        borderRadius: 16,
                        zIndex: 20,
                    }}
                    className={"shadow-2xl pt-2 md:pt-8"}
                >
                    {/* Inner content */}
                    <div
                        style={{
                            background:
                                "linear-gradient(180deg, rgba(29, 34, 53, 1) 0%, rgba(18, 19, 24, 1) 100%)",
                            borderRadius: 15, // 62 - 16 (border width)
                            zIndex: 19,
                        }}
                        className={"shadow-2xl w-full md:p-4 p-2"}
                    >
                        <form onSubmit={formik.handleSubmit} className="h-full">
                            <div className="space-y-4 p-1 md:p-2 lg:p-3">
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
                                    variant="compact"
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
                                    variant="compact"
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
                                    variant="compact"
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
                                    variant="compact"
                                />
                            </div>
                            <div className="md:mt-4 mt-0.5">
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
