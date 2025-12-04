import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormInput } from "@/components/ui/FormInput";
import { useTranslations } from "next-intl";
import { useFormInput } from "@/lib/formik-helpers";

interface SocialMediaStepValues {
    facebook: string;
    instagram: string;
    tiktok: string;
    linkedin: string;
}

const validationSchema = Yup.object({
    facebook: Yup.string().url("Please enter a valid Facebook URL").nullable(),
    instagram: Yup.string().url("Please enter a valid Instagram URL").nullable(),
    tiktok: Yup.string().url("Please enter a valid TikTok URL").nullable(),
    linkedin: Yup.string().url("Please enter a valid LinkedIn URL").nullable(),
});

const SocialMediaStep = ({ initialValues, onSubmit }: { initialValues?: Partial<SocialMediaStepValues>; onSubmit: (values: SocialMediaStepValues) => void }) => {
    const t = useTranslations('contactPage.form');

    const formik = useFormik<SocialMediaStepValues>({
        initialValues: {
            facebook: "",
            instagram: "",
            tiktok: "",
            linkedin: "",
            ...initialValues
        },
        validationSchema,
        onSubmit,
    });

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-display-xs font-bold text-white mb-2">Social Media Links</h2>
                <p className="text-secondary-gray">Connect your social media profiles (optional).</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="form-group" id="step-3-form">
                <FormInput
                    label="Facebook"
                    {...useFormInput<SocialMediaStepValues>("facebook", formik)}
                    placeholder="https://facebook.com/yourpage"
                    size="sm"
                    type="url"
                    className="bg-form-bg text-form-text"
                />

                <FormInput
                    label="Instagram"
                    {...useFormInput<SocialMediaStepValues>("instagram", formik)}
                    placeholder="https://instagram.com/yourpage"
                    size="sm"
                    type="url"
                    className="bg-form-bg text-form-text"
                />

                <FormInput
                    label="TikTok"
                    {...useFormInput<SocialMediaStepValues>("tiktok", formik)}
                    placeholder="https://tiktok.com/@yourpage"
                    size="sm"
                    type="url"
                    className="bg-form-bg text-form-text"
                />

                <FormInput
                    label="LinkedIn"
                    {...useFormInput<SocialMediaStepValues>("linkedin", formik)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    size="sm"
                    type="url"
                    className="bg-form-bg text-form-text"
                />
            </form>
        </div>
    );
};

export default SocialMediaStep;