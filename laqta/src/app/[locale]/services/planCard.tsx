// Plan Card Component
import { Check } from "lucide-react";
import React from "react";
import { Link } from "@/src/i18n/navigation";

interface PlanCardProps {
    title: string;
    description: string;
    price?: string;
    buttonText: string;
    buttonColor: string;
    features?: string[];
    equipment?: string[];
    gradient: string;
    frameId?: string;
}

export const PlanCard = ({
    title,
    description,
    price,
    buttonText,
    buttonColor,
    features,
    equipment,
    gradient,
    frameId,
}: PlanCardProps) => (
    <div
        className={`relative rounded-2xl p-4 ${gradient} border border-gray-700 h-full hover:border-gray-600 transition-all duration-300`}
    >
        <div className="flex flex-col h-full">
            <h3 className="font-bold text-white ">{title}</h3>
            <p className="text-gray-300 leading-relaxed">{description}</p>

            {features && (
                <div className="mb-8">
                    <h4 className="text-white font-semibold mb-4">
                        What's Included
                    </h4>
                    <ul className="space-y-3">
                        {features.map((feature, index) => (
                            <li key={index} className="text-gray-300 text-sm">
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {equipment && (
                <div className="mb-8">
                    <h4 className="text-white font-semibold mb-4">
                        Equipment Included
                    </h4>
                    <ul className="space-y-2">
                        {equipment.map((item, index) => (
                            <li
                                key={index}
                                className="flex items-center text-gray-300 text-sm"
                            >
                                <Check className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={"border-separate flex-1"}></div>
            <div className={"border border-gray-500 w-full"}></div>
            <div className="flex items-center justify-between mt-auto p-4 pt-8 ">
                {price && (
                    <div className="text-white text-2xl font-bold">{price}</div>
                )}
                <div className={"flex-1"}></div>
                <Link href="/contact">
                    <button
                        className={`px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 ${buttonColor}`}
                    >
                        {buttonText}
                    </button>
                </Link>
            </div>
        </div>
    </div>
);
