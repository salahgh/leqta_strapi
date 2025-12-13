import React from "react";
import { Mail, MapPin, Phone, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useTranslations } from "next-intl";

export const ContactInfo = () => {
    const t = useTranslations("contact");

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
                    <div className={"flex gap-2 items-center"}>
                        <PhoneCall className={"w-8 h-8"} />
                        <div>+213 770 123 456</div>
                    </div>
                    <div className={"flex gap-2 items-center"}>
                        <Mail className={"w-8 h-8"} />
                        <div>helllo@laqta.agency</div>
                    </div>

                    <div className={"flex gap-1 items-center"}>
                        <MapPin className={"w-10 h-10"} />
                        <div className="leading-relaxed">
                            LAQTA Studio, 1600, Algiers,
                            <br />
                            Algeria
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
