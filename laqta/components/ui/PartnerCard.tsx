import React from "react";
import { ExternalLink } from "lucide-react";
import { Partner, utils } from "@/lib/strapi";

interface PartnerCardProps {
    partner: Partner;
    className?: string;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ partner, className = "" }) => {
    const logoUrl = partner.logo?.url ? utils.getFileUrl(partner.logo.url) : null;
    const firstLetter = partner.name?.charAt(0)?.toUpperCase() || "P";

    const cardContent = (
        <div
            className={`
                group relative flex flex-col items-center text-center p-6 rounded-2xl
                border border-white/10 bg-white/5 backdrop-blur-sm
                transition-all duration-300
                hover:border-accent-blue/30 hover:bg-white/10 hover:shadow-lg hover:shadow-accent-blue/5
                ${partner.website ? "cursor-pointer" : ""}
                ${className}
            `}
        >
            {/* Logo */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 bg-white/10 flex items-center justify-center border border-white/20">
                {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt={partner.logo?.alternativeText || partner.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-2xl font-bold text-white/80">{firstLetter}</span>
                )}
            </div>

            {/* Name */}
            <h3 className="text-white font-semibold text-body-lg mb-2 group-hover:text-accent-blue transition-colors">
                {partner.name}
            </h3>

            {/* Description */}
            {partner.description && (
                <p className="text-secondary-gray text-body-sm line-clamp-3 mb-3">
                    {partner.description}
                </p>
            )}

            {/* External link indicator */}
            {partner.website && (
                <div className="mt-auto pt-2">
                    <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-accent-blue transition-colors" />
                </div>
            )}
        </div>
    );

    if (partner.website) {
        return (
            <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
            >
                {cardContent}
            </a>
        );
    }

    return cardContent;
};
