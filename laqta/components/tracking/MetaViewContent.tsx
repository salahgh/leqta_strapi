"use client";

import { useEffect } from "react";
import { useMetaTrack } from "@/lib/useMetaTrack";

export function MetaViewContent() {
    const { trackEvent } = useMetaTrack();

    useEffect(() => {
        trackEvent("ViewContent", { content_type: "service" });
    }, [trackEvent]);

    return null;
}
