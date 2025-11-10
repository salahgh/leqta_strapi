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
        const pathWithoutLocale = pathname.replace(/^\/(en|ar|fr)/, '');
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

    return (
        <>
            <nav
                className={`
                    fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out flex items-center justify-between
                    text-responsive-md
                    ${
                        scrolled
                            ? "shadow-lg bg-primary opacity-80 backdrop-blur-md  border-blue-700/30 h-14 md:h-16 glassmorphism"
                            : "md:h-[90px] h-[60px]"
                    }
                    ${className}

                `}
            >
                {/* Desktop Navigation */}
                <div
                    className="hidden xl:flex items-center justify-between mx-auto px-6 xl:px-8 h-full py-3"
                    style={{ width: 1512 }}
                >
                    <div className="transition-all duration-300 hidden md:block">
                        <Logo />
                    </div>

                    {/* Navigation Links - Desktop */}
                    <div className="flex items-center gap-8 h-full ">
                        <div
                            className="flex items-center justify-center gap-8 rounded-full border border-white/20 px-8 bg-white/5 backdrop-blur-sm
                         h-full
                        "
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
                                                text-white/90 hover:text-white md:h-32
                                                ${
                                                    isActive
                                                        ? "text-white"
                                                        : "hover:bg-white/10"
                                                }
                                            `}
                                        >
                                            {item.label}
                                            {/*{isActive && (*/}
                                            {/*    <div className="hidden absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse" />*/}
                                            {/*)}*/}
                                        </NavLink>
                                        {isActive && (
                                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-bounce" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <LanguageSelector className={"flex"} />
                    </div>

                    <div className="flex items-center  h-full">
                        <Link href="/contact">
                            <Button
                                leftIcon={null}
                                rightIcon={<Rocket className="ml-2 h-4 w-4" />}
                                className=""
                            >
                                {t("getStarted")}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex xl:hidden items-center justify-between px-4 w-full h-full">
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
                    <div className="flex items-center gap-3 h-full py-2">
                        <LanguageSelector className="flex h-full" />
                        <Link href="/contact">
                            <Button
                                leftIcon={null}
                                rightIcon={<Rocket className="ml-1 h-3 w-3" />}
                                className=""
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
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
                    onClick={closeDrawer}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Left Drawer */}
            <div
                className={`
                    fixed left-0 top-0 z-50 h-full w-80 transform transition-all duration-300 ease-out lg:hidden
                    bg-gradient-to-b from-gray-900 to-gray-800 backdrop-blur-xl border-r border-gray-700/50
                    ${isDrawerOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
                `}
            >
                <div className="flex h-full flex-col">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between border-b border-gray-700/50 p-6 bg-gray-800/50">
                        <Logo />
                        <button
                            onClick={closeDrawer}
                            className="p-2 rounded-full hover:bg-gray-700/50 transition-colors duration-200"
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-1 py-6 overflow-y-auto">
                        <div className="flex flex-col">
                            {navItems.map((item, index) => {
                                const isActive = isActiveRoute(item.href);
                                return (
                                    <div
                                        key={item.label}
                                        className="px-6 mb-2"
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                    >
                                        <div onClick={closeDrawer}>
                                            <NavLink
                                                href={item.href}
                                                isActive={isActive}
                                                className={`
                                                    group relative flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300
                                                    ${
                                                        isActive
                                                            ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border border-blue-500/30 shadow-lg"
                                                            : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                                    }
                                                `}
                                            >
                                                <div className="flex items-center">
                                                    <span className="text-lg font-medium">
                                                        {item.label}
                                                    </span>
                                                    {isActive && (
                                                        <div className="ml-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                                    )}
                                                </div>
                                                <ChevronRight
                                                    className={`h-5 w-5 transition-all duration-300 ${
                                                        isActive
                                                            ? "text-blue-400"
                                                            : "text-gray-500 group-hover:text-white group-hover:translate-x-1"
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
                    <div className="border-t border-gray-700/50 p-6 bg-gray-800/30">
                        <div className="flex flex-col gap-4">
                            <LanguageSelector className="flex w-full" />
                            <div onClick={closeDrawer}>
                                <Link href="/contact">
                                    <Button
                                        size="lg"
                                        leftIcon={null}
                                        rightIcon={<Rocket className="ml-2 h-4 w-4" />}
                                    >
                                        {t("getStarted")}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer for fixed navigation */}
            <div
                className={`transition-all duration-300 ${scrolled ? "h-20" : "h-[105px]"} hidden lg:block`}
            />
            <div className="h-[70px] lg:hidden" />
        </>
    );
};
