"use client";

/**
 * NewsletterForm Component - Design System
 * Uses design tokens for consistent styling
 * Mobile-first responsive design
 */

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { newsletterApi } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

// Validation schema
const validationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email address")
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email",
        )
        .required("Email is required"),
});

interface NewsletterFormProps {
    variant?: "footer" | "blog";
    className?: string;
}

export default function NewsletterForm({
    variant = "footer",
    className = "",
}: NewsletterFormProps) {
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const t = useTranslations("footer");

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const result = await newsletterApi.subscribe(values.email);

                setStatus(result.success ? "success" : "error");
                setMessage(result.message);

                if (result.success) {
                    resetForm();
                }

                // Reset status after 5 seconds
                setTimeout(() => {
                    setStatus("idle");
                    setMessage("");
                }, 5000);
            } catch (error) {
                setStatus("error");
                setMessage("An unexpected error occurred. Please try again.");
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (variant === "blog") {
        return (
            <section className={cn("section-px pb-12 sm:pb-16", className)}>
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-primary-button rounded-2xl card-p-lg text-center">
                        <h3 className="text-display-xs sm:text-display-sm md:text-display-md font-bold text-white mb-3 sm:mb-4">
                            Stay Updated with Our Latest Stories
                        </h3>
                        <p className="text-blue-100 text-body-md sm:text-body-lg mb-6 sm:mb-8">
                            Get the latest insights, tips, and stories delivered
                            straight to your inbox.
                        </p>

                        <form
                            onSubmit={formik.handleSubmit}
                            className="max-w-md mx-auto"
                        >
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="input-lg  flex-1 bg-white text-neutral-900 placeholder-neutral-500 rounded-lg border-0 focus:ring-2
                                    focus:ring-white focus:ring-opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    className="btn-md bg-white text-primary-light font-semibold rounded-lg hover:bg-neutral-100 disabled:opacity-50 transition-colors"
                                >
                                    {formik.isSubmitting
                                        ? "Subscribing..."
                                        : "Subscribe"}
                                </button>
                            </div>

                            {/* Show validation error */}
                            {formik.touched.email && formik.errors.email && (
                                <p className="form-error mt-3 sm:mt-4 text-red-200">
                                    {formik.errors.email}
                                </p>
                            )}

                            {/* Show submission status */}
                            {message && (
                                <p
                                    className={cn(
                                        "mt-3 sm:mt-4 text-body-sm",
                                        status === "success"
                                            ? "text-green-200"
                                            : "text-red-200",
                                    )}
                                >
                                    {message}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </section>
        );
    }

    // Footer variant
    return (
        <div className={className}>
            <form onSubmit={formik.handleSubmit}>
                <div className="flex items-center border border-neutral-300 rounded-full p-0.5 sm:p-1 shadow-sm hover:shadow-md transition-shadow">
                    {/* Input container */}
                    <div className="flex-1 px-2 sm:px-3">
                        <input
                            type="email"
                            name="email"
                            placeholder={t("emailPlaceholder")}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-transparent w-full h-9 sm:h-10 md:h-11 text-body-xs sm:text-body-sm outline-none placeholder-neutral-500 text-neutral-900"
                        />
                    </div>

                    {/* Button */}
                    <Button
                        variant="primary"
                        size="sm"
                        leftIcon={null}
                        rightIcon={null}
                        onClick={formik.handleSubmit}
                        disabled={formik.isSubmitting}
                        className="whitespace-nowrap"
                    >
                        {formik.isSubmitting
                            ? t("subscribing")
                            : status === "success"
                              ? t("subscribed")
                              : t("subscribeNow")}
                    </Button>
                </div>
            </form>

            {/* Show validation error */}
            {formik.touched.email && formik.errors.email && (
                <p className="text-center text-red-500 mt-2 sm:mt-3 text-body-xs sm:text-body-sm">
                    {formik.errors.email}
                </p>
            )}

            {/* Show submission status */}
            {message && status !== "idle" && (
                <p
                    className={cn(
                        "text-center mt-2 sm:mt-3 text-body-xs sm:text-body-sm",
                        status === "success"
                            ? "text-green-500"
                            : "text-red-500",
                    )}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
