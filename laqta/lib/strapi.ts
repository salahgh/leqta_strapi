import { cache } from "react";

// Types for Services
export interface Service {
    id: number;
    title: string;
    description: string;
    slug?: string;
    icon?: string;
    icon_image?: {
        url: string;
        alternativeText?: string;
        width?: number;
        height?: number;
    };
    gradientFrom?: string;
    gradientTo?: string;
    tags?: string[];
    featured_image?: {
        url: string;
        alternativeText?: string;
        width?: number;
        height?: number;
    };
    order?: number;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationMeta {
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    };
}

export interface ApiResponse<T> {
    data: T;
    meta?: PaginationMeta;
}

export interface ApiError {
    data: any;
    error: {
        status: number;
        name: string;
        message: string;
        details?: any;
    };
}

// Configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL_2 || "http://localhost:1337";
const API_BASE = `${STRAPI_URL}/api`;
const IS_DEV = process.env.NODE_ENV === 'development';

// Base fetch wrapper with caching
const fetchApi = cache(async function <T>(
    endpoint: string,
    options: RequestInit = {},
    locale?: string, // Add optional locale parameter
): Promise<T> {
    // const token = await getAuthToken();
    const token = undefined;

    const config: RequestInit = {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
        ...options,
        // Disable cache in development, use short revalidation in production
        cache: IS_DEV ? 'no-store' : undefined,
        next: IS_DEV ? undefined : {
            revalidate: 60, // 1 minute in production
            ...((options as any)?.next || {}),
        },
    };

    // Handle endpoints that already have query parameters
    const [basePath, queryString] = endpoint.split("?");
    const url = new URL(`${API_BASE}${basePath}`);

    // Add existing query parameters if any
    if (queryString) {
        const existingParams = new URLSearchParams(queryString);
        existingParams.forEach((value, key) => {
            url.searchParams.set(key, value);
        });
    }

    // Add locale parameter if provided
    if (locale) {
        url.searchParams.set("locale", locale);
    }

    const response = await fetch(url.toString(), config);

    if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error.message || "API request failed");
    }

    return response.json();
});

// Services API - Update getAll method
export const servicesApi = {
    async getAll(params?: {
        page?: number;
        pageSize?: number;
        sort?: string;
        populate?: string;
        filters?: Record<string, any>;
        locale?: string; // Add locale
    }): Promise<ApiResponse<Service[]>> {
        const searchParams = new URLSearchParams();
        if (params?.page)
            searchParams.set("pagination[page]", params.page.toString());
        if (params?.pageSize)
            searchParams.set(
                "pagination[pageSize]",
                params.pageSize.toString(),
            );
        if (params?.sort) searchParams.set("sort", params.sort);
        if (params?.populate) searchParams.set("populate", params.populate);

        // Handle filters
        if (params?.filters) {
            Object.entries(params.filters).forEach(([key, value]) => {
                searchParams.set(`filters[${key}]`, value.toString());
            });
        }

        const query = searchParams.toString();
        const endpoint = `/services${query ? `?${query}` : ""}`;

        return fetchApi<ApiResponse<Service[]>>(endpoint, {}, params?.locale);
    },

    // Update getById method
    async getById(
        id: number,
        params?: {
            populate?: string;
            locale?: string; // Add locale
        },
    ): Promise<ApiResponse<Service>> {
        const searchParams = new URLSearchParams();
        if (params?.populate) searchParams.set("populate", params.populate);

        const query = searchParams.toString();
        const endpoint = `/services/${id}${query ? `?${query}` : ""}`;

        return fetchApi<ApiResponse<Service>>(endpoint, {}, params?.locale);
    },

    // Get service by slug using filter approach (more reliable)
    // Falls back to matching generated slug from title if no slug field exists
    async getBySlug(
        slug: string,
        params?: {
            populate?: string;
            locale?: string;
        },
    ): Promise<ApiResponse<Service>> {
        const searchParams = new URLSearchParams();
        searchParams.set("filters[slug][$eq]", slug);
        if (params?.populate) searchParams.set("populate", params.populate);

        const query = searchParams.toString();
        const endpoint = `/services?${query}`;

        // First try to find by actual slug field
        const response = await fetchApi<ApiResponse<Service[]>>(endpoint, {}, params?.locale);

        if (response.data && response.data.length > 0) {
            return { data: response.data[0], meta: response.meta };
        }

        // Fallback: fetch all services and find by generated slug from title
        const allParams = new URLSearchParams();
        if (params?.populate) allParams.set("populate", params.populate);
        allParams.set("pagination[pageSize]", "100");

        const allQuery = allParams.toString();
        const allEndpoint = `/services?${allQuery}`;
        const allResponse = await fetchApi<ApiResponse<Service[]>>(allEndpoint, {}, params?.locale);

        // Helper to generate slug from title
        const generateSlug = (title: string): string =>
            title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';

        // Find service by matching generated slug
        const matchedService = allResponse.data?.find(service => {
            const generatedSlug = generateSlug(service.title);
            return generatedSlug === slug || service.documentId === slug;
        });

        if (!matchedService) {
            throw new Error("Service not found");
        }

        return { data: matchedService, meta: allResponse.meta };
    },

    // Update getFeatured method
    async getFeatured(params?: {
        page?: number;
        pageSize?: number;
        locale?: string; // Add locale
    }): Promise<ApiResponse<Service[]>> {
        return this.getAll({
            ...params,
            filters: { featured: true },
            populate: "*",
        });
    },
};

