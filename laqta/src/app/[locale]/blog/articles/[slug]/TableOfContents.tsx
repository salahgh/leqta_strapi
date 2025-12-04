// Table of Contents Component
import React, { useEffect, useState } from "react";

export const TableOfContents: React.FC<{
    headings: Array<{ id: string; text: string; level: number }>;
}> = ({ headings }) => {
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0px -35% 0px" },
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <div className="sticky top-24 bg-white rounded-2xl card-p-sm shadow-lg border border-neutral-200 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-body-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <svg
                    className="w-5 h-5 text-primary-light"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
                Table of Contents
            </h3>
            <nav className="space-y-2">
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-body-sm transition-colors ${
                            activeId === heading.id
                                ? "text-primary-light font-semibold"
                                : "text-neutral-600 hover:text-primary-light"
                        }`}
                        style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                    >
                        {heading.text}
                    </a>
                ))}
            </nav>
        </div>
    );
};
