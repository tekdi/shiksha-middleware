import { Injectable } from '@nestjs/common';
import * as promClient from 'prom-client';

/**
 * Prometheus Metrics Service
 * 
 * This service registers and manages all Prometheus metrics for the application.
 * It follows best practices:
 * - Avoids high-cardinality labels
 * - Uses normalized route patterns
 * - Registers metrics once and reuses them
 */
@Injectable()
export class MetricsService {
  // Registry to collect all metrics
  private readonly register: promClient.Registry;

  // HTTP Request Counter - Total number of HTTP requests
  public readonly httpRequestCounter: promClient.Counter<string>;

  // HTTP Error Counter - Total number of HTTP errors (4xx, 5xx)
  public readonly httpErrorCounter: promClient.Counter<string>;

  // HTTP Request Duration Histogram - Request latency distribution
  public readonly httpRequestDuration: promClient.Histogram<string>;

  constructor() {
    // Create a new registry
    this.register = new promClient.Registry();

    // Add default metrics (CPU, memory, etc.)
    promClient.collectDefaultMetrics({
      register: this.register,
      prefix: 'shiksha_middleware_',
    });

    // Initialize HTTP Request Counter
    // Labels: method (GET, POST, etc.), route (normalized), status (200, 404, etc.)
    this.httpRequestCounter = new promClient.Counter({
      name: 'shiksha_middleware_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
      registers: [this.register],
    });

    // Initialize HTTP Error Counter
    // Labels: method, route, status, error_type (client_error, server_error)
    this.httpErrorCounter = new promClient.Counter({
      name: 'shiksha_middleware_http_errors_total',
      help: 'Total number of HTTP errors',
      labelNames: ['method', 'route', 'status', 'error_type'],
      registers: [this.register],
    });

    // Initialize HTTP Request Duration Histogram
    // Labels: method, route, status
    // Buckets: 0.1s, 0.5s, 1s, 2.5s, 5s, 10s, 30s, 60s
    this.httpRequestDuration = new promClient.Histogram({
      name: 'shiksha_middleware_http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.5, 1, 2.5, 5, 10, 30, 60],
      registers: [this.register],
    });
  }

  /**
   * Get the metrics registry
   */
  getRegister(): promClient.Registry {
    return this.register;
  }

  /**
   * Get metrics in Prometheus format
   */
  async getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  /**
   * Normalize route to avoid high-cardinality labels
   * Converts dynamic routes like /api/users/123 to /api/users/:id
   */
  normalizeRoute(route: string): string {
    if (!route) {
      return 'unknown';
    }

    // Remove query parameters
    const path = route.split('?')[0];

    // Normalize common patterns
    // Replace UUIDs (8-4-4-4-12 format)
    let normalized = path.replace(
      /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      '/:id',
    );

    // Replace numeric IDs
    normalized = normalized.replace(/\/\d+/g, '/:id');

    // Replace common ID patterns
    normalized = normalized.replace(/\/[a-z0-9]{24}/gi, '/:id'); // MongoDB ObjectId

    // Limit route length to avoid cardinality issues
    if (normalized.length > 100) {
      normalized = normalized.substring(0, 100);
    }

    return normalized || 'unknown';
  }

  /**
   * Get error type from status code
   */
  getErrorType(statusCode: number): string {
    if (statusCode >= 400 && statusCode < 500) {
      return 'client_error';
    } else if (statusCode >= 500) {
      return 'server_error';
    }
    return 'unknown';
  }
}

