import React from "react";

export const Card = ({
    icon: IconComponent,
    iconSrc,
    title,
    description,
    className = "",
}) => {
    return (
        <div
            className={`aspect-square relative bg-gray-100 rounded-2xl shadow-2xl p-6 m-4 flex flex-col items-center justify-center text-center overflow-hidden ${className}`}
        >
            {/* Background Logo - Smaller and positioned higher */}
            <div
                className="absolute z-0 flex flex-col justify-start items-center"
                style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}
            >
                <img
                    src="/images/laqta_logo_courbe.svg"
                    alt="LAQTA Logo Curve"
                    className="w-1/2 aspect-square object-fill z-0 opacity-15"
                />
            </div>
            
            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center text-center h-full justify-center space-y-4">
                <div className="flex items-center justify-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white/30">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center">
                            {/*{iconSrc ? (*/}
                            {/*    <img*/}
                            {/*        src={iconSrc}*/}
                            {/*        alt={title}*/}
                            {/*        className="w-8 h-8 filter brightness-0 invert"*/}
                            {/*    />*/}
                            {/*) : (*/}
                            {/*    <IconComponent className="w-8 h-8 text-white" />*/}
                            {/*)}*/}
                        </div>
                    </div>
                </div>
                {/* Title - Bigger and Bolder */}
                <h2 className="text-gray-900 text-2xl font-bold mb-3 leading-tight">{title}</h2>
                {/* Description */}
                <p className="leading-relaxed text-responsive-lg text-gray-700 text-center px-2">{description}</p>
            </div>
        </div>
    );
};