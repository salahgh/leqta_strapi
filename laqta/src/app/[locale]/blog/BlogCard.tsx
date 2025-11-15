import React from "react";
import { Link } from "@/src/i18n/navigation";
import Image from "next/image";
import { Blog, utils } from "@/lib/strapi";
import { SocialShare } from "./SocialShare";

interface BlogCardProps {
    blog: Blog;
    variant?: "default" | "featured" | "horizontal" | "grid" | "grid-with-logo";
    className?: string;
    locale?: string;
}

interface BadgeProps {
    children: React.ReactNode;
    color?: string;
    className?: string;
}

interface MetaItemProps {
    icon: React.ReactNode;
    text: string;
}

// Reusable Badge Component
const Badge: React.FC<BadgeProps> = ({ children, color, className = "" }) => (
    <span
        className={`px-3 py-1 text-body-xs font-bold text-white rounded-full backdrop-blur-sm shadow-md border border-white/20 ${className}`}
        style={{
            backgroundColor: color ? `${color}dd` : "rgba(0, 0, 0, 0.5)",
            boxShadow: color ? `0 2px 10px ${color}30` : "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
    >
        {children}
    </span>
);

// Reusable Meta Item Component
const MetaItem: React.FC<MetaItemProps> = ({ icon, text }) => (
    <div className="flex items-center space-x-1">
        {icon}
        <span className="text-body-xs font-medium">{text}</span>
    </div>
);

// Date formatting utility with locale support
const formatDate = (dateString: string, locale: string = "en"): string => {
    const localeMap: Record<string, string> = {
        en: "en-US",
        ar: "ar-SA",
        fr: "fr-FR",
    };

    return new Date(dateString).toLocaleDateString(localeMap[locale] || "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

// Icon components
const CalendarIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
        />
    </svg>
);

const ClockIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
        />
    </svg>
);

const EyeIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
        />
    </svg>
);

const GalleryIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
        />
    </svg>
);

const ArrowRightIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
        />
    </svg>
);

