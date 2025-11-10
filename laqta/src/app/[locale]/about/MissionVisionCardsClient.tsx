"use client";

import React from "react";
import { Telescope, Users, Wand2, LucideIcon } from "lucide-react";
import { Mission } from "@/lib/strapi";
import { Card } from "@/src/app/[locale]/about/card";

interface MissionVisionCardsClientProps {
    missions: Mission[] | undefined;
}

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
    Users,
    Telescope,
    Wand2,
};

export const MissionVisionCardsClient: React.FC<
    MissionVisionCardsClientProps
> = ({ missions }) => {
    return (
        <div
            className="p-8 py-8 items-center justify-center grid
        grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:px-8 "
        >
            {missions?.map((mission, index) => {
                // Get the icon component from the mapping
                const IconComponent = mission.icon
                    ? iconMap[mission.icon]
                    : Users;

                return (
                    <Card
                        key={mission.id}
                        icon={IconComponent}
                        iconSrc={mission.iconSrc}
                        title={mission.title}
                        description={mission.description}
                        className="hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-3xl"
                    />
                );
            })}
        </div>
    );
};
