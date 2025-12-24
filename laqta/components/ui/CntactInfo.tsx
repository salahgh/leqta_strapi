import React from "react";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useTranslations } from "next-intl";

interface ContactInfoProps {
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
}

export const ContactInfo = ({ contactEmail, contactPhone, address }: ContactInfoProps) => {
    const t = useTranslations("contact");

    // Fallback values if not provided from CMS
    const email = contactEmail || "hello@laqta.agency";
    const phone = contactPhone || "+213 770 123 456";
    const addressText = address || "LAQTA Studio, 1600, Algiers, Algeria";

    return (
        <div className=" space-y-8">
            <Badge variant="accent">{t("connectBadge")}</Badge>

            <h2 className={"leading-tight text-gray-100"}>
                {t("contactTitle")}
            </h2>

            <div className="text-gray-400 space-y-8">
                <p className="leading-relaxed text-secondary-gray text-responsive-lg">
                    {t("contactDescription")}
                </p>

                <div className={"space-y-4 text-responsive-lg"}>
                    <a href={`tel:${phone}`} className={"flex gap-2 items-center hover:text-white transition-colors"}>
                        <PhoneCall className={"w-8 h-8"} />
                        <div>{phone}</div>
                    </a>
                    <a href={`mailto:${email}`} className={"flex gap-2 items-center hover:text-white transition-colors"}>
                        <Mail className={"w-8 h-8"} />
                        <div>{email}</div>
                    </a>

                    <div className={"flex gap-1 items-center"}>
                        <MapPin className={"w-10 h-10"} />
                        <div className="leading-relaxed whitespace-pre-line">
                            {addressText}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
