import { FormikProps } from "formik";

/**
 * Custom hook for handling form input changes with Formik
 * Simplifies the process of passing values and handlers to form input components
 *
 * @param name - The name of the form field
 * @param formik - The formik instance from useFormik hook
 * @returns Object containing all necessary props for form inputs
 *
 * @example
 * ```tsx
 * const formik = useFormik({ ... });
 *
 * <FormInput {...useFormInput("email", formik)} />
 * ```
 */
export function useFormInput<T = any>(
    name: keyof T & string,
    formik: FormikProps<T>
) {
    return {
        name,
        value: formik.values[name],
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        error: formik.touched[name] && formik.errors[name]
            ? String(formik.errors[name])
            : undefined,
    };
}

/**
 * Helper to check if a field has been touched and has an error
 *
 * @param name - The name of the form field
 * @param formik - The formik instance from useFormik hook
 * @returns Boolean indicating if the field has a validation error
 */
export function hasFieldError<T = any>(
    name: keyof T & string,
    formik: FormikProps<T>
): boolean {
    return Boolean(formik.touched[name] && formik.errors[name]);
}

/**
 * Gets the error message for a specific field
 *
 * @param name - The name of the form field
 * @param formik - The formik instance from useFormik hook
 * @returns The error message or undefined
 */
export function getFieldError<T = any>(
    name: keyof T & string,
    formik: FormikProps<T>
): string | undefined {
    return formik.touched[name] && formik.errors[name]
        ? String(formik.errors[name])
        : undefined;
}
