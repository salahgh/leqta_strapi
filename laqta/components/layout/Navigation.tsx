"use client";

import { Logo } from "@/components/ui/Logo";
import { NavLink } from "@/components/ui/NavLink";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { Button } from "@/components/ui/Button";
import { Rocket, Menu, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import "../../src/app/styles.css";

interface NavigationProps {
    className?: string;
}

interface NavItem {
    label: string;
    href: string;
}

export const Navigation = ({ className = "" }: NavigationProps) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState<boolean>(false);
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations("navigation");

    const navItems: NavItem[] = [
        { label: t("home"), href: "/" },
        { label: t("about"), href: "/about" },
        { label: t("services"), href: "/services" },
        { label: t("blog"), href: "/blog" },
        { label: t("contact"), href: "/contact" },
    ];

    // Function to check if a nav item is active
    const isActiveRoute = (href: string): boolean => {
        if (href === "/") {
            return pathname === "/" || pathname === `/${locale}`;
        }
        const pathWithoutLocale = pathname.replace(/^\/(en|ar|fr)/, "");
        return pathWithoutLocale === href;
    };

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = (): void => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleDrawer = (): void => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const closeDrawer = (): void => {
        setIsDrawerOpen(false);
    };

    // Close drawer on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent): void => {
            if (e.key === "Escape") {
                closeDrawer();
            }
        };
        if (isDrawerOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isDrawerOpen]);

    console.log("scrolled", scrolled);

    return (
        <>
            <nav
                className={`
                fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out flex items-center justify-between
                text-responsive-md
                ${
                    scrolled
                        ? "bg-primary backdrop-blur-md border-blue-700/30 nav-h-scrolled glassmorphism"
                        : "nav-h"
                }
                ${className}
            `}
            >
                {/* Desktop Navigation */}
                <div
                    className={`hidden transition-all xl:flex items-center justify-between mx-auto px-6 xl:px-8 2xl:px-12 h-full ${
                        scrolled ? "py-1" : "py-4"
                    }  w-full max-w-container`}
                >
                    <div className="transition-all duration-300 hidden md:block">
                        <Logo />
                    </div>
                    {/*Navigation Links - Desktop*/}
                    <div
                        className={`flex items-center h-full ${locale === "fr" ? "gap-4" : "gap-8"}`}
                    >
                        <div
                            className={`flex items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm h-full
                            ${locale === "fr" ? "gap-4 px-5" : "gap-8 px-8"}
                        `}
                        >
                            {navItems.map((item) => {
                                const isActive = isActiveRoute(item.href);
                                return (
                                    <div key={item.label} className="relative ">
                                        <NavLink
                                            href={item.href}
                                            isActive={isActive}
                                            className={`
                                                relative padding-responsive-sm rounded-full transition-all duration-300 ease-in-out
                                                text-white/90 hover:text-white md:h-36
                                                ${locale === "fr" ? "text-sm xl:text-base" : ""}
                                                ${
                                                    isActive
                                                        ? "text-white font-semibold brightness-110"
                                                        : "hover:bg-white/10"
                                                }
                                            `}
                                        >
                                            {item.label}
                                        </NavLink>
                                        {isActive && (
                                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-bounce" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <LanguageSelector className={"flex"} />
                    </div>
                    <div className="flex items-center h-full">
                        <Link href="/contact">
                            <Button
                                leftIcon={null}
                                rightIcon={<Rocket className="ml-2 h-4 w-4" />}
                                className=""
                                size={scrolled ? "lg" : "xl"}
                            >
                                {t("getStarted")}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex xl:hidden items-center justify-between px-4 my-4 w-full h-full">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleDrawer}
                        className="relative z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                        aria-label="Toggle menu"
                    >
                        <div className="relative w-6 h-6">
                            <Menu
                                className={`absolute inset-0 text-white transition-all duration-300 ${
                                    isDrawerOpen
                                        ? "opacity-0 rotate-180"
                                        : "opacity-100 rotate-0"
                                }`}
                            />
                            <X
                                className={`absolute inset-0 text-white transition-all duration-300 ${
                                    isDrawerOpen
                                        ? "opacity-100 rotate-0"
                                        : "opacity-0 -rotate-180"
                                }`}
                            />
                        </div>
                    </button>

                    {/* Mobile Right Section */}
                    <div className="flex items-center gap-3 h-full">
                        <div className={"h-16"}>
                            <LanguageSelector className="flex h-full w-full" />
                        </div>
                        <Link href="/contact">
                            <Button
                                leftIcon={null}
                                rightIcon={<Rocket className="ml-1 h-3 w-3" />}
                                className=""
                                size={"xl"}
                            >
                                {t("getStarted")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Overlay */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 xl:hidden"
                    onClick={closeDrawer}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Left Drawer */}
            <div
                className={`
                    fixed left-0 top-0 z-50 h-full w-80 transform transition-all duration-300 ease-out xl:hidden
                    bg-gradient-to-b from-primary via-primary-dark to-neutral-900 backdrop-blur-xl border-e border-primary-light/20
                    ${isDrawerOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
                `}
            >
                <div className="flex h-full flex-col">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between border-b border-primary-light/20 p-5 bg-primary/50">
                        <Logo />
                        <button
                            onClick={closeDrawer}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>
                    {/* Navigation Items */}
                    <div className="flex-1 py-4 px-4 overflow-y-auto">
                        <div className="flex flex-col gap-2">
                            {navItems.map((item, index) => {
                                const isActive = isActiveRoute(item.href);
                                return (
                                    <div
                                        key={item.label}
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                    >
                                        <div onClick={closeDrawer}>
                                            <NavLink
                                                href={item.href}
                                                isActive={isActive}
                                                className={`
                                                    group relative flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300
                                                    ${
                                                        isActive
                                                            ? "bg-gradient-to-r from-primary-light/30 to-accent-blue/20 text-white border border-primary-light/30 shadow-lg"
                                                            : "text-neutral-200 hover:text-white hover:bg-white/10"
                                                    }
                                                `}
                                            >
                                                <div className="flex items-center">
                                                    <span className="text-base font-medium">
                                                        {item.label}
                                                    </span>
                                                    {isActive && (
                                                        <div className="ms-3 w-2 h-2 bg-primary-light rounded-full animate-pulse" />
                                                    )}
                                                </div>
                                                <ChevronRight
                                                    className={`h-5 w-5 transition-all duration-300 rtl:rotate-180 ${
                                                        isActive
                                                            ? "text-primary-light"
                                                            : "text-neutral-400 group-hover:text-white group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                                                    }`}
                                                />
                                            </NavLink>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Drawer Footer */}
                    <div className="border-t border-primary-light/20 p-4 bg-primary/30">
                        <div className="flex flex-col gap-3">
                            <div className={"h-16"}>
                                <LanguageSelector className="flex" />
                            </div>
                            <div onClick={closeDrawer}>
                                <Link href="/contact">
                                    <Button
                                        size="lg"
                                        fullWidth
                                        leftIcon={null}
                                        rightIcon={
                                            <Rocket className="ms-2 h-4 w-4" />
                                        }
                                    >
                                        {t("getStarted")}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer for fixed navigation - matches nav height */}
            <div className="h-24" />
        </>
    );
};
