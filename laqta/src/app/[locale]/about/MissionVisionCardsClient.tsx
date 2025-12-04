"use client";

import React from "react";
import { Telescope, Users, Wand2, LucideIcon, Target } from "lucide-react";
import { Mission } from "@/lib/strapi";
import { Card } from "@/src/app/[locale]/about/card";
import { Badge } from "@/components/ui/Badge";

interface MissionVisionCardsClientProps {
    missions: Mission[] | undefined;
}

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
    Users,
    Telescope,
    Wand2,
    Target,
};

export const MissionVisionCardsClient: React.FC<
    MissionVisionCardsClientProps
> = ({ missions }) => {
    return (
        <section className="py-12 md:py-16 px-4 md:px-8">
            {/* Section Header */}
            <div className="text-center space-y-4 mb-12 max-w-3xl mx-auto animate-fade-in" style={{ opacity: 0 }}>
                <div className="flex justify-center animate-slide-down" style={{ opacity: 0 }}>
                    <Badge size="sm" variant="default">Our Foundation</Badge>
                </div>
                <h2 className="text-white font-bold animate-slide-up" style={{ animationDelay: "150ms", opacity: 0 }}>
                    Mission, Vision & Values
                </h2>
                <p className="text-gray-300 text-responsive-lg leading-relaxed animate-fade-in" style={{ animationDelay: "300ms", opacity: 0 }}>
                    Discover what drives us to create exceptional content and deliver outstanding results for our clients.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="items-center justify-center grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
                {missions?.map((mission, index) => {
                    // Get the icon component from the mapping
                    const IconComponent = mission.icon
                        ? iconMap[mission.icon]
                        : Users;

                    return (
                        <div
                            key={mission.id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${450 + index * 150}ms`, opacity: 0 }}
                        >
                            <Card
                                icon={IconComponent}
                                iconSrc={mission.iconSrc}
                                title={mission.title}
                                description={mission.description}
                                className=""
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
