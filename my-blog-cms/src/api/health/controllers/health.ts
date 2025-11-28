/**
 * Health check controller
 * Provides endpoints for monitoring application health
 */

export default {
  /**
   * Simple health check - returns OK status
   * GET /api/health
   */
  async check(ctx) {
    ctx.body = {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Detailed health check - includes database connectivity
   * GET /api/health/detailed
   */
  async detailed(ctx) {
    const startTime = Date.now();
    let dbStatus = 'ok';
    let dbLatency = 0;

    // Check database connectivity
    try {
      const dbStart = Date.now();
      await strapi.db.connection.raw('SELECT 1');
      dbLatency = Date.now() - dbStart;
    } catch (error) {
      dbStatus = 'error';
      strapi.log.error('Health check: Database connection failed', error);
    }

    ctx.body = {
      status: dbStatus === 'ok' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: Date.now() - startTime,
      services: {
        database: {
          status: dbStatus,
          latency: dbLatency,
        },
      },
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };
  },
};
