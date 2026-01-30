import { cookieConsentApi } from "@/lib/strapi";
import { CookieConsent } from "./CookieConsent";

interface CookieConsentWrapperProps {
    locale: string;
}

export async function CookieConsentWrapper({ locale }: CookieConsentWrapperProps) {
    // Fetch cookie consent content from Strapi
    const content = await cookieConsentApi.get(locale);

    return <CookieConsent content={content} />;
}
