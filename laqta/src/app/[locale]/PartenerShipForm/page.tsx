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

// Yup validation schema
const validationSchema = Yup.object({
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
});

// useFormInput hook moved to @/lib/formik-helpers.ts

function PartnershipFormPage() {
    const params = useParams();
    const locale = (params?.locale as string) || "en";
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
        firstName: "Sarah",
        lastName: "",
        companyName: "",
        email: "",
        phone: "",
        service: "",
        message: "",
    };

    const onSubmit = (values, { setSubmitting }) => {
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
        <div className="min-h-screen bg-gray-900 py-12 px-4">
            <Navigation />
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="mb-8 mt-32 animate-slide-down" style={{ opacity: 0 }}>
                        <span
                            className="inline-block border px-6 py-4 rounded-full"
                            style={{
                                color: "#54B3F1",
                                borderColor: "#54B3F1",
                                fontSize: 20,
                            }}
                        >
                            Become a Partner
                        </span>
                    </div>

                    <h1 className="text-white mb-2 animate-slide-up" style={{ fontSize: 56, opacity: 0, animationDelay: "150ms" }}>
                        Partnership Form
                    </h1>

                    <p
                        className="text-gray-400 animate-fade-in"
                        style={{
                            fontSize: 24,
                            color: "#C6BBBB",
                            maxWidth: 900,
                            opacity: 0,
                            animationDelay: "300ms",
                        }}
                    >
                        Want to collaborate with LAQTA? Let's build something
                        unforgettable together. Fill out the form below and
                        we'll get back to you shortly.
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-3 animate-fade-in" style={{ opacity: 0, animationDelay: "450ms" }}>
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormInput
                            label="First Name"
                            {...useFormInput("firstName", formik)}
                            placeholder="Sarah"
                            style={{
                                backgroundColor: "#141733",
                                color: "#D2D2D3",
                            }}
                        />
                        <FormInput
                            label="Last Name"
                            {...useFormInput("lastName", formik)}
                            placeholder="e.g. Benyamina"
                            style={{
                                backgroundColor: "#141733",
                                color: "#D2D2D3",
                            }}
                        />
                    </div>

                    {/* Company Name */}
                    <FormInput
                        label="Company Name"
                        {...useFormInput("companyName", formik)}
                        placeholder="e.g. BrightHive"
                        style={{
                            backgroundColor: "#141733",
                            color: "#D2D2D3",
                        }}
                    />

                    {/* Email Field */}
                    <FormInput
                        label="Email Address"
                        {...useFormInput("email", formik)}
                        type="email"
                        placeholder="e.g. sarah.benyamina@email.com"
                        style={{
                            backgroundColor: "#141733",
                            color: "#D2D2D3",
                        }}
                    />

                    {/* Phone Field */}
                    <FormInput
                        label="Phone Number"
                        {...useFormInput("phone", formik)}
                        type="tel"
                        placeholder="e.g. +213 555 123 456"
                        style={{
                            backgroundColor: "#141733",
                            color: "#D2D2D3",
                        }}
                    />

                    {/* Service Selection */}
                    {/*<FormInput*/}
                    {/*    label="Service"*/}
                    {/*    {...useFormInput("service", formik)}*/}
                    {/*    as="select"*/}
                    {/*    placeholder="Select one"*/}
                    {/*    style={{*/}
                    {/*        backgroundColor: "#141733",*/}
                    {/*        color: "#D2D2D3",*/}
                    {/*        options: serviceOptions,*/}
                    {/*    }}*/}
                    {/*/>*/}

                    {/* Message Field */}
                    <FormInput
                        label="Message"
                        {...useFormInput("message", formik)}
                        as="textarea"
                        placeholder="Tell us more about what you're looking for..."
                        style={{
                            backgroundColor: "#141733",
                            color: "#D2D2D3",
                            width: "100%",
                            minHeight: 200,
                        }}
                    />

                    {/* Character Count for Message */}
                    {formik.values.message && (
                        <div className="text-right text-sm text-gray-400 -mt-4">
                            {formik.values.message.length}/500 characters
                        </div>
                    )}

                    <div className={"h-16 flex justify-end"}>
                        <div style={{ width: 300 }}>
                            <Button
                                onClick={formik.handleSubmit}
                                disabled={formik.isSubmitting}
                                leftIcon={null}
                                rightIcon={null}
                            >
                                {formik.isSubmitting
                                    ? "Submitting..."
                                    : "Submit Application"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer locale={locale} />
        </div>
    );
}

export default PartnershipFormPage;
