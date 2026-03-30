import React from "react";
import { Button } from "@/components/ui/Button";
import { Rocket } from "lucide-react";

interface SubmitButtonProps {
    isSubmitting: boolean;
    text?: string;
    className?: string;
    size?: string;
    buttonClassname?: string;
    fullWidth?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    isSubmitting,
    text = "Submit",
    className = "",
    buttonClassname = "",
    size,
    fullWidth = true,
}) => (
    <div
        style={fullWidth ? { width: "100%" } : undefined}
        className={`h-10 md:h-12 lg:h-14 ${className}`}
    >
        <Button
            rightIcon={<Rocket className="h-4 w-4 md:h-5 md:w-5" />}
            leftIcon={null}
            type="submit"
            disabled={isSubmitting}
            size={size}
            className={buttonClassname}
            fullWidth={fullWidth}
        >
            {text}
        </Button>
    </div>
);
