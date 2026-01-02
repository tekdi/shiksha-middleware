import { Controller, Get, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check service health and database connection (readiness probe)' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy and database is connected',
  })
  @ApiResponse({
    status: 503,
    description: 'Service is unhealthy or database is not connected',
  })
  async check() {
    // Check database connection directly
    const dbStatus = await this.checkDatabaseDirectly();
    
    if (!dbStatus.connected) {
      // Return 503 status with error details
      throw new HttpException(
        {
          status: 'error',
          info: {},
          error: {
            database: {
              status: 'down',
              message: dbStatus.message || 'Database connection failed',
            },
          },
          details: {
            database: {
              status: 'down',
              message: dbStatus.message || 'Database connection failed',
            },
          },
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // If database is connected, return healthy status
    return {
      status: 'ok',
      info: {
        database: {
          status: 'up',
        },
      },
      error: {},
      details: {
        database: {
          status: 'up',
        },
      },
    };
  }

  private async checkDatabaseDirectly(): Promise<{ connected: boolean; message?: string }> {
    try {
      // Check if DataSource exists and is initialized
      if (!this.dataSource) {
        return { connected: false, message: 'DataSource not available' };
      }

      if (!this.dataSource.isInitialized) {
        return { connected: false, message: 'Database connection not initialized' };
      }

      // Execute a simple query with timeout (5 seconds)
      const queryPromise = this.dataSource.query('SELECT 1');
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout after 5 seconds')), 5000),
      );

      await Promise.race([queryPromise, timeoutPromise]);
      return { connected: true };
    } catch (error) {
      return {
        connected: false,
        message: error instanceof Error ? error.message : 'Database connection failed',
      };
    }
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe - checks if service is running (no DB check)' })
  @ApiResponse({
    status: 200,
    description: 'Service is alive',
  })
  liveness() {
    // Liveness probe - just check if service is running
    // No database check needed, this is for Kubernetes to know if container is alive
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe - checks if service and database are ready' })
  @ApiResponse({
    status: 200,
    description: 'Service is ready (database connected)',
  })
  @ApiResponse({
    status: 503,
    description: 'Service is not ready (database not connected)',
  })
  async readiness() {
    // Readiness probe - same as main health check
    // This ensures service is ready to accept traffic
    return this.check();
  }
}

