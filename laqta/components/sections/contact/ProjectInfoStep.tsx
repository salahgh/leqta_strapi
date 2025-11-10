"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CheckCircle, Send } from "lucide-react";
import { FormInput } from "@/components/ui/FormInput";
import Footer from "@/components/sections/Footer";

// Yup validation schema for project info step
const validationSchema = Yup.object({
    projectType: Yup.string().required("Project type is required"),
    budget: Yup.string().required("Budget range is required"),
    timeline: Yup.string().required("Timeline is required"),
    projectDescription: Yup.string()
        .min(20, "Project description must be at least 20 characters")
        .max(1000, "Project description must not exceed 1000 characters")
        .required("Project description is required"),
    goals: Yup.string()
        .min(10, "Goals must be at least 10 characters")
        .max(500, "Goals must not exceed 500 characters")
        .required("Project goals are required"),
});

// Custom hook for handling form input changes
function useFormInput(name, formik) {
    return {
        name,
        value: formik.values[name],
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        error: formik.touched[name] && formik.errors[name],
    };
}

const ProjectInfoStep = ({
    initialValues = {
        projectType: "",
        budget: "",
        timeline: "",
        projectDescription: "",
        goals: "",
    },
    currentStep = 2,
    totalSteps = 4,
}) => {
    const projectTypeOptions = [
        "Web Development",
        "Mobile App",
        "E-commerce",
        "Digital Marketing",
        "Branding & Design",
        "SEO Optimization",
        "Other",
    ];

    const budgetOptions = [
        "Under $5,000",
        "$5,000 - $10,000",
        "$10,000 - $25,000",
        "$25,000 - $50,000",
        "$50,000 - $100,000",
        "Over $100,000",
    ];

    const timelineOptions = [
        "ASAP (Rush job)",
        "1-2 weeks",
        "1 month",
        "2-3 months",
        "3-6 months",
        "6+ months",
        "Flexible",
    ];

    const handleSubmit = (values, formikBag) => {
        // Handle form submission logic here
        formikBag.setSubmitting(false);
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values, formikBag) => {
            if (handleSubmit) {
                handleSubmit(values, formikBag);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-3">
            {/* Project Type */}
            <div className="grid grid-cols-1 gap-3 w-full">
                {/*<FormInput*/}
                {/*    placeholder={undefined}*/}
                {/*    label="Project Type"*/}
                {/*    variant={"compact"}*/}
                {/*    {...useFormInput("projectType", formik)}*/}
                {/*    as="select"*/}
                {/*    // options={projectTypeOptions}*/}
                {/*    style={{*/}
                {/*        backgroundColor: "#141733",*/}
                {/*        color: "#D2D2D3",*/}
                {/*    }}*/}
                {/*/>*/}

                {/* Budget */}
                {/*<FormInput*/}
                {/*    placeholder={undefined}*/}
                {/*    label="Budget"*/}
                {/*    variant={"compact"}*/}
                {/*    {...useFormInput("budget", formik)}*/}
                {/*    as="select"*/}
                {/*    // options={budgetOptions}*/}
                {/*    style={{*/}
                {/*        backgroundColor: "#141733",*/}
                {/*        color: "#D2D2D3",*/}
                {/*    }}*/}
                {/*/>*/}

                {/* Timeline */}
                {/*<FormInput*/}
                {/*    placeholder={undefined}*/}
                {/*    label="Timeline"*/}
                {/*    variant={"compact"}*/}
                {/*    {...useFormInput("timeline", formik)}*/}
                {/*    as="select"*/}
                {/*    // options={timelineOptions}*/}
                {/*    style={{*/}
                {/*        backgroundColor: "#141733",*/}
                {/*        color: "#D2D2D3",*/}
                {/*    }}*/}
                {/*/>*/}

                {/* Project Description */}
                <FormInput
                    placeholder={undefined}
                    label="Project Description"
                    variant={"compact"}
                    {...useFormInput("projectDescription", formik)}
                    as="textarea"
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                        width: "100%",
                        height: 150,
                    }}
                />

                {/* Project Goals */}
                <FormInput
                    placeholder={undefined}
                    variant={"compact"}
                    label="Project Goals & Success Metrics"
                    {...useFormInput("goals", formik)}
                    as="textarea"
                    style={{
                        backgroundColor: "#141733",
                        color: "#D2D2D3",
                        width: "100%",
                        height: 150,
                    }}
                />

                {/* Character Count for Goals */}
                {formik.values.goals && (
                    <div className="text-right text-sm text-slate-400">
                        {formik.values.goals.length}/500 characters
                    </div>
                )}
            </div>
        </form>
    );
};

export default ProjectInfoStep;
