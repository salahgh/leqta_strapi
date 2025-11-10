import { Link } from "@/src/i18n/navigation";
import React from "react";

interface NavLinkProps {
    href?: string;
    children: React.ReactNode;
    className?: string;
    isActive?: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({
    href = "#",
    children,
    className = "",
    isActive = false,
}) => {
    return (
        <Link
            href={href}
            className={`
        text-[16px] font-medium leading-none
        transition-all duration-200 ease-in-out
        ${isActive ? "text-brand-aqua" : "text-white hover:text-brand-aqua"}
        ${className}
      `}
        >
            {children}
        </Link>
    );
};
