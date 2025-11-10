import React from "react";

export const ProfileAvatar = ({ position }) => {
    return (
        <div className={`absolute ${position}`}>
            <div className="w-12 h-12 bg-white rounded-full p-1">
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {/* Person avatar */}
                    <div className="w-6 h-6 bg-orange-300 rounded-full"></div>
                    {/* Dog avatar */}
                    <div className="w-6 h-6 bg-gray-600 rounded-full ml-1"></div>
                </div>
            </div>
        </div>
    );
};