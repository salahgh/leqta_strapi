import { NextResponse } from 'next/server';

/**
 * Simple health check
 * GET /api/health
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const detailed = searchParams.get('detailed') === 'true';

  if (detailed) {
    // Detailed health check with Strapi connectivity
    const startTime = Date.now();
    let strapiStatus = 'ok';
    let strapiLatency = 0;

    // Check Strapi connectivity
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_2 || 'http://localhost:1337';
      const strapiStart = Date.now();
      const response = await fetch(`${strapiUrl}/api/health`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      strapiLatency = Date.now() - strapiStart;

      if (!response.ok) {
        strapiStatus = 'error';
      }
    } catch (error) {
      strapiStatus = 'error';
      console.error('Health check: Strapi connection failed', error);
    }

    return NextResponse.json({
      status: strapiStatus === 'ok' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: Date.now() - startTime,
      services: {
        strapi: {
          status: strapiStatus,
          latency: strapiLatency,
          url: process.env.NEXT_PUBLIC_STRAPI_URL_2 || 'http://localhost:1337',
        },
      },
      environment: process.env.NODE_ENV || 'development',
    });
  }

  // Simple health check
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
