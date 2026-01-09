import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    output: "standalone",
    typescript: {
        ignoreBuildErrors: true,
    },
    allowedDevOrigins: [
        'http://192.168.248.1:3000',
        'http://localhost:3000',
    ],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'nmgsempbczwwefyzsofb.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '1337',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '1337',
                pathname: '/uploads/**',
            },
            {
                // Production server - leqta.com with Strapi port
                protocol: 'http',
                hostname: 'leqta.com',
                port: '1337',
                pathname: '/uploads/**',
            },
            {
                // Production server - HTTPS
                protocol: 'https',
                hostname: 'leqta.com',
                pathname: '/uploads/**',
            },
            {
                // Production server - subdomains
                protocol: 'https',
                hostname: '*.leqta.com',
                pathname: '/uploads/**',
            },
        ],
        // Allow localhost images in development
        dangerouslyAllowSVG: true,
        unoptimized: process.env.NODE_ENV === 'development',
    },
};

export default withNextIntl(nextConfig);
