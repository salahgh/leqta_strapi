"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import { FormInput } from "@/components/ui/FormInput";

interface ContactFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  industry: string;
  otherIndustry: string;
  companyName: string;
  jobTitle: string;
  website: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  projectType: string;
  budget: string;
  timeline: string;
  projectDescription: string;
  goals: string;
}

interface ProjectDetailsStepProps {
  initialValues: ContactFormData;
  onSubmit: (data: Partial<ContactFormData>) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  allFormData: ContactFormData;
}

const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({
  initialValues,
  onSubmit,
  onBack,
  isSubmitting,
  submitError,
  allFormData,
}) => {
  const t = useTranslations('contactPage.form');
  const tButtons = useTranslations('contactPage.buttons');
  const tCommon = useTranslations('common');

  const validationSchema = Yup.object({
    projectDescription: Yup.string().required(tCommon('required')),
    goals: Yup.string().required(tCommon('required')),
  });

  const formik = useFormik({
    initialValues: {
      projectDescription: initialValues.projectDescription || "",
      goals: initialValues.goals || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  return (
    <div className="stack-gap-lg">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-body-lg sm:text-body-xl md:text-display-xs font-bold text-white mb-1 sm:mb-2">
          {t('projectDetails')}
        </h2>
        <p className="text-secondary-gray text-body-sm sm:text-body-md">
          {t('projectDetailsDescription')}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="stack-gap-lg">
        <div className="form-group">
          <FormInput
            label={t('projectDescription')}
            name="projectDescription"
            as="textarea"
            placeholder={t('projectDescriptionPlaceholder')}
            value={formik.values.projectDescription}
            onChange={formik.handleChange}
            error={
              formik.touched.projectDescription
                ? formik.errors.projectDescription
                : ""
            }
            size="sm"
            rows={4}
            className="bg-form-bg text-form-text"
          />

          <FormInput
            label={t('goals')}
            name="goals"
            as="textarea"
            placeholder={t('goalsPlaceholder')}
            value={formik.values.goals}
            onChange={formik.handleChange}
            error={
              formik.touched.goals ? formik.errors.goals : ""
            }
            size="sm"
            rows={3}
            className="bg-form-bg text-form-text"
          />
        </div>

        {submitError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg card-p-sm">
            <p className="text-red-400 text-body-sm">{submitError}</p>
          </div>
        )}

        {/* Summary of all collected data */}
        <div className="bg-neutral-800/50 rounded-lg card-p-sm mt-6">
          <h3 className="text-body-lg font-semibold text-white mb-3">Review Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 grid-gap-sm text-body-sm">
            <div>
              <span className="text-secondary-gray">Name:</span>
              <span className="text-white ml-2">{allFormData.fullName}</span>
            </div>
            <div>
              <span className="text-secondary-gray">Email:</span>
              <span className="text-white ml-2">{allFormData.email}</span>
            </div>
            <div>
              <span className="text-secondary-gray">Company:</span>
              <span className="text-white ml-2">{allFormData.companyName}</span>
            </div>
            <div>
              <span className="text-secondary-gray">Project Type:</span>
              <span className="text-white ml-2">{allFormData.projectType}</span>
            </div>
            <div>
              <span className="text-secondary-gray">Budget:</span>
              <span className="text-white ml-2">{allFormData.budget}</span>
            </div>
            <div>
              <span className="text-secondary-gray">Timeline:</span>
              <span className="text-white ml-2">{allFormData.timeline}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-slate-600 rounded-full hover:bg-slate-700/30 transition-colors text-white text-body-md"
            disabled={isSubmitting}
          >
            {tButtons('goBack')}
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full font-medium text-body-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {tButtons('submitting') || 'Submitting...'}
              </>
            ) : (
              tButtons('submit')
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectDetailsStep;