import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormInput } from "@/components/ui/FormInput";
import { useTranslations } from "next-intl";
import { useFormInput } from "@/lib/formik-helpers";

interface PersonalInfoStepValues {
    fullName: string;
    email: string;
    phoneNumber: string;
}

const PersonalInfoStep = ({ initialValues, onSubmit }: { initialValues?: Partial<PersonalInfoStepValues>; onSubmit: (values: PersonalInfoStepValues) => void }) => {
    const t = useTranslations('contactPage.form');
    const tValidation = useTranslations('contactPage.form.validation');
    
    const validationSchema = Yup.object({
        fullName: Yup.string()
            .min(2, tValidation('minLength', { min: 2 }))
            .max(100, tValidation('maxLength', { max: 100 }))
            .matches(/^[A-Za-z\s]+$/, "Full name can only contain letters")
            .required(tValidation('fullNameRequired')),
        email: Yup.string()
            .email(tValidation('email'))
            .required(tValidation('emailRequired')),
        phoneNumber: Yup.string()
            .matches(/^[+]?[\d\s\-\(\)]+$/, tValidation('phone'))
            .required(tValidation('phoneRequired')),
    });

    const formik = useFormik<PersonalInfoStepValues>({
        initialValues: {
            fullName: "",
            email: "",
            phoneNumber: "",
            ...initialValues
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
                <p className="text-slate-300">Let's start with your basic contact information.</p>
            </div>
            
            <form onSubmit={formik.handleSubmit} className="space-y-4" id="step-1-form">
                <FormInput
                    label={t('fullName')}
                    {...useFormInput<PersonalInfoStepValues>("fullName", formik)}
                    placeholder={t('fullNamePlaceholder')}
                    variant={"compact"}
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                    }}
                />

                <FormInput
                    label={t('email')}
                    {...useFormInput<PersonalInfoStepValues>("email", formik)}
                    placeholder={t('emailPlaceholder')}
                    variant={"compact"}
                    type="email"
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                    }}
                />

                <FormInput
                    label={t('phoneNumber')}
                    {...useFormInput<PersonalInfoStepValues>("phoneNumber", formik)}
                    variant={"compact"}
                    placeholder={t('phoneNumberPlaceholder')}
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                    }}
                />
            </form>
        </div>
    );
};

export default PersonalInfoStep;