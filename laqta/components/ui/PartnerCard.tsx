import React from "react";
import { Partner, utils } from "@/lib/strapi";

interface PartnerCardProps {
    partner: Partner;
    className?: string;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ partner, className = "" }) => {
    const logoUrl = partner.logo?.url ? utils.getFileUrl(partner.logo.url) : null;
    const firstLetter = partner.name?.charAt(0)?.toUpperCase() || "P";

    const content = (
        <div className={`flex flex-col ${className}`}>
            <div
                className={`
                    group bg-white rounded-3xl p-4 overflow-hidden
                    shadow-[4px_4px_12px_0px_#171b43,4px_4px_30px_4px_#151b52]
                    transition-all duration-300 hover:scale-[1.02]
                    ${partner.website ? "cursor-pointer" : ""}
                `}
            >
                {/* Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-primary">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={partner.logo?.alternativeText || partner.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-5xl font-bold text-white/60">{firstLetter}</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-[rgba(19,112,173,0.2)] rounded-xl" />
                </div>
            </div>
            <p className="text-white font-medium text-lg tracking-wide text-center mt-3">
                {partner.name}
            </p>
        </div>
    );

    if (partner.website) {
        return (
            <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                {content}
            </a>
        );
    }

    return content;
};
