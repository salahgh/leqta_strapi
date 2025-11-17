import React from "react";
import { Link } from "@/src/i18n/navigation";
import Image from "next/image";
import { Article } from "@/lib/strapi";

interface ArticleCardProps {
    article: Article;
    variant?: "default" | "featured" | "horizontal";
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
    article,
    variant = "default",
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (variant === "featured") {
        return (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {article.featured_image && (
                    <div className="relative h-64 md:h-80 w-full">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${article.featured_image.url}`}
                            alt={
                                article.featured_image.alternativeText ||
                                article.title
                            }
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="p-6 md:p-8">
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                        <span>{formatDate(article.publishedAt)}</span>
                        <span className="mx-2">•</span>
                        <span>{article.read_time} min read</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        <Link
                            href={`/articles/${article.slug}`}
                            className="hover:text-blue-600 transition-colors"
                        >
                            {article.title}
                        </Link>
                    </h2>
                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                        {article.excerpt}
                    </p>
                    <Link
                        href={`/articles/${article.slug}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
                    >
                        Read Full Article
                    </Link>
                </div>
            </div>
        );
    }

    if (variant === "horizontal") {
        return (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-shadow">
                {article.featured_image && (
                    <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${article.featured_image.url}`}
                            alt={
                                article.featured_image.alternativeText ||
                                article.title
                            }
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                        <div className="flex items-center text-gray-500 text-sm mb-2">
                            <span>{formatDate(article.publishedAt)}</span>
                            <span className="mx-2">•</span>
                            <span>{article.read_time} min read</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                            <Link
                                href={`/articles/${article.slug}`}
                                className="hover:text-blue-600 transition-colors"
                            >
                                {article.title}
                            </Link>
                        </h3>
                        <p className="text-gray-700 text-base mb-4 leading-relaxed">
                            {article.excerpt}
                        </p>
                    </div>
                    <Link
                        href={`/articles/${article.slug}`}
                        className="text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm inline-flex items-center"
                    >
                        Read more →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
            {article.featured_image && (
                <div className="relative h-48 w-full">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${article.featured_image.url}`}
                        alt={
                            article.featured_image.alternativeText ||
                            article.title
                        }
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                    <span>{formatDate(article.publishedAt)}</span>
                    <span className="mx-2">•</span>
                    <span>{article.read_time} min read</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3 flex-1">
                    <Link
                        href={`/articles/${article.slug}`}
                        className="hover:text-blue-600 transition-colors"
                    >
                        {article.title}
                    </Link>
                </h4>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
                    {article.excerpt}
                </p>
                <Link
                    href={`/articles/${article.slug}`}
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm inline-flex items-center mt-auto"
                >
                    Read more →
                </Link>
            </div>
        </div>
    );
};
