"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function EmailSubscriptionForm() {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = () => {
        if (email) {
            setIsSubscribed(true);
            // Here you would typically send the email to your backend

            // Reset after 3 seconds for demo
            setTimeout(() => {
                setIsSubscribed(false);
                setEmail("");
            }, 3000);
        }
    };

    return (
        <div className="">
            <div>
                <div className="flex items-center border border-gray-300 rounded-full p-0.5 md:p-1 shadow-sm hover:shadow-md transition-shadow">
                    {/* Icon container */}
                    {/*<div className="bg-amber-300 rounded-full p-2 ml-1 flex items-center justify-center">*/}
                    {/*    <svg*/}
                    {/*        className="w-5 h-5 text-amber-800"*/}
                    {/*        fill="currentColor"*/}
                    {/*        viewBox="0 0 20 20"*/}
                    {/*    >*/}
                    {/*        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />*/}
                    {/*        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />*/}
                    {/*    </svg>*/}
                    {/*</div>*/}

                    {/* Input container */}
                    <div className="flex-1 px-1 md:px-3">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent w-full h-8 md:h-10 lg:h-12 text-body-xs md:text-body-sm outline-none placeholder-gray-500"
                            required
                        />
                    </div>

                    {/* Button */}

                    <div
                        style={{ width: "auto" }}
                        className="w-auto md:w-[230px]"
                    >
                        <Button
                            variant={"primary"}
                            size="sm"
                            className="text-xs md:text-sm"
                            leftIcon={null}
                            rightIcon={null}
                        >
                            {isSubscribed ? "✓ Subscribed!" : "Subscribe Now"}
                        </Button>
                    </div>
                </div>
            </div>

            {isSubscribed && (
                <p className="text-center text-green-600 mt-3 text-sm">
                    Thank you for subscribing! Check your email for
                    confirmation.
                </p>
            )}
        </div>
    );
}
