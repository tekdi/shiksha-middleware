import { Controller, Get, Header } from '@nestjs/common';
import { MetricsService } from './metrics.service';

/**
 * Metrics Controller
 * 
 * Exposes the /metrics endpoint for Prometheus scraping.
 * This endpoint returns metrics in Prometheus format.
 */
@Controller()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  /**
   * GET /metrics
   * 
   * Returns Prometheus metrics in text format.
   * This endpoint is scraped by Prometheus server.
   */
  @Get('metrics')
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  async getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }
}

