"use client";

import React, { useState } from "react";
import { newsletterApi } from "@/lib/strapi";

export const NewsletterSubscription: React.FC = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        const result = await newsletterApi.subscribe(email);
        
        setStatus(result.success ? 'success' : 'error');
        setMessage(result.message);
        
        if (result.success) {
            setEmail("");
        }
        
        setTimeout(() => {
            setStatus('idle');
            setMessage("");
        }, 5000);
    };

    return (
        <section className="px-4 md:px-8 pb-16">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Stay Updated with Our Latest Stories
                    </h3>
                    <p className="text-blue-100 text-lg mb-8">
                        Get the latest insights, tips, and stories delivered straight to your inbox.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </div>
                        
                        {message && (
                            <p className={`mt-4 text-sm ${
                                status === 'success' ? 'text-green-200' : 'text-red-200'
                            }`}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};