import { useFormik } from "formik";
import * as Yup from "yup";
import { FormInput } from "@/components/ui/FormInput";
import { useFormInput } from "@/lib/formik-helpers";

const validationSchema = {
    cardNumber: Yup.string()
        .matches(/^\d{16}$/, "Card number must be 16 digits")
        .required("Card number is required"),
    expirationDate: Yup.string()
        .matches(
            /^(0[1-9]|1[0-2])\/\d{2}$/,
            "Expiration date must be in MM/YY format",
        )
        .required("Expiration date is required"),
    cvv: Yup.string()
        .matches(/^\d{3}$/, "CVV must be 3 digits")
        .required("CVV is required"),
};

export function PaymentInfoForm({
    initialValues = {
        cardNumber: "",
        expirationDate: "",
        cvv: "",
    },
    currentStep = 3,
    totalSteps = 4,
}) {
    const handleSubmit = (values, formikBag) => {
        // Handle form submission logic here
        formikBag.setSubmitting(false);
    };

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object(validationSchema),
        onSubmit: (values, { setSubmitting, resetForm }) =>
            handleSubmit(values, { setSubmitting, resetForm }),
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-3">
            {/* Payment Details */}
            <FormInput
                label="Card Number"
                {...useFormInput("cardNumber", formik)}
                placeholder="Enter your card number"
                variant={"compact"}
                style={{
                    backgroundColor: "#141733",
                    color: "#D2D2D3",
                }}
            />

            <FormInput
                label="Expiration Date"
                {...useFormInput("expirationDate", formik)}
                placeholder="MM/YY"
                variant={"compact"}
                style={{
                    backgroundColor: "#141733",
                    color: "#D2D2D3",
                }}
            />

            <FormInput
                label="CVV"
                {...useFormInput("cvv", formik)}
                placeholder="123"
                variant={"compact"}
                style={{
                    backgroundColor: "#141733",
                    color: "#D2D2D3",
                }}
            />
        </form>
    );
}
