"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useMetaTrack } from "@/lib/useMetaTrack";

export function MetaPageView() {
    const { trackEvent } = useMetaTrack();
    const pathname = usePathname();
    const lastPathname = useRef<string | null>(null);

    useEffect(() => {
        if (pathname !== lastPathname.current) {
            lastPathname.current = pathname;
            trackEvent("PageView");
        }
    }, [pathname, trackEvent]);

    return null;
}
