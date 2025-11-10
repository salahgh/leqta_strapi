import { cache } from 'react';

// Types for Services
export interface Service {
    id: number;
    title: string;
    description: string;
    slug?: string;
    icon?: string;
    gradientFrom?: string;
    gradientTo?: string;
    tags?: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    featured_image?: {
        url: string;
        alternativeText?: string;
        width?: number;
        height?: number;
    };
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
        // Add Next.js caching configuration
        next: {
            revalidate: 3600, // 1 hour default revalidation
            ...((options as any)?.next || {}),
        },
    };

    const url = new URL(`${API_BASE}${endpoint}`);
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
    avatar?: string;
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
    featured_image?: {
        id: number;
        documentId: string;
        url: string;
        alternativeText?: string;
        width?: number;
        height?: number;
    };
    // New fields from updated API
    featured_image_overlay?: {
        id: number;
        documentId: string;
        url: string;
        alternativeText?: string;
        width?: number;
        height?: number;
    };
    gallery?: Array<{
        id: number;
        documentId: string;
        name: string;
        alternativeText?: string;
        caption?: string;
        width: number;
        height: number;
        url: string;
        previewUrl?: string;
    }>;
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

// Updated Blogs API
// Ensure these methods support locale parameter
export const blogsApi = {
    async getBySlug(slug: string, locale?: string, fields?: string[]): Promise<ApiResponse<Blog>> {
        const params = new URLSearchParams();
        params.set('filters[slug][$eq]', slug);

        // Add field selection if provided
        if (fields && fields.length > 0) {
            fields.forEach((field, index) => {
                params.set(`fields[${index}]`, field);
            });
        }

        // Always populate relations
        params.set('populate[0]', 'featured_image');
        params.set('populate[1]', 'featured_image_overlay');
        params.set('populate[2]', 'gallery');
        params.set('populate[3]', 'category');
        params.set('populate[4]', 'author.avatar');
        params.set('populate[5]', 'tags');

        return fetchApi<ApiResponse<Blog>>(
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
        searchParams.set("populate", "*");
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
        locale?: string;
    }): Promise<ApiResponse<Blog[]>> {
        const searchParams = new URLSearchParams();
        searchParams.set("filters[featured][$eq]", "true");
        searchParams.set("populate", "*");
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

        // Add field selection if provided, otherwise populate all
        if (params?.fields && params.fields.length > 0) {
            params.fields.forEach((field, index) => {
                searchParams.set(`fields[${index}]`, field);
            });
        } else {
            searchParams.set("populate", "*");
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
        searchParams.set("populate", "*");
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
            await fetchApi(
                "/newsletter-subscriptions",
                {
                    method: "POST",
                    body: JSON.stringify({ data: { email } }),
                },
                locale,
            );
            return {
                success: true,
                message: "Successfully subscribed to newsletter!",
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to subscribe. Please try again.",
            };
        }
    },
};

export default {
    blogsApi,
    categoriesApi,
    tagsApi,
    newsletterApi,
    servicesApi,
    worksApi,
    testimonialsApi,
    faqsApi,
    missionsApi,
    utils,
};
