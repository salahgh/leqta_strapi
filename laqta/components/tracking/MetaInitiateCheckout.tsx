"use client";

import { useEffect } from "react";
import { useMetaTrack } from "@/lib/useMetaTrack";

export function MetaInitiateCheckout() {
    const { trackEvent } = useMetaTrack();

    useEffect(() => {
        trackEvent("InitiateCheckout");
    }, [trackEvent]);

    return null;
}
