import { Navigation } from "@/src/app/[locale]/services/navigation";
import React from "react";
import { Header } from "@/src/app/[locale]/services/header";
import { PlanCard } from "@/src/app/[locale]/services/planCard";
import { Navigation as Navigation_ } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";

export const metadata = {
    title: "Services | Laqta",
};

// Main Component
const BasicProductionPage = () => {
    const basicPlanFeatures = [
        "Filming of 5 content pieces",
        "1 full day of shooting",
        "Basic editing for all 5 videos (cutting, transitions, basic color correction, music/logo overlay)",
    ];

    const basicPlanEquipment = [
        "Professional Camera",
        "Stabilizer (Gimbal + Tripod)",
        "Softbox Light + RGB Tube Light",
        "Wireless Microphone Kit (2 transmitters)",
    ];

    const premiumPlanFeatures = [
        "More than 5 video content pieces",
        "Multi-day filming sessions",
        "Additional equipment (e.g., drone, sliders, multi-cam setup)",
        "Storyboard development and scripting",
        "Advanced editing (motion graphics, subtitling, brand animation)",
    ];

    return (
        <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex justify-center items-center">
            <div className="">
                <Navigation_></Navigation_>
                <div className={"space-y-8"}>
                    <Navigation />
                    <Header />
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8 md:px-16 px-4">
                    {/* Basic Plan */}
                    <PlanCard
                        frameId="Frame 170480111"
                        title="Basic Plan"
                        description="Ideal for brands needing a simple, fast production for a small batch of video content."
                        price="126,900 DZD"
                        buttonText="Get Started"
                        buttonColor="bg-blue-500 hover:bg-blue-600 text-white"
                        features={basicPlanFeatures}
                        equipment={basicPlanEquipment}
                        gradient="bg-gradient-to-br from-gray-800 to-gray-900"
                    />

                    {/* Premium Plan */}
                    <PlanCard
                        title="Premium Plan"
                        description="Brands with larger content needs, creative ambitions, or advanced technical requirements. This plan is 100% customized to your brand, objectives, and creative vision. We design the content, structure, and production workflow with your brand team."
                        buttonText="Contact Us"
                        buttonColor="bg-teal-500 hover:bg-teal-600 text-white"
                        features={premiumPlanFeatures}
                        gradient="bg-gradient-to-br from-purple-800 via-pink-700 to-purple-900"
                        price={undefined}
                        equipment={undefined}
                        frameId={undefined}
                    />
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default BasicProductionPage;
