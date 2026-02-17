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

const SocialMediaStep = ({ initialValues, onSubmit }: { initialValues?: Partial<SocialMediaStepValues>; onSubmit: (values: SocialMediaStepValues) => void }) => {
    const t = useTranslations('contactPage.form');
    const tValidation = useTranslations('contactPage.form.validation');

    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-.~:/?#[\]@!$&'()*+,;=%]*)?$/;

    const validationSchema = Yup.object({
        facebook: Yup.string().matches(urlPattern, { message: tValidation('facebookInvalid'), excludeEmptyString: true }).nullable(),
        instagram: Yup.string().matches(urlPattern, { message: tValidation('instagramInvalid'), excludeEmptyString: true }).nullable(),
        tiktok: Yup.string().matches(urlPattern, { message: tValidation('tiktokInvalid'), excludeEmptyString: true }).nullable(),
        linkedin: Yup.string().matches(urlPattern, { message: tValidation('linkedinInvalid'), excludeEmptyString: true }).nullable(),
    });

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
            <div className="mb-4 sm:mb-6">
                <h2 className="text-body-lg sm:text-body-xl md:text-display-xs font-bold text-white mb-1 sm:mb-2">{t("socialMediaLinks")}</h2>
                <p className="text-secondary-gray text-body-sm sm:text-body-md">{t("socialMediaDescription")}</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="form-group" id="step-3-form">
                <FormInput
                    label={t("facebook")}
                    {...useFormInput<SocialMediaStepValues>("facebook", formik)}
                    placeholder={t("facebookPlaceholder")}
                    size="sm"
                    type="text"
                    className="bg-form-bg text-form-text"
                />

                <FormInput
                    label={t("instagram")}
                    {...useFormInput<SocialMediaStepValues>("instagram", formik)}
                    placeholder={t("instagramPlaceholder")}
                    size="sm"
                    type="text"
                    className="bg-form-bg text-form-text"
                />

                <FormInput
                    label={t("tiktok")}
                    {...useFormInput<SocialMediaStepValues>("tiktok", formik)}
                    placeholder={t("tiktokPlaceholder")}
                    size="sm"
                    type="text"
                    className="bg-form-bg text-form-text"
                />

                <FormInput
                    label={t("linkedin")}
                    {...useFormInput<SocialMediaStepValues>("linkedin", formik)}
                    placeholder={t("linkedinPlaceholder")}
                    size="sm"
                    type="text"
                    className="bg-form-bg text-form-text"
                />
            </form>
        </div>
    );
};

export default SocialMediaStep;