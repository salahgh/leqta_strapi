"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { newsletterApi } from "@/lib/strapi";

// Validation schema
const validationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email address")
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email"
        )
        .required("Email is required"),
});

interface NewsletterFormProps {
    variant?: "footer" | "blog";
    className?: string;
}

export default function NewsletterForm({
    variant = "footer",
    className = ""
}: NewsletterFormProps) {
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const result = await newsletterApi.subscribe(values.email);

                setStatus(result.success ? 'success' : 'error');
                setMessage(result.message);

                if (result.success) {
                    resetForm();
                }

                // Reset status after 5 seconds
                setTimeout(() => {
                    setStatus('idle');
                    setMessage("");
                }, 5000);
            } catch (error) {
                setStatus('error');
                setMessage('An unexpected error occurred. Please try again.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (variant === "blog") {
        return (
            <section className={`px-4 md:px-8 pb-16 ${className}`}>
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
                        <h3 className="text-display-sm md:text-display-md font-bold text-white mb-4">
                            Stay Updated with Our Latest Stories
                        </h3>
                        <p className="text-blue-100 text-body-lg mb-8">
                            Get the latest insights, tips, and stories delivered straight to your inbox.
                        </p>

                        <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-900"
                                />
                                <button
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    {formik.isSubmitting ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </div>

                            {/* Show validation error */}
                            {formik.touched.email && formik.errors.email && (
                                <p className="mt-4 text-sm text-red-200">
                                    {formik.errors.email}
                                </p>
                            )}

                            {/* Show submission status */}
                            {message && (
                                <p className={`mt-4 text-sm ${
                                    status === 'success' ? 'text-green-200' : 'text-red-200'
                                }`}>
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
                <div className="flex items-center border border-gray-300 rounded-full p-0.5 md:p-1 shadow-sm hover:shadow-md transition-shadow">
                    {/* Input container */}
                    <div className="flex-1 px-1 md:px-3">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-transparent w-full h-8 md:h-10 lg:h-12 text-body-xs md:text-body-sm outline-none placeholder-gray-500"
                        />
                    </div>

                    {/* Button */}
                    <div
                        style={{ width: "auto" }}
                        className="w-auto md:w-[230px]"
                    >
                        <Button
                            variant="primary"
                            size="sm"
                            className="text-xs md:text-sm"
                            leftIcon={null}
                            rightIcon={null}
                            onClick={formik.handleSubmit}
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting
                                ? "Subscribing..."
                                : status === 'success'
                                ? "✓ Subscribed!"
                                : "Subscribe Now"
                            }
                        </Button>
                    </div>
                </div>
            </form>

            {/* Show validation error */}
            {formik.touched.email && formik.errors.email && (
                <p className="text-center text-red-600 mt-3 text-sm">
                    {formik.errors.email}
                </p>
            )}

            {/* Show submission status */}
            {message && status !== 'idle' && (
                <p className={`text-center mt-3 text-sm ${
                    status === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                    {message}
                </p>
            )}
        </div>
    );
}
