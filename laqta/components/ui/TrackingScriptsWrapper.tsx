import { trackingPixelApi } from "@/lib/strapi";
import { TrackingScripts } from "./TrackingScripts";

export async function TrackingScriptsWrapper() {
    const config = await trackingPixelApi.get();

    return (
        <TrackingScripts
            config={{
                gaId: config?.enableGoogleAnalytics !== false ? config?.googleAnalyticsId : undefined,
                metaId: config?.enableMetaPixel !== false ? config?.metaPixelId : undefined,
                tiktokId: config?.enableTiktokPixel !== false ? config?.tiktokPixelId : undefined,
            }}
        />
    );
}
