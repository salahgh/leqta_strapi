import React from "react";
import { Logo } from "@/components/ui/Logo";
import EmailSubscriptionForm from "@/components/ui/EmailSubscriptionForm";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";

const Footer = () => {
    const t = useTranslations('footer');
    
    return (
        <div className="bg-gray-100">
            {/* Main content area - light gray background */}

            {/* Footer */}
            <footer className="bg-slate-900 text-white px-6 py-16">
                <div>
                    <div className="flex  md:flex-row flex-col justify-between p-16">
                        {/* Left - Logo and Newsletter */}
                        <div className="lg:col-span-1 invisible md:visible">
                            {/* Logo */}
                            <Logo />

                            <div className={"mt-12"}>
                                <h3 className="font-semibold mb-2 text-body-xl">
                                    {t('newsletter')}
                                </h3>
                                <p
                                    className=" mb-6"
                                    style={{ fontSize: 16, color: "#D9D9D9" }}
                                >
                                    {t('newsletterDescription')}
                                </p>

                                <EmailSubscriptionForm />
                            </div>
                        </div>

                        {/* Middle - Company Links */}
                        <div className={"flex md:flex-col flex-row gap-16"}>
                            <div className="lg:col-span-1">
                                <h3 className="text-lg font-semibold mb-6">
                                    {t('company')}
                                </h3>
                                <ul className="space-y-4">
                                    <li>
                                        <Link
                                            href="/about"
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {t('aboutUs')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/services"
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {t('ourServices')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/#works"
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {t('ourWorks')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/#testimonials"
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {t('testimonials')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/contact"
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {t('contactUs')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/#faq"
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {t('faq')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/blog"
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {t('blog')}
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Right - Utility Pages */}
                            <div className="lg:col-span-1">
                                <h3 className="text-lg font-semibold mb-6">
                                    {t('utilityPages')}
                                </h3>
                                <ul className="space-y-4">
                                    <li>
                                        <Link
                                            href="/PrivacyPolicy"
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {t('termsCondition')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/PrivacyPolicy"
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {t('privacyPolicy')}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Large LEQTA text */}
                    <div className="mb-16 w-full flex justify-center mt-40">
                        <img src="/images/laqta_1.svg" alt="Logo" />
                    </div>

                    {/* Bottom section with copyright and social icons */}
                    <div
                        className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white"
                        style={{ marginTop: -100 }}
                    >
                        <p className="text-gray-400 text-body-md mb-4 md:mb-0">
                            {t('copyright')}
                        </p>

                        {/* Social Media Icons */}
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
                                style={{
                                    backgroundColor: "#1787ba",
                                    width: 35,
                                    height: 35,
                                }}
                            >
                                <img src="/icons/socialicon.svg" alt="Logo" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
                                style={{
                                    backgroundColor: "#1787ba",
                                    width: 35,
                                    height: 35,
                                }}
                            >
                                <img src="/icons/facebook.svg" alt="Logo" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
                                style={{
                                    backgroundColor: "#1787ba",
                                    width: 35,
                                    height: 35,
                                }}
                            >
                                <img src="/icons/instagram.svg" alt="Logo" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                                style={{
                                    backgroundColor: "#1787ba",
                                    width: 35,
                                    height: 35,
                                }}
                            >
                                <img src="/icons/linkedIn.svg" alt="Logo" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
