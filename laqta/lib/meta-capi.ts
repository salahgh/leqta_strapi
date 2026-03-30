import { createHash } from "crypto";
import { trackingPixelApi } from "@/lib/strapi";

const META_CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const GRAPH_API_VERSION = "v21.0";

// Cache the pixel ID from Strapi to avoid repeated fetches
let cachedPixelId: string | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function getPixelId(): Promise<string | null> {
    if (cachedPixelId && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
        return cachedPixelId;
    }
    try {
        const config = await trackingPixelApi.get();
        cachedPixelId = config?.metaPixelId || null;
        cacheTimestamp = Date.now();
        return cachedPixelId;
    } catch (error) {
        console.error("[Meta CAPI] Failed to fetch pixel ID from Strapi:", error);
        return cachedPixelId; // return stale cache if available
    }
}

function sha256(value: string): string {
    return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

interface UserData {
    email?: string;
    phone?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbc?: string;
    fbp?: string;
}

interface CustomData {
    content_name?: string;
    content_category?: string;
    content_type?: string;
    value?: number;
    currency?: string;
}

interface MetaEventParams {
    eventName: string;
    sourceUrl: string;
    userData?: UserData;
    customData?: CustomData;
    actionSource?: "website" | "email" | "app" | "phone_call" | "chat" | "system_generated";
    eventId?: string;
}

export async function sendMetaEvent({
    eventName,
    sourceUrl,
    userData = {},
    customData,
    actionSource = "website",
    eventId,
}: MetaEventParams): Promise<void> {
    const pixelId = await getPixelId();

    if (!pixelId || !META_CAPI_ACCESS_TOKEN) {
        console.warn("[Meta CAPI] Missing Pixel ID (from Strapi) or META_CAPI_ACCESS_TOKEN env var");
        return;
    }

    const hashedUserData: Record<string, string | undefined> = {};
    if (userData.email) hashedUserData.em = sha256(userData.email);
    if (userData.phone) hashedUserData.ph = sha256(userData.phone);
    if (userData.clientIpAddress) hashedUserData.client_ip_address = userData.clientIpAddress;
    if (userData.clientUserAgent) hashedUserData.client_user_agent = userData.clientUserAgent;
    if (userData.fbc) hashedUserData.fbc = userData.fbc;
    if (userData.fbp) hashedUserData.fbp = userData.fbp;

    const eventData: Record<string, unknown> = {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: sourceUrl,
        action_source: actionSource,
        user_data: hashedUserData,
    };

    if (eventId) eventData.event_id = eventId;
    if (customData) eventData.custom_data = customData;

    try {
        const response = await fetch(
            `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    data: [eventData],
                    access_token: META_CAPI_ACCESS_TOKEN,
                }),
            },
        );

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[Meta CAPI] Error ${response.status}: ${errorBody}`);
        }
    } catch (error) {
        console.error("[Meta CAPI] Failed to send event:", error);
    }
}
