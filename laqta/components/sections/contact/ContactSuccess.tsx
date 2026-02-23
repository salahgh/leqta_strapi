"use client";

import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import SuccessStep from "@/components/sections/contact/SuccessStep";

const SUBMITTED_FLAG = "leqta_contact_submitted";

const ContactSuccess = () => {
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem(SUBMITTED_FLAG)) {
            setAuthorized(true);
        } else {
            window.location.href = "/contact";
        }
    }, []);

    const handleGoToMainPage = () => {
        sessionStorage.removeItem(SUBMITTED_FLAG);
        window.location.href = "/";
    };

    if (!authorized) {
        return <div className="min-h-screen bg-primary" />;
    }

    return (
        <div className="bg-primary text-white min-h-screen">
            <Navigation />
            <div className="max-w-container mx-auto section-px py-8">
                <div className="max-w-2xl mx-auto">
                    <SuccessStep onGoToMainPage={handleGoToMainPage} />
                </div>
            </div>
        </div>
    );
};

export default ContactSuccess;
