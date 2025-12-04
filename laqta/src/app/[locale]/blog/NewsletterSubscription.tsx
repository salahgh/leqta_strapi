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
        <section className="section-px section-py-md">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-primary rounded-2xl card-p-lg text-center">
                    <h3 className="text-display-xs md:text-display-sm font-bold text-white mb-4">
                        Stay Updated with Our Latest Stories
                    </h3>
                    <p className="text-white/80 text-body-lg mb-8">
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
                                className="flex-1 px-4 py-3 rounded-lg border-0 text-neutral-900 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="px-6 py-3 bg-white text-primary-light font-semibold rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors whitespace-nowrap"
                            >
                                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </div>

                        {message && (
                            <p className={`mt-4 text-body-sm ${
                                status === 'success' ? 'text-accent-success' : 'text-red-300'
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