import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
  })
  health() {
    return {
      status: 'ok',
      service: 'products-microservice',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint (explicit)' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
  })
  healthCheck() {
    return {
      status: 'ok',
      service: 'products-microservice',
      timestamp: new Date().toISOString(),
    };
  }
}
