"use client";

/**
 * TrackingScripts Component
 * Law 18-07 Compliant tracking script loader
 *
 * Only loads tracking scripts AFTER user has given consent:
 * - Google Analytics (analytics consent)
 * - Meta Pixel (marketing consent)
 * - TikTok Pixel (marketing consent)
 *
 * Scripts are NOT loaded if user rejects cookies or hasn't given consent yet.
 *
 * Tracking IDs can be managed via Strapi CMS (tracking-pixel single type)
 * with fallback to environment variables.
 */

import { useEffect, useState } from "react";
import Script from "next/script";
import { useCookieConsent } from "./CookieConsent";

export interface TrackingScriptsConfig {
    gaId?: string;
    metaId?: string;
    tiktokId?: string;
}

// Environment variables for tracking IDs (fallback)
const ENV_GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const ENV_META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ENV_TIKTOK_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

export function TrackingScripts({ config }: { config?: TrackingScriptsConfig }) {
    const consent = useCookieConsent();
    const [analyticsLoaded, setAnalyticsLoaded] = useState(false);
    const [marketingLoaded, setMarketingLoaded] = useState(false);

    // Use CMS-managed IDs with env variable fallback
    const GA_MEASUREMENT_ID = config?.gaId || ENV_GA_ID;
    const META_PIXEL_ID = config?.metaId || ENV_META_ID;
    const TIKTOK_PIXEL_ID = config?.tiktokId || ENV_TIKTOK_ID;

    // Check if analytics consent is given
    const hasAnalyticsConsent = consent?.given && consent?.preferences?.analytics;
    const hasMarketingConsent = consent?.given && consent?.preferences?.marketing;

    // Reset loaded state if consent is withdrawn
    useEffect(() => {
        if (!hasAnalyticsConsent) {
            setAnalyticsLoaded(false);
        }
        if (!hasMarketingConsent) {
            setMarketingLoaded(false);
        }
    }, [hasAnalyticsConsent, hasMarketingConsent]);

    return (
        <>
            {/* Google Analytics - Only load with analytics consent */}
            {hasAnalyticsConsent && GA_MEASUREMENT_ID && !analyticsLoaded && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                        strategy="afterInteractive"
                        onLoad={() => setAnalyticsLoaded(true)}
                    />
                    <Script
                        id="google-analytics"
                        strategy="afterInteractive"
                    >
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${GA_MEASUREMENT_ID}', {
                                page_path: window.location.pathname,
                            });
                        `}
                    </Script>
                </>
            )}

            {/* Meta Pixel - Only load with marketing consent */}
            {hasMarketingConsent && META_PIXEL_ID && !marketingLoaded && (
                <Script
                    id="meta-pixel"
                    strategy="afterInteractive"
                    onLoad={() => setMarketingLoaded(true)}
                >
                    {`
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${META_PIXEL_ID}');
                        fbq('track', 'PageView');
                    `}
                </Script>
            )}

            {/* TikTok Pixel - Only load with marketing consent */}
            {hasMarketingConsent && TIKTOK_PIXEL_ID && (
                <Script
                    id="tiktok-pixel"
                    strategy="afterInteractive"
                >
                    {`
                        !function (w, d, t) {
                            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                            ttq.load('${TIKTOK_PIXEL_ID}');
                            ttq.page();
                        }(window, document, 'ttq');
                    `}
                </Script>
            )}
        </>
    );
}
