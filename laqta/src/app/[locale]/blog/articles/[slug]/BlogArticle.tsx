"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Blog, utils } from "@/lib/strapi";
import { BlogCard } from "../../BlogCard";
import { SocialShare } from "../../SocialShare";
import { ReadingProgress } from "./ReadingProgress";
import { useTranslations } from "next-intl";

// Enhanced Gallery Component with modern design
const EnhancedBlogGallery: React.FC<{ gallery: Blog["gallery"] }> = ({ gallery }) => {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    if (!gallery || gallery.length === 0) return null;

    const handleImageSelect = (index: number) => {
        setIsLoading(true);
        setSelectedImage(index);
        setTimeout(() => setIsLoading(false), 300);
    };

    const navigateImage = (direction: 'prev' | 'next') => {
        if (selectedImage === null) return;
        
        if (direction === 'prev') {
            setSelectedImage(selectedImage > 0 ? selectedImage - 1 : gallery.length - 1);
        } else {
            setSelectedImage(selectedImage < gallery.length - 1 ? selectedImage + 1 : 0);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (selectedImage === null) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    navigateImage('prev');
                    break;
                case 'ArrowRight':
                    navigateImage('next');
                    break;
                case 'Escape':
                    setSelectedImage(null);
                    break;
            }
        };

        if (selectedImage !== null) {
            document.addEventListener('keydown', handleKeyPress);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage, gallery.length]);

    return (
        <section className="my-16">
            {/* Gallery Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    Gallery
                </h3>
                <p className="text-gray-600 text-lg">
                    Explore {gallery.length} {gallery.length === 1 ? 'image' : 'images'} from this article
                </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gallery.map((image, index) => (
                    <div
                        key={image.id}
                        className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                        onClick={() => handleImageSelect(index)}
                    >
                        <Image
                            src={utils.getFileUrl(image?.url)}
                            alt={image.alternativeText || `Gallery image ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Hover Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-3">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <span className="text-white text-sm font-medium px-3 py-1 bg-black/30 rounded-full backdrop-blur-sm">
                                View Image
                            </span>
                        </div>
                        
                        {/* Image Number */}
                        <div className="absolute top-4 left-4 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
                            {index + 1}
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage !== null && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    {/* Loading Spinner */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        </div>
                    )}
                    
                    {/* Main Image Container */}
                    <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                        <div className="relative max-w-full max-h-full">
                            <Image
                                src={utils.getFileUrl(gallery[selectedImage].url)}
                                alt={gallery[selectedImage].alternativeText || `Gallery image ${selectedImage + 1}`}
                                width={gallery[selectedImage].width || 1200}
                                height={gallery[selectedImage].height || 800}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                priority
                            />
                        </div>
                        
                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110"
                            onClick={() => setSelectedImage(null)}
                            aria-label="Close gallery"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Navigation Buttons */}
                        {gallery.length > 1 && (
                            <>
                                <button
                                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage('prev');
                                    }}
                                    aria-label="Previous image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage('next');
                                    }}
                                    aria-label="Next image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                        
                        {/* Image Info Bar */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full backdrop-blur-sm">
                            <div className="flex items-center space-x-4 text-sm">
                                <span className="font-medium">
                                    {selectedImage + 1} / {gallery.length}
                                </span>
                                {gallery[selectedImage].alternativeText && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-200">
                                            {gallery[selectedImage].alternativeText}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        {/* Thumbnail Strip */}
                        {gallery.length > 1 && (
                            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-md overflow-x-auto scrollbar-hide">
                                {gallery.map((image, index) => (
                                    <button
                                        key={image.id}
                                        className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                                            index === selectedImage 
                                                ? 'ring-2 ring-white scale-110' 
                                                : 'opacity-60 hover:opacity-100'
                                        }`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <Image
                                            src={utils.getFileUrl(image.url)}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

// Enhanced Article Header Component
const ArticleHeader: React.FC<{ blog: Blog; formatDate: (date: string) => string }> = ({ blog, formatDate }) => {
    const t = useTranslations("blog");
    
    return (
        <header className="relative overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Featured Image */}
            {blog.featured_image && (
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[32rem]">
                    <Image
                        src={utils.getFileUrl(blog.featured_image.url)}
                        alt={blog.featured_image.alternativeText || blog.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Floating Category Badge */}
                    {blog.category && (
                        <div className="absolute top-6 left-6">
                            <Link
                                href={`/blog?category=${blog.category.slug}`}
                                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:scale-105"
                                style={{
                                    backgroundColor: blog.category.color || "#3B82F6",
                                    boxShadow: `0 4px 20px ${blog.category.color || "#3B82F6"}40`
                                }}
                            >
                                {blog.category.name}
                            </Link>
                        </div>
                    )}
                </div>
            )}
            
            {/* Article Content */}
            <div className="p-6 sm:p-8 lg:p-12">
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="font-medium">{formatDate(blog.publishedAt)}</span>
                    </div>
                    
                    {blog.read_time && (
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="font-medium">{blog.read_time} {t("minRead")}</span>
                        </div>
                    )}
                    
                    {blog.views && (
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="font-medium">{blog.views} {t("views")}</span>
                        </div>
                    )}
                </div>
                
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {blog.title}
                </h1>
                
                {/* Excerpt */}
                {blog.excerpt && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-2xl">
                        <p className="text-xl text-gray-800 leading-relaxed font-medium italic">
                            {blog.excerpt}
                        </p>
                    </div>
                )}
                
                {/* Author */}
                {blog.author && (
                    <div className="flex items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                        {blog.author.avatar && (
                            <div className="relative w-16 h-16 mr-6">
                                <Image
                                    src={utils.getFileUrl(blog.author.avatar.url)}
                                    alt={blog.author.name}
                                    fill
                                    className="rounded-full object-cover ring-4 ring-white shadow-lg"
                                    sizes="64px"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="font-bold text-gray-900 text-xl mb-1">
                                {blog.author.name}
                            </p>
                            {blog.author.bio && (
                                <p className="text-gray-600 leading-relaxed">
                                    {blog.author.bio}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

// Enhanced Article Content Component
const ArticleContent: React.FC<{ content: string }> = ({ content }) => {
    return (
        <article className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12">
            <div className="prose prose-lg prose-blue max-w-none">
                <div
                    className="text-gray-800 leading-relaxed article-content"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
            
            <style jsx global>{`
                .article-content h1,
                .article-content h2,
                .article-content h3,
                .article-content h4,
                .article-content h5,
                .article-content h6 {
                    @apply font-bold text-gray-900 mt-8 mb-4;
                }
                
                .article-content h1 { @apply text-3xl; }
                .article-content h2 { @apply text-2xl; }
                .article-content h3 { @apply text-xl; }
                .article-content h4 { @apply text-lg; }
                
                .article-content p {
                    @apply mb-6 text-gray-700 leading-relaxed;
                }
                
                .article-content a {
                    @apply text-blue-600 hover:text-blue-800 underline transition-colors;
                }
                
                .article-content ul,
                .article-content ol {
                    @apply mb-6 pl-6;
                }
                
                .article-content li {
                    @apply mb-2 text-gray-700;
                }
                
                .article-content blockquote {
                    @apply border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg italic text-gray-800;
                }
                
                .article-content code {
                    @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono;
                }
                
                .article-content pre {
                    @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6;
                }
                
                .article-content img {
                    @apply rounded-lg shadow-lg my-6;
                }
            `}</style>
        </article>
    );
};

// Enhanced Tags Component
const ArticleTags: React.FC<{ tags: Blog["tags"] }> = ({ tags }) => {
    if (!tags || tags.length === 0) return null;
    
    return (
        <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                </div>
                Tags
            </h3>
            <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                    <Link
                        key={tag.id}
                        href={`/blog?tag=${tag.slug}`}
                        className="group inline-flex items-center px-4 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:shadow-lg transform hover:-translate-y-1"
                    >
                        <span className="mr-2 text-gray-400 group-hover:text-blue-500 transition-colors">#</span>
                        {tag.name}
                    </Link>
                ))}
            </div>
        </section>
    );
};

// Enhanced Social Share Component
const EnhancedSocialShare: React.FC<{ url: string; title: string }> = ({ url, title }) => {
    return (
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-6 sm:p-8 border border-blue-100">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Share this article
                </h3>
                <p className="text-gray-600">
                    Help others discover this content
                </p>
            </div>
            <div className="flex justify-center">
                <SocialShare url={url} title={title} />
            </div>
        </section>
    );
};

// Enhanced Related Articles Component
const RelatedArticles: React.FC<{ relatedBlogs: Blog[] }> = ({ relatedBlogs }) => {
    const t = useTranslations("blog");
    
    if (relatedBlogs.length === 0) return null;
    
    return (
        <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mb-6">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    {t("relatedArticles")}
                </h2>
                <p className="text-gray-600 text-lg">
                    Continue exploring with these related articles
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog) => (
                    <BlogCard
                        key={relatedBlog.id}
                        blog={relatedBlog}
                        variant="default"
                    />
                ))}
            </div>
        </section>
    );
};

// Main BlogArticle Component
interface BlogArticleClientProps {
    blog: Blog;
    relatedBlogs: Blog[];
}

export const BlogArticle: React.FC<BlogArticleClientProps> = ({
    blog,
    relatedBlogs,
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <ReadingProgress />
            
            {/* Main Container */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                {/* Article Header */}
                <ArticleHeader blog={blog} formatDate={formatDate} />
                
                {/* Social Share */}
                <EnhancedSocialShare 
                    url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/articles/${blog.slug}`}
                    title={blog.title}
                />
                
                {/* Article Content */}
                <ArticleContent content={blog.content} />
                
                {/* Gallery */}
                <EnhancedBlogGallery gallery={blog.gallery} />
                
                {/* Tags */}
                <ArticleTags tags={blog.tags} />
                
                {/* Related Articles */}
                <RelatedArticles relatedBlogs={relatedBlogs} />
            </div>
        </div>
    );
};
