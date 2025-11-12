import React from "react";
import { Logo } from "@/components/ui/Logo";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { socialMediaApi, SocialMedia } from "@/lib/strapi";

interface FooterProps {
    locale: string;
}

const Footer = async ({ locale }: FooterProps) => {
    const t = await getTranslations('footer');

    // Fetch social media links from Strapi
    let socialMediaLinks: SocialMedia[] = [];
    try {
        const response = await socialMediaApi.getAll({
            sort: "order:asc",
            locale: locale,
        });
        socialMediaLinks = response.data;
    } catch (error) {
        console.error("Failed to fetch social media links:", error);
        // Fallback to empty array - component will handle gracefully
    }

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

                                <NewsletterForm variant="footer" />
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
                                        <a
                                            href="/#works"
                                            className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                                        >
                                            {t('ourWorks')}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/#testimonials"
                                            className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                                        >
                                            {t('testimonials')}
                                        </a>
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
                                        <a
                                            href="/#faq"
                                            className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                                        >
                                            {t('faq')}
                                        </a>
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
                            {socialMediaLinks.length > 0 ? (
                                socialMediaLinks.map((social) => (
                                    <a
                                        key={social.id}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                                        style={{
                                            backgroundColor: social.backgroundColor || "#1787ba",
                                            width: 35,
                                            height: 35,
                                        }}
                                        aria-label={social.ariaLabel || `Visit our ${social.platform} page`}
                                    >
                                        {social.icon && (
                                            <img
                                                src={social.icon}
                                                alt={social.platform}
                                                className="w-5 h-5"
                                            />
                                        )}
                                    </a>
                                ))
                            ) : (
                                /* Fallback: show default icons if no data from CMS */
                                <>
                                    <a
                                        href="#"
                                        className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                                        style={{ backgroundColor: "#1787ba", width: 35, height: 35 }}
                                        aria-label="Social media"
                                    >
                                        <img src="/icons/socialicon.svg" alt="Social" className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                                        style={{ backgroundColor: "#1787ba", width: 35, height: 35 }}
                                        aria-label="Facebook"
                                    >
                                        <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                                        style={{ backgroundColor: "#1787ba", width: 35, height: 35 }}
                                        aria-label="Instagram"
                                    >
                                        <img src="/icons/instagram.svg" alt="Instagram" className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                                        style={{ backgroundColor: "#1787ba", width: 35, height: 35 }}
                                        aria-label="LinkedIn"
                                    >
                                        <img src="/icons/linkedIn.svg" alt="LinkedIn" className="w-5 h-5" />
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
