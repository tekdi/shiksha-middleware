import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from './metrics.service';

/**
 * Prometheus Metrics Middleware
 * 
 * This middleware captures request-level metrics:
 * - HTTP method
 * - Route (normalized)
 * - Response status code
 * - Request duration (latency)
 * - Error count (4xx, 5xx)
 */
@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    // Skip metrics collection for /metrics endpoint to avoid self-scraping pollution
    // This prevents Prometheus scrapes from being counted as regular requests
    if (req.path === '/metrics' || req.originalUrl === '/metrics' || req.url === '/metrics') {
      return next();
    }

    // Record start time for duration measurement
    const startTime = Date.now();

    // Normalize the route to avoid high-cardinality labels
    const normalizedRoute = this.metricsService.normalizeRoute(
      req.originalUrl || req.url,
    );

    // Get HTTP method
    const method = req.method.toUpperCase();

    // Listen for the response finish event
    res.on('finish', () => {
      // Calculate request duration in seconds
      const duration = (Date.now() - startTime) / 1000;

      // Get response status code
      const statusCode = res.statusCode || 500;
      const status = statusCode.toString();

      // Increment total request counter
      this.metricsService.httpRequestCounter.inc({
        method,
        route: normalizedRoute,
        status,
      });

      // Record request duration
      this.metricsService.httpRequestDuration.observe(
        {
          method,
          route: normalizedRoute,
          status,
        },
        duration,
      );

      // Increment error counter for 4xx and 5xx responses
      if (statusCode >= 400) {
        const errorType = this.metricsService.getErrorType(statusCode);
        this.metricsService.httpErrorCounter.inc({
          method,
          route: normalizedRoute,
          status,
          error_type: errorType,
        });
      }
    });

    // Proceed to the next middleware or route handler
    next();
  }
}

