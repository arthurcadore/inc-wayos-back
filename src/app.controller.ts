import { Controller, Get } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiOkResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { WayosService } from './modules/wayos/services/wayos.service';

interface HealthCheckResponse {
    message: string;
    timestamp: string;
    environment: string;
    version: string;
}

@ApiTags('Health Check')
@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly wayosService: WayosService,
    ) {}

    @Get()
    @ApiOperation({
        summary: 'Health check endpoint',
        description:
            'Returns a simple health check message with system information',
    })
    @ApiOkResponse({
        description: 'Application is healthy and running',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'EACE Backend Dashboard is running!',
                },
                timestamp: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-11-05T10:30:00.000Z',
                },
                environment: {
                    type: 'string',
                    example: 'development',
                },
                version: {
                    type: 'string',
                    example: '0.0.1',
                },
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
    })
    getHealthCheck(): HealthCheckResponse {
        return this.appService.getHealthCheck();
    }

    @Get('wayos-health')
    async getWayosHealthCheck(): Promise<unknown> {
        const response = await this.wayosService.getDeviceInfo('MWDM2600180OX');
        return response;
    }
}
