import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import axios, { AxiosError } from 'axios';

interface ServiceHealth {
  name: string;
  status: 'up' | 'down';
  message?: string;
  responseTime?: number;
}

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async checkDatabase(): Promise<ServiceHealth> {
    const startTime = Date.now();
    try {
      if (!this.dataSource) {
        return { name: 'database', status: 'down', message: 'DataSource not available' };
      }

      if (!this.dataSource.isInitialized) {
        return { name: 'database', status: 'down', message: 'Database connection not initialized' };
      }

      const queryPromise = this.dataSource.query('SELECT 1');
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout after 5 seconds')), 5000),
      );

      await Promise.race([queryPromise, timeoutPromise]);
      const responseTime = Date.now() - startTime;
      return { name: 'database', status: 'up', responseTime };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        name: 'database',
        status: 'down',
        message: error instanceof Error ? error.message : 'Database connection failed',
        responseTime,
      };
    }
  }

  async checkExternalService(serviceName: string, serviceUrl: string | undefined): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    if (!serviceUrl) {
      return { name: serviceName, status: 'down', message: 'Service URL not configured' };
    }

    try {
      // Try to check health endpoint first, fallback to base URL
      const timeout = 3000; // 3 second timeout for external services
      let healthUrl = `${serviceUrl}/health/ready`;
      let response;

      try {
        response = await axios.get(healthUrl, {
          timeout,
          validateStatus: (status) => status < 500, // Accept 2xx, 3xx, 4xx but not 5xx
        });
      } catch {
        // If /health/ready fails, try /health
        try {
          healthUrl = `${serviceUrl}/health`;
          response = await axios.get(healthUrl, {
            timeout,
            validateStatus: (status) => status < 500,
          });
        } catch {
          // If health endpoints don't exist, try base URL connectivity
          await axios.get(serviceUrl, { timeout, validateStatus: () => true });
          return { name: serviceName, status: 'up', responseTime: Date.now() - startTime };
        }
      }

      const responseTime = Date.now() - startTime;
      
      if (response.status === 200 || response.status === 503) {
        // 200 = healthy, 503 = unhealthy but service is reachable
        return {
          name: serviceName,
          status: response.status === 200 ? 'up' : 'down',
          message: response.status === 503 ? 'Service unhealthy' : undefined,
          responseTime,
        };
      }

      // Other status codes - service is reachable
      return { name: serviceName, status: 'up', responseTime };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ETIMEDOUT') {
          return { name: serviceName, status: 'down', message: 'Service unreachable', responseTime };
        }
      }
      return {
        name: serviceName,
        status: 'down',
        message: error instanceof Error ? error.message : 'Service check failed',
        responseTime,
      };
    }
  }

  async checkAllServices(): Promise<ServiceHealth[]> {
    const services: Array<{ name: string; url: string | undefined }> = [
      { name: 'user-service', url: this.configService.get<string>('USER_SERVICE') },
      { name: 'lms-service', url: this.configService.get<string>('LMS_SERVICE') },
      { name: 'assessment-service', url: this.configService.get<string>('SHIKSHA_ASSESSMENT_SERVICE') },
      { name: 'tracking-service', url: this.configService.get<string>('TRACKING_SERVICE') },
      { name: 'notification-service', url: this.configService.get<string>('NOTIFICATION_SERVICE') },
      { name: 'event-service', url: this.configService.get<string>('EVENT_SERVICE') },
      { name: 'attendance-service', url: this.configService.get<string>('ATTENDANCE_SERVICE') },
    ];

    // Check all services in parallel
    const serviceChecks = await Promise.allSettled(
      services.map((service) => this.checkExternalService(service.name, service.url))
    );

    return serviceChecks.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return {
        name: services[index].name,
        status: 'down' as const,
        message: result.reason?.message || 'Service check failed',
      };
    });
  }

  async getOverallHealth(): Promise<{
    status: 'ok' | 'error';
    timestamp: string;
    services: ServiceHealth[];
  }> {
    const dbHealth = await this.checkDatabase();
    const externalServices = await this.checkAllServices();
    
    const allServices = [dbHealth, ...externalServices];
    const allHealthy = allServices.every((service) => service.status === 'up');

    return {
      status: allHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      services: allServices,
    };
  }
}

