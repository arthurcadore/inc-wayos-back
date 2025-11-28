import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ViewGlobalUseCase } from './application/use-cases/view-global.use-case';

interface HealthCheckResponse {
    message: string;
    timestamp: string;
    environment: string;
    version: string;
}

@ApiTags('Gateway')
@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly viewGlobalUseCase: ViewGlobalUseCase
    ) {}

    @Get()
    @ApiOperation({
        summary: 'Health check endpoint',
        description: 'Returns a simple health check message with system information'
    })
    @ApiOkResponse({
        description: 'Application is healthy and running',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'EACE Backend Dashboard is running!'
                },
                timestamp: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-11-05T10:30:00.000Z'
                },
                environment: {
                    type: 'string',
                    example: 'development'
                },
                version: {
                    type: 'string',
                    example: '0.0.1'
                }
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error'
    })
    getHealthCheck(): HealthCheckResponse {
        return this.appService.getHealthCheck();
    }

    @Get('view-global')
    async getWayosHealthCheck(): Promise<unknown> {
        return await this.viewGlobalUseCase.execute();
    }
}