// Utility functions
export const utils = {
    // Get full URL for uploaded files
    getFileUrl(url: string): string {
        if (url.startsWith("http")) return url;
        return `${STRAPI_URL}${url}`;
    },
};

// Works/Projects interface
export interface Work {
    id: number;
    documentId?: string;
    title: string;
    slug?: string;
    description: string;
    category: string;
    metrics?: string;
    cta_text?: string;
    ctaText?: string;
    imagePosition?: "left" | "right";
    featured?: boolean;
    // Updated featured_image structure to match API documentation
    featured_image?: {
        id?: number;
        documentId?: string;
        name?: string;
        alternativeText?: string;
        caption?: string;
        width?: number;
        height?: number;
        formats?: any;
        hash?: string;
        ext?: string;
        mime?: string;
        size?: number;
        url: string;
        previewUrl?: string;
        provider?: string;
        provider_metadata?: any;
        related?: Array<{
            id: number;
            documentId: string;
        }>;
        folder?: any;
    };

    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// Works API
export const worksApi = {
    async getAll(params?: {
        page?: number;
        pageSize?: number;
        sort?: string;
        populate?: string;
        filters?: Record<string, any>;
        locale?: string;
        fields?: string[]; // Add fields parameter
    }): Promise<ApiResponse<Work[]>> {
        const searchParams = new URLSearchParams();
        if (params?.page)
            searchParams.set("pagination[page]", params.page.toString());
        if (params?.pageSize)
            searchParams.set(
                "pagination[pageSize]",
                params.pageSize.toString(),
            );
        if (params?.sort) searchParams.set("sort", params.sort);

        // Add field selection if provided
        if (params?.fields && params.fields.length > 0) {
            params.fields.forEach((field, index) => {
                searchParams.set(`fields[${index}]`, field);
            });
        } else if (params?.populate) {
            searchParams.set("populate", params.populate);
        }

        // Handle filters
        if (params?.filters) {
            Object.entries(params.filters).forEach(([key, value]) => {
                searchParams.set(`filters[${key}]`, value.toString());
            });
        }

        const query = searchParams.toString();
        const endpoint = `/projects${query ? `?${query}` : ""}`;

        return fetchApi<ApiResponse<Work[]>>(endpoint, {}, params?.locale);
    },

    async getById(
        id: number,
        params?: {
            populate?: string;
            locale?: string; // Add locale
        },
    ): Promise<ApiResponse<Work>> {
        const searchParams = new URLSearchParams();
        if (params?.populate) searchParams.set("populate", params.populate);

        const query = searchParams.toString();
        const endpoint = `/projects/${id}${query ? `?${query}` : ""}`;

        return fetchApi<ApiResponse<Work>>(endpoint, {}, params?.locale);
    },

    // Get project by slug using filter approach (more reliable)
    async getBySlug(
        slug: string,
        params?: {
            populate?: string;
            locale?: string;
        },
    ): Promise<ApiResponse<Work>> {
        const searchParams = new URLSearchParams();
        searchParams.set("filters[slug][$eq]", slug);
        if (params?.populate) searchParams.set("populate", params.populate);

        const query = searchParams.toString();
        const endpoint = `/projects?${query}`;

        // This returns an array, we need to get the first item
        const response = await fetchApi<ApiResponse<Work[]>>(endpoint, {}, params?.locale);

        if (!response.data || response.data.length === 0) {
            throw new Error("Project not found");
        }

        return { data: response.data[0], meta: response.meta };
    },

    async getFeatured(params?: {
        page?: number;
        pageSize?: number;
        locale?: string; // Add locale
    }): Promise<ApiResponse<Work[]>> {
        return this.getAll({
            ...params,
            filters: { featured: true },
            populate: "*",
        });
    },
};

// Types for Testimonials
export interface Testimonial {
    id: number;
    documentId: string;
    testimonial: string;
    author: string;
    role: string;
    avatar?: {
        url?: string;
        alternativeText?: string;
        // Strapi v4 nested format
        data?: {
            attributes?: {
                url?: string;
                alternativeText?: string;
            };
        };
    } | null;
    company?: string;
    rating?: number;
    featured?: boolean;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
}

// Testimonials API
export const testimonialsApi = {
    async getAll(params?: {
        page?: number;
        pageSize?: number;
        sort?: string;
        populate?: string;
        filters?: Record<string, any>;
        locale?: string; // Add locale
    }): Promise<ApiResponse<Testimonial[]>> {
        const searchParams = new URLSearchParams();
        if (params?.page)
            searchParams.set("pagination[page]", params.page.toString());
        if (params?.pageSize)
            searchParams.set(
                "pagination[pageSize]",
                params.pageSize.toString(),
            );
        if (params?.sort) searchParams.set("sort", params.sort);
        if (params?.populate) searchParams.set("populate", params.populate);

        // Handle filters
        if (params?.filters) {
            Object.entries(params.filters).forEach(([key, value]) => {
                searchParams.set(`filters[${key}]`, value.toString());
            });
        }

        const query = searchParams.toString();
        const endpoint = `/testimonials${query ? `?${query}` : ""}`;

        return fetchApi<ApiResponse<Testimonial[]>>(
            endpoint,
            {},
            params?.locale,
        );
    },

    async getById(
        id: number,
        params?: {
            populate?: string;
            locale?: string; // Add locale
        },
    ): Promise<ApiResponse<Testimonial>> {
        const searchParams = new URLSearchParams();
        if (params?.populate) searchParams.set("populate", params.populate);

        const query = searchParams.toString();
        const endpoint = `/testimonials/${id}${query ? `?${query}` : ""}`;

        return fetchApi<ApiResponse<Testimonial>>(endpoint, {}, params?.locale);
    },

    async getFeatured(params?: {
        page?: number;
        pageSize?: number;
        locale?: string; // Add locale
    }): Promise<ApiResponse<Testimonial[]>> {
        return this.getAll({
            ...params,
            filters: { featured: true },
            populate: "*",
        });
    },
};

// Types for FAQs
export interface FAQ {
    id: number;
    documentId: string;
    question: string;
    answer: string;
    category?: string;
    featured?: boolean;
    order?: number;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
}

// FAQs API
export const faqsApi = {
    async getAll(params?: {
        page?: number;
        pageSize?: number;
        sort?: string;
        populate?: string;
        filters?: Record<string, any>;
        locale?: string; // Add locale
    }): Promise<ApiResponse<FAQ[]>> {
        const searchParams = new URLSearchParams();
        if (params?.page)
            searchParams.set("pagination[page]", params.page.toString());
        if (params?.pageSize)
            searchParams.set(
                "pagination[pageSize]",
                params.pageSize.toString(),
            );
        if (params?.sort) searchParams.set("sort", params.sort);
        if (params?.populate) searchParams.set("populate", params.populate);

        // Handle filters
        if (params?.filters) {
            Object.entries(params.filters).forEach(([key, value]) => {
                searchParams.set(`filters[${key}]`, value.toString());
            });
        }

        const query = searchParams.toString();
        const endpoint = `/faqs${query ? `?${query}` : ""}`;

        return fetchApi<ApiResponse<FAQ[]>>(endpoint, {}, params?.locale);
    },

    async getById(
        id: number,
        params?: {
            populate?: string;
            locale?: string; // Add locale
        },
    ): Promise<ApiResponse<FAQ>> {
        const searchParams = new URLSearchParams();
        if (params?.populate) searchParams.set("populate", params.populate);

        const query = searchParams.toString();
        const endpoint = `/faqs/${id}${query ? `?${query}` : ""}`;

        return fetchApi<ApiResponse<FAQ>>(endpoint, {}, params?.locale);
    },

    async getFeatured(params?: {
        page?: number;
        pageSize?: number;
        locale?: string; // Add locale
    }): Promise<ApiResponse<FAQ[]>> {
        return this.getAll({
            ...params,
            filters: { featured: true },
            sort: "order:asc",
        });
    },

    async getByCategory(
        category: string,
        params?: {
            page?: number;
            pageSize?: number;
            locale?: string; // Add locale
        },
    ): Promise<ApiResponse<FAQ[]>> {
        return this.getAll({
            ...params,
            filters: { category },
            sort: "order:asc",
        });
    },
};

// Types for Missions
export interface Mission {
    id: number;
    documentId: string;
    title: string;
    description: string;
    icon?: string;
    iconSrc?: string;
    featured?: boolean;
    order?: number;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
}

// Missions API
export const missionsApi = {
    async getAll(params?: {
        page?: number;
        pageSize?: number;
        sort?: string;
        populate?: string;
        filters?: Record<string, any>;
        locale?: string; // Add locale
    }): Promise<ApiResponse<Mission[]>> {
        const searchParams = new URLSearchParams();
        if (params?.page)
            searchParams.set("pagination[page]", params.page.toString());
        if (params?.pageSize)
            searchParams.set(
                "pagination[pageSize]",
                params.pageSize.toString(),
            );
        if (params?.sort) searchParams.set("sort", params.sort);
        if (params?.populate) searchParams.set("populate", params.populate);

        // Handle filters
        if (params?.filters) {
            Object.entries(params.filters).forEach(([key, value]) => {
                searchParams.set(`filters[${key}]`, value.toString());
            });
        }

        const query = searchParams.toString();
        const endpoint = `/missions${query ? `?${query}` : ""}`;

        return fetchApi<ApiResponse<Mission[]>>(endpoint, {}, params?.locale);
    },

    async getById(
        id: number,
        params?: {
            populate?: string;
            locale?: string; // Add locale
        },
    ): Promise<ApiResponse<Mission>> {
        const searchParams = new URLSearchParams();
        if (params?.populate) searchParams.set("populate", params.populate);

        const query = searchParams.toString();
        const endpoint = `/missions/${id}${query ? `?${query}` : ""}`;

        return fetchApi<ApiResponse<Mission>>(endpoint, {}, params?.locale);
    },

    async getFeatured(params?: {
        page?: number;
        pageSize?: number;
        locale?: string; // Add locale
    }): Promise<ApiResponse<Mission[]>> {
        return this.getAll({
            ...params,
            filters: { featured: true },
            sort: "order:asc",
        });
    },
};

// Updated Blog interface based on new API structure
export interface Blog {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    read_time: number;
    featured: boolean;
    views: number;
    meta_title?: string;
    meta_description?: string;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    category: {
        id: number;
        documentId: string;
        name: string;
        slug: string;
        description?: string;
        color: string;
    };
    author: {
        id: number;
        documentId: string;
        name: string;
        email: string;
        bio?: string;
        avatar?: {
            id: number;
            documentId: string;
            url: string;
            alternativeText?: string;
            width?: number;
            height?: number;
        };
    };
    tags: Array<{
        id: number;
        documentId: string;
        name: string;
        slug: string;
    }>;
    header_image?: {
        id: number;
        documentId: string;
        url: string;
        alternativeText?: string;
        width?: number;
        height?: number;
    };
    content_image?: {
        id: number;
        documentId: string;
        url: string;
        alternativeText?: string;
        width?: number;
        height?: number;
    };
}

// Category interface
export interface Category {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description?: string;
    color: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// Tag interface
export interface Tag {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// Newsletter interface
export interface Newsletter {
    id: number;
    documentId?: string;
    email: string;
    status: "active" | "unsubscribed";
    subscribedAt: string;
    unsubscribedAt?: string;
    source?: string;
    createdAt: string;
    updatedAt: string;
}

// Social Media interface (from site-setting component)
export interface SocialMedia {
    id: number;
    platform: string;
    url: string;
    label?: string;
}

// Updated Blogs API
// Ensure these methods support locale parameter
export const blogsApi = {
    async getBySlug(
        slug: string,
        locale?: string,
        fields?: string[],
    ): Promise<ApiResponse<Blog[]>> {
        const params = new URLSearchParams();
        params.set("filters[slug][$eq]", slug);

        // Add field selection if provided
        if (fields && fields.length > 0) {
            fields.forEach((field, index) => {
                params.set(`fields[${index}]`, field);
            });
        }

        // Always populate relations
        params.set("populate[0]", "header_image");
        params.set("populate[1]", "content_image");
        params.set("populate[2]", "category");
        params.set("populate[3]", "author.avatar");
        params.set("populate[4]", "tags");

        return fetchApi<ApiResponse<Blog[]>>(
            `/blogs?${params.toString()}`,
            {},
            locale,
        );
    },

    async getByCategory(
        categorySlug: string,
        params?: { page?: number; pageSize?: number; locale?: string },
    ): Promise<ApiResponse<Blog[]>> {
        const searchParams = new URLSearchParams();
        searchParams.set("filters[category][slug][$eq]", categorySlug);

        // Explicitly populate all relations for Strapi v5
        searchParams.set("populate[0]", "header_image");
        searchParams.set("populate[1]", "content_image");
        searchParams.set("populate[2]", "category");
        searchParams.set("populate[3]", "author.avatar");
        searchParams.set("populate[4]", "tags");

        if (params?.page)
            searchParams.set("pagination[page]", params.page.toString());
        if (params?.pageSize)
            searchParams.set(
                "pagination[pageSize]",
                params.pageSize.toString(),
            );

        return fetchApi<ApiResponse<Blog[]>>(
            `/blogs?${searchParams.toString()}`,
            {},
            params?.locale,
        );
    },

    async getFeatured(params?: {
        page?: number;
        pageSize?: number;
        sort?: string;
        locale?: string;
    }): Promise<ApiResponse<Blog[]>> {
        const searchParams = new URLSearchParams();
        searchParams.set("filters[featured][$eq]", "true");

        // Explicitly populate all relations for Strapi v5
        searchParams.set("populate[0]", "header_image");
        searchParams.set("populate[1]", "content_image");
        searchParams.set("populate[2]", "category");
        searchParams.set("populate[3]", "author.avatar");
        searchParams.set("populate[4]", "tags");

        if (params?.page)
            searchParams.set("pagination[page]", params.page.toString());
        if (params?.pageSize)
            searchParams.set(
                "pagination[pageSize]",
                params.pageSize.toString(),
            );
        if (params?.sort) searchParams.set("sort", params.sort);

        return fetchApi<ApiResponse<Blog[]>>(
            `/blogs?${searchParams.toString()}`,
            {},
            params?.locale,
        );
    },

    async getAll(params?: {
        page?: number;
        pageSize?: number;
        search?: string;
        category?: string;
        tag?: string;
        sort?: string;
        locale?: string;
        fields?: string[]; // Add fields parameter
    }): Promise<ApiResponse<Blog[]>> {
        const searchParams = new URLSearchParams();

        // Add field selection if provided, otherwise populate all relations explicitly
        if (params?.fields && params.fields.length > 0) {
            params.fields.forEach((field, index) => {
                searchParams.set(`fields[${index}]`, field);
            });
        } else {
            // Explicitly populate all relations for Strapi v5
            searchParams.set("populate[0]", "header_image");
            searchParams.set("populate[1]", "content_image");
            searchParams.set("populate[2]", "category");
            searchParams.set("populate[3]", "author.avatar");
            searchParams.set("populate[4]", "tags");
        }

        if (params?.page)
            searchParams.set("pagination[page]", params.page.toString());
        if (params?.pageSize)
            searchParams.set(
                "pagination[pageSize]",
                params.pageSize.toString(),
            );
        if (params?.sort) searchParams.set("sort", params.sort);

        // Search functionality
        if (params?.search) {
            searchParams.set(
                "filters[$or][0][title][$containsi]",
                params.search,
            );
            searchParams.set(
                "filters[$or][1][excerpt][$containsi]",
                params.search,
            );
            searchParams.set(
                "filters[$or][2][content][$containsi]",
                params.search,
            );
        }

        // Category filter
        if (params?.category) {
            searchParams.set("filters[category][slug][$eq]", params.category);
        }

        // Tag filter
        if (params?.tag) {
            searchParams.set("filters[tags][slug][$eq]", params.tag);
        }

        return fetchApi<ApiResponse<Blog[]>>(
            `/blogs?${searchParams.toString()}`,
            {},
            params?.locale,
        );
    },

    async getRelated(
        blogId: number,
        limit: number = 3,
        locale?: string,
    ): Promise<ApiResponse<Blog[]>> {
        const searchParams = new URLSearchParams();
        searchParams.set("filters[id][$ne]", blogId.toString());

        // Explicitly populate all relations for Strapi v5
        searchParams.set("populate[0]", "header_image");
        searchParams.set("populate[1]", "content_image");
        searchParams.set("populate[2]", "category");
        searchParams.set("populate[3]", "author.avatar");
        searchParams.set("populate[4]", "tags");

        searchParams.set("pagination[pageSize]", limit.toString());
        searchParams.set("sort", "publishedAt:desc");

        return fetchApi<ApiResponse<Blog[]>>(
            `/blogs?${searchParams.toString()}`,
            {},
            locale,
        );
    },

    async getAllSlugs(
        locale?: string,
    ): Promise<ApiResponse<{ slug: string }[]>> {
        return fetchApi<ApiResponse<{ slug: string }[]>>(
            `/blogs?fields[0]=slug&pagination[pageSize]=1000`,
            {},
            locale,
        );
    },
};

// Categories API
export const categoriesApi = {
    async getAll(locale?: string): Promise<ApiResponse<Category[]>> {
        return fetchApi<ApiResponse<Category[]>>(
            "/categories?sort=name:asc",
            {},
            locale,
        );
    },
};

export const tagsApi = {
    async getAll(locale?: string): Promise<ApiResponse<Tag[]>> {
        return fetchApi<ApiResponse<Tag[]>>("/tags?sort=name:asc", {}, locale);
    },
};

// Newsletter API
export const newsletterApi = {
    async subscribe(
        email: string,
        locale?: string,
    ): Promise<{ success: boolean; message: string }> {
        try {
            const response = await fetchApi<{ message: string; data: any }>(
                "/newsletters/subscribe",
                {
                    method: "POST",
                    body: JSON.stringify({ email, source: "website" }),
                },
                locale,
            );
            return {
                success: true,
                message:
                    response.message ||
                    "Successfully subscribed to newsletter!",
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to subscribe. Please try again.",
            };
        }
    },

    async unsubscribe(
        email: string,
        locale?: string,
    ): Promise<{ success: boolean; message: string }> {
        try {
            const response = await fetchApi<{ message: string; data: any }>(
                "/newsletters/unsubscribe",
                {
                    method: "POST",
                    body: JSON.stringify({ email }),
                },
                locale,
            );
            return {
                success: true,
                message:
                    response.message ||
                    "Successfully unsubscribed from newsletter.",
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to unsubscribe. Please try again.",
            };
        }
    },
};

// Site Settings interface
export interface SiteSettings {
    id: number;
    siteName?: string;
    siteDescription?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    footerText?: string;
    copyrightText?: string;
    social_links?: SocialMedia[];
}

// Site Settings API (fetches from site-setting single type)
export const siteSettingsApi = {
    async get(locale?: string): Promise<SiteSettings | null> {
        const endpoint = `/site-setting?populate=social_links`;

        try {
            const response = await fetchApi<{ data: SiteSettings }>(endpoint, {}, locale);
            return response.data || null;
        } catch (error) {
            console.error("Failed to fetch site settings:", error);
            return null;
        }
    },
};

// Social Media API (fetches from site-setting single type)
export const socialMediaApi = {
    async getAll(params?: {
        sort?: string;
        locale?: string;
    }): Promise<{ data: SocialMedia[] }> {
        const settings = await siteSettingsApi.get(params?.locale);
        return {
            data: settings?.social_links || [],
        };
    },
};

// Plan interfaces
export interface PlanPoint {
    id: number;
    text: string;
    included: boolean;
}

export interface PlanSection {
    id: number;
    title: string;
    points: PlanPoint[];
}

export interface Plan {
    id: number;
    documentId: string;
    title: string;
    description?: string;
    price?: string;
    isCustomPricing: boolean;
    customPricingText?: string;
    buttonText?: string;
    buttonLink?: string;
    featured: boolean;
    order: number;
    sections: PlanSection[];
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
}

// Plans API
export const plansApi = {
    async getAll(params?: {
        page?: number;
        pageSize?: number;
        sort?: string;
        locale?: string;
    }): Promise<ApiResponse<Plan[]>> {
        const searchParams = new URLSearchParams();
        if (params?.page)
            searchParams.set("pagination[page]", params.page.toString());
        if (params?.pageSize)
            searchParams.set("pagination[pageSize]", params.pageSize.toString());
        if (params?.sort) searchParams.set("sort", params.sort);

        // Populate sections and points
        searchParams.set("populate[sections][populate][0]", "points");

        const query = searchParams.toString();
        const endpoint = `/plans${query ? `?${query}` : ""}`;

        return fetchApi<ApiResponse<Plan[]>>(endpoint, {}, params?.locale);
    },

    async getById(
        id: number,
        params?: {
            locale?: string;
        },
    ): Promise<ApiResponse<Plan>> {
        const searchParams = new URLSearchParams();
        searchParams.set("populate[sections][populate][0]", "points");

        const query = searchParams.toString();
        const endpoint = `/plans/${id}${query ? `?${query}` : ""}`;

        return fetchApi<ApiResponse<Plan>>(endpoint, {}, params?.locale);
    },

    async getFeatured(params?: {
        locale?: string;
    }): Promise<ApiResponse<Plan[]>> {
        const searchParams = new URLSearchParams();
        searchParams.set("filters[featured][$eq]", "true");
        searchParams.set("populate[sections][populate][0]", "points");
        searchParams.set("sort", "order:asc");

        const query = searchParams.toString();
        const endpoint = `/plans?${query}`;

        return fetchApi<ApiResponse<Plan[]>>(endpoint, {}, params?.locale);
    },
};

export default {
    blogsApi,
    categoriesApi,
    tagsApi,
    newsletterApi,
    socialMediaApi,
    siteSettingsApi,
    servicesApi,
    worksApi,
    testimonialsApi,
    faqsApi,
    missionsApi,
    plansApi,
    utils,
};
