import { Link } from "@/src/i18n/navigation";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
    return (
        <nav aria-label="Breadcrumb" className={`py-4 ${className}`}>
            <ol className="flex items-center space-x-2 text-sm flex-wrap">
                <li>
                    <Link
                        href="/"
                        className="text-gray-600 hover:text-blue-600 flex items-center transition-colors"
                        aria-label="Home"
                    >
                        <Home className="w-4 h-4" />
                    </Link>
                </li>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={index} className="flex items-center">
                            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" aria-hidden="true" />
                            {!isLast && item.href ? (
                                <Link
                                    href={item.href}
                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span
                                    className="text-gray-900 font-medium"
                                    aria-current={isLast ? "page" : undefined}
                                >
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
