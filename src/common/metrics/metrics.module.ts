import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { MetricsMiddleware } from './metrics.middleware';

/**
 * Metrics Module
 * 
 * Provides Prometheus metrics collection and exposure.
 * Exports MetricsService for use in other modules.
 */
@Module({
  providers: [MetricsService, MetricsMiddleware],
  controllers: [MetricsController],
  exports: [MetricsService],
})
export class MetricsModule {}

