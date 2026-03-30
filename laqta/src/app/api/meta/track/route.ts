import { NextRequest, NextResponse } from "next/server";
import { sendMetaEvent } from "@/lib/meta-capi";

const ALLOWED_EVENTS = [
    "PageView",
    "ViewContent",
    "InitiateCheckout",
    "CompleteRegistration",
] as const;

export async function POST(request: NextRequest) {
    try {
        const { event, sourceUrl, userData, customData } = await request.json();

        if (!event || !ALLOWED_EVENTS.includes(event)) {
            return NextResponse.json({ error: "Invalid event" }, { status: 400 });
        }

        const clientIp =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request.headers.get("x-real-ip") ||
            undefined;
        const clientUserAgent = request.headers.get("user-agent") || undefined;

        // Fire-and-forget: don't await
        sendMetaEvent({
            eventName: event,
            sourceUrl: sourceUrl || request.headers.get("referer") || "",
            userData: {
                ...userData,
                clientIpAddress: clientIp,
                clientUserAgent: clientUserAgent,
            },
            customData,
        });

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
}