// Featured Blog Card Component
const FeaturedBlogCard: React.FC<{ blog: Blog; blogUrl: string; locale?: string }> = ({ blog, blogUrl, locale = "en" }) => (
    <article className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

        {/* Featured Image */}
        {blog.featured_image && (
            <div className="relative h-72 md:h-80 w-full overflow-hidden">
                <Image
                    src={utils.getFileUrl(blog.featured_image.url)}
                    alt={blog.featured_image.alternativeText || blog.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
                
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                
                {/* Category Badge */}
                {blog.category && (
                    <div className="absolute top-6 left-6 z-20">
                        <Badge color={blog.category.color} className="px-4 py-2 text-sm hover:scale-105 transition-transform duration-300">
                            {blog.category.name}
                        </Badge>
                    </div>
                )}
                
                {/* Reading Time Badge */}
                {blog.read_time && (
                    <div className="absolute top-6 right-6 z-20">
                        <Badge className="px-3 py-1">
                            {blog.read_time} min read
                        </Badge>
                    </div>
                )}
                
                {/* Gallery Indicator */}
                {blog.gallery && blog.gallery.length > 0 && (
                    <div className="absolute bottom-4 right-4 z-20">
                        <div className="flex items-center space-x-1 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full border border-white/20">
                            <GalleryIcon className="text-white" />
                            <span className="text-body-xs font-semibold text-white">
                                +{blog.gallery.length}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Content */}
        <div className="relative z-20 p-8">
            {/* Meta Information */}
            <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                <div className="flex items-center space-x-4">
                    <MetaItem
                        icon={<CalendarIcon className="w-4 h-4" />}
                        text={formatDate(blog.publishedAt, locale)}
                    />
                    {blog.views && (
                        <MetaItem 
                            icon={<EyeIcon className="w-4 h-4" />} 
                            text={`${blog.views} views`} 
                        />
                    )}
                </div>
                <SocialShare url={blogUrl} title={blog.title} />
            </div>

            {/* Title */}
            <h3 className="text-display-sm md:text-display-md lg:text-display-lg font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                <Link
                    href={blogUrl}
                    className="hover:underline decoration-2 underline-offset-4"
                >
                    {blog.title}
                </Link>
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 text-responsive-md mb-8 leading-relaxed line-clamp-3">
                {blog.excerpt}
            </p>

            {/* Author and CTA */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {blog.author?.avatar && (
                        <div className="relative">
                            <Image
                                src={utils.getFileUrl(blog.author.avatar.url)}
                                alt={blog.author.name || "Author"}
                                width={48}
                                height={48}
                                className="rounded-full ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-300"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                        </div>
                    )}
                    <div>
                        <p className="text-body-sm font-semibold text-gray-900">
                            {blog.author?.name || "Anonymous"}
                        </p>
                        <p className="text-body-xs text-gray-500">Author</p>
                    </div>
                </div>

                <Link
                    href={blogUrl}
                    className="group/btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2"
                >
                    <span>Read Article</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Link>
            </div>
        </div>
    </article>
);

// Grid Blog Card Component (for blog list page)
const GridBlogCard: React.FC<{ blog: Blog; blogUrl: string; locale?: string }> = ({ blog, blogUrl, locale = "en" }) => (
    <Link href={blogUrl} className="block group">
        <article className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col hover:-translate-y-1 border border-gray-100 hover:border-blue-200">
            {/* Featured Image */}
            {blog.featured_image && (
                <div className="relative h-56 md:h-60 w-full overflow-hidden">
                    <Image
                        src={utils.getFileUrl(blog.featured_image.url)}
                        alt={blog.featured_image.alternativeText || blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                    />

                    {/* Category Badge */}
                    {blog.category && (
                        <div className="absolute top-4 left-4 z-10">
                            <span
                                className="px-3 py-1.5 text-xs font-semibold text-white rounded-full"
                                style={{ backgroundColor: blog.category.color || "#7C3AED" }}
                            >
                                {blog.category.name}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-2 flex-grow">
                    {blog.excerpt}
                </p>

                {/* Author & Meta */}
                <div className="flex items-center text-sm text-gray-500">
                    {blog.author?.avatar && (
                        <Image
                            src={utils.getFileUrl(blog.author.avatar.url)}
                            alt={blog.author.name || "Author"}
                            width={32}
                            height={32}
                            className="rounded-full mr-3"
                        />
                    )}
                    <span className="font-medium text-gray-700 mr-2">
                        {blog.author?.name || "Anonymous"}
                    </span>
                    <span className="mx-1">•</span>
                    <span>{formatDate(blog.publishedAt, locale)}</span>
                    {blog.read_time && (
                        <>
                            <span className="mx-1">•</span>
                            <span>{blog.read_time} min read</span>
                        </>
                    )}
                </div>
            </div>
        </article>
    </Link>
);

// Grid Blog Card with Logo Background
const GridBlogCardWithLogo: React.FC<{ blog: Blog; blogUrl: string; locale?: string }> = ({ blog, blogUrl, locale = "en" }) => (
    <Link href={blogUrl} className="block group">
        <article className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col hover:-translate-y-1 border border-gray-100 hover:border-blue-200">
            {/* LAQTA Logo Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 group-hover:opacity-[0.05] transition-opacity duration-500">
                <Image
                    src="/images/logo.svg"
                    alt="LAQTA"
                    fill
                    className="object-contain p-8"
                />
            </div>

            {/* Featured Image */}
            {blog.featured_image && (
                <div className="relative h-56 md:h-60 w-full overflow-hidden z-10">
                    <Image
                        src={utils.getFileUrl(blog.featured_image.url)}
                        alt={blog.featured_image.alternativeText || blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                    />

                    {/* Category Badge */}
                    {blog.category && (
                        <div className="absolute top-4 left-4 z-20">
                            <span
                                className="px-3 py-1.5 text-xs font-semibold text-white rounded-full"
                                style={{ backgroundColor: blog.category.color || "#7C3AED" }}
                            >
                                {blog.category.name}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 p-6 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-2 flex-grow">
                    {blog.excerpt}
                </p>

                {/* Author & Meta */}
                <div className="flex items-center text-sm text-gray-500">
                    {blog.author?.avatar && (
                        <Image
                            src={utils.getFileUrl(blog.author.avatar.url)}
                            alt={blog.author.name || "Author"}
                            width={32}
                            height={32}
                            className="rounded-full mr-3"
                        />
                    )}
                    <span className="font-medium text-gray-700 mr-2">
                        {blog.author?.name || "Anonymous"}
                    </span>
                    <span className="mx-1">•</span>
                    <span>{formatDate(blog.publishedAt, locale)}</span>
                    {blog.read_time && (
                        <>
                            <span className="mx-1">•</span>
                            <span>{blog.read_time} min read</span>
                        </>
                    )}
                </div>
            </div>
        </article>
    </Link>
);

// Default Blog Card Component (keeping for backward compatibility)
const DefaultBlogCard: React.FC<{ blog: Blog; blogUrl: string; locale?: string }> = ({ blog, blogUrl, locale = "en" }) => (
    <GridBlogCard blog={blog} blogUrl={blogUrl} locale={locale} />
);

// Horizontal Blog Card Component (for "You Might Also Like" section)
const HorizontalBlogCard: React.FC<{ blog: Blog; blogUrl: string; locale?: string }> = ({ blog, blogUrl, locale = "en" }) => (
    <Link href={blogUrl} className="block group">
        <article className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex h-full hover:-translate-y-0.5 border border-gray-100 hover:border-blue-200">
            {/* Featured Image */}
            {blog.featured_image && (
                <div className="relative w-40 md:w-48 flex-shrink-0 overflow-hidden">
                    <Image
                        src={utils.getFileUrl(blog.featured_image.url)}
                        alt={blog.featured_image.alternativeText || blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 160px, 192px"
                        loading="lazy"
                    />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                    {/* Category Badge */}
                    {blog.category && (
                        <div className="mb-3">
                            <span
                                className="inline-block px-3 py-1 text-xs font-semibold rounded-full text-white"
                                style={{ backgroundColor: blog.category.color || "#7C3AED" }}
                            >
                                {blog.category.name}
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <h4 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {blog.title}
                    </h4>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                        {blog.excerpt}
                    </p>
                </div>

                {/* Meta */}
                <div className="flex items-center text-sm text-gray-500">
                    <span>{formatDate(blog.publishedAt, locale)}</span>
                    {blog.read_time && (
                        <>
                            <span className="mx-2">•</span>
                            <span>{blog.read_time} min read</span>
                        </>
                    )}
                </div>
            </div>
        </article>
    </Link>
);

// Main BlogCard Component
export const BlogCard: React.FC<BlogCardProps> = ({
    blog,
    variant = "default",
    className = "",
    locale = "en"
}) => {
    // Link component from @/src/i18n/navigation handles locale automatically
    const blogUrl = `/blog/articles/${blog.slug}`;

    // Render based on variant
    const renderCard = () => {
        switch (variant) {
            case "featured":
                return <FeaturedBlogCard blog={blog} blogUrl={blogUrl} locale={locale} />;
            case "horizontal":
                return <HorizontalBlogCard blog={blog} blogUrl={blogUrl} locale={locale} />;
            case "grid":
                return <GridBlogCard blog={blog} blogUrl={blogUrl} locale={locale} />;
            case "grid-with-logo":
                return <GridBlogCardWithLogo blog={blog} blogUrl={blogUrl} locale={locale} />;
            default:
                return <DefaultBlogCard blog={blog} blogUrl={blogUrl} locale={locale} />;
        }
    };

    return (
        <div className={className}>
            {renderCard()}
        </div>
    );
};

export default BlogCard;
