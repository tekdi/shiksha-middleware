import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBasicAuth, ApiHeader } from '@nestjs/swagger';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiHeader({
    name: 'tenant-id',
  })
  @ApiBasicAuth('access-token')
  getHello(): string {
    return this.appService.getHello();
  }
}
