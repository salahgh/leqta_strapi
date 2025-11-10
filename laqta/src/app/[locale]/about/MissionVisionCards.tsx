import React from "react";
import { Mission, missionsApi } from "@/lib/strapi";
import { MissionVisionCardsClient } from "@/src/app/[locale]/about/MissionVisionCardsClient";

const MissionVisionCards = async () => {
    // let missions = defaultMissions;
    let missions: Mission[] | undefined = undefined;

    try {
        const response = await missionsApi.getAll({
            sort: "order:asc",
            pageSize: 10,
        });

        if (response.data && response.data.length > 0) {
            missions = response.data;
        }
    } catch (error) {
        console.warn(
            "Failed to fetch missions from Strapi, using default data:",
            error,
        );
    }

    return <MissionVisionCardsClient missions={missions} />;
};

export default MissionVisionCards;
