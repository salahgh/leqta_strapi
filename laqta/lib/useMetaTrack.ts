"use client";

import { useCallback } from "react";

type MetaEvent = "PageView" | "ViewContent" | "InitiateCheckout" | "CompleteRegistration";

interface CustomData {
    content_name?: string;
    content_category?: string;
    content_type?: string;
    value?: number;
    currency?: string;
}

export function useMetaTrack() {
    const trackEvent = useCallback((event: MetaEvent, customData?: CustomData) => {
        fetch("/api/meta/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                event,
                sourceUrl: window.location.href,
                customData,
            }),
        }).catch(() => {
            // Fire-and-forget: silently ignore errors
        });
    }, []);

    return { trackEvent };
}
