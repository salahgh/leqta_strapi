import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Secret token to prevent unauthorized revalidation requests
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'your-secret-token';

/**
 * API Route to handle on-demand revalidation from Strapi webhooks
 *
 * Usage: POST /api/revalidate
 * Body: { "tag": "site-settings", "secret": "your-secret-token" }
 *
 * Or with query params: POST /api/revalidate?tag=site-settings&secret=your-secret-token
 */
export async function POST(request: NextRequest) {
    try {
        // Get params from body or query
        const body = await request.json().catch(() => ({}));
        const tag = body.tag || request.nextUrl.searchParams.get('tag');
        const secret = body.secret || request.nextUrl.searchParams.get('secret');

        // Validate secret
        if (secret !== REVALIDATE_SECRET) {
            return NextResponse.json(
                { error: 'Invalid secret token' },
                { status: 401 }
            );
        }

        // Validate tag
        if (!tag) {
            return NextResponse.json(
                { error: 'Missing tag parameter' },
                { status: 400 }
            );
        }

        // Allowed tags for security
        const allowedTags = ['site-settings', 'blogs', 'services', 'projects', 'testimonials', 'faqs', 'cookie-consent', 'privacy-policy'];
        if (!allowedTags.includes(tag)) {
            return NextResponse.json(
                { error: `Invalid tag. Allowed tags: ${allowedTags.join(', ')}` },
                { status: 400 }
            );
        }

        // Revalidate the cache for this tag
        revalidateTag(tag);

        console.log(`✅ Revalidated cache for tag: ${tag}`);

        return NextResponse.json({
            revalidated: true,
            tag,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Revalidation error:', error);
        return NextResponse.json(
            { error: 'Failed to revalidate' },
            { status: 500 }
        );
    }
}

// Also support GET for simple testing (with secret in query)
export async function GET(request: NextRequest) {
    const tag = request.nextUrl.searchParams.get('tag');
    const secret = request.nextUrl.searchParams.get('secret');

    if (secret !== REVALIDATE_SECRET) {
        return NextResponse.json(
            { error: 'Invalid secret token' },
            { status: 401 }
        );
    }

    if (!tag) {
        return NextResponse.json(
            { error: 'Missing tag parameter' },
            { status: 400 }
        );
    }

    const allowedTags = ['site-settings', 'blogs', 'services', 'projects', 'testimonials', 'faqs', 'cookie-consent', 'privacy-policy'];
    if (!allowedTags.includes(tag)) {
        return NextResponse.json(
            { error: `Invalid tag. Allowed tags: ${allowedTags.join(', ')}` },
            { status: 400 }
        );
    }

    revalidateTag(tag);

    console.log(`✅ Revalidated cache for tag: ${tag}`);

    return NextResponse.json({
        revalidated: true,
        tag,
        timestamp: new Date().toISOString()
    });
}
