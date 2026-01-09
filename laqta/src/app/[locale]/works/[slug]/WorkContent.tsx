"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslations } from "next-intl";

interface WorkContentProps {
    description: string;
    content?: string;
    category: string;
    metrics?: string;
}

// Reusable markdown components for consistent styling
const markdownComponents = {
    h1: ({ children }: { children: React.ReactNode }) => (
        <h1 className="text-display-md font-bold text-gray-900 mb-4 mt-8">
            {children}
        </h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
        <h2 className="text-display-sm font-bold text-gray-900 mb-3 mt-6">
            {children}
        </h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
        <h3 className="text-body-2xl font-bold text-gray-900 mb-2 mt-4">
            {children}
        </h3>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
        <p className="text-gray-700 text-body-lg leading-relaxed mb-4">
            {children}
        </p>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
        <ul className="list-disc list-inside text-gray-700 text-body-lg mb-4 space-y-2 ml-4">
            {children}
        </ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
        <ol className="list-decimal list-inside text-gray-700 text-body-lg mb-4 space-y-2 ml-4">
            {children}
        </ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
        <li className="text-gray-700">{children}</li>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
        <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
        <em className="italic">{children}</em>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
        <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 my-4">
            {children}
        </blockquote>
    ),
    a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
        <a
            href={href}
            className="text-primary-light hover:underline"
            target="_blank"
            rel="noopener noreferrer"
        >
            {children}
        </a>
    ),
    hr: () => <hr className="my-8 border-gray-200" />,
    code: ({ children }: { children: React.ReactNode }) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-body-md font-mono">
            {children}
        </code>
    ),
    pre: ({ children }: { children: React.ReactNode }) => (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
            {children}
        </pre>
    ),
};

export const WorkContent: React.FC<WorkContentProps> = ({
    description,
    content,
    category,
    metrics,
}) => {
    const t = useTranslations("works");

    return (
        <div
            className="max-w-4xl mx-auto animate-fade-in"
            style={{ opacity: 0, animationDelay: "150ms" }}
        >
            {/* Project Overview - Short Description */}
            <div className="mb-12">
                <h2 className="text-gray-900 text-display-sm font-bold mb-6">
                    {t("projectOverview")}
                </h2>
                <p className="text-gray-700 text-body-xl leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Project Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-gray-900 text-body-xl font-bold mb-3">
                        {t("category")}
                    </h3>
                    <p className="text-gray-700 text-body-lg">{category}</p>
                </div>

                {metrics && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                        <h3 className="text-gray-900 text-body-xl font-bold mb-3">
                            {t("results")}
                        </h3>
                        <p className="text-gray-700 text-body-lg">{metrics}</p>
                    </div>
                )}
            </div>

            {/* Rich Text Content Section */}
            {content && (
                <div className="mb-12">
                    <div className="prose prose-lg prose-gray max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents as any}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
};
