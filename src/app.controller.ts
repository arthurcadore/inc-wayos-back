import { Controller, Get, Inject, Param, Response, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ViewGlobalUseCase } from './application/use-cases/view-global.use-case';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ConnectedDevicesUseCase } from './application/use-cases/connected-devices.use-case';
import { GetAlarmLogListUseCase } from './application/use-cases/get-alarm-log-list.use-case';
import * as data from './view-global-response.json';
import { delay } from './shared/utils/delay';
import { GetWayosLastOfflineMomentListUseCase } from './application/use-cases/get-wayos-last-offline-moment-list.use-case';
import { GetInccloudLastOfflineMomentListUseCase } from './application/use-cases/get-inccloud-last-offline-moment-list.use-case';
import type { WayosServiceInterface } from './modules/wayos/interfaces/wayos-service.interface';
import { WAYOS_CONSTANTS } from './modules/wayos/wayos.constants';

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
        private readonly viewGlobalUseCase: ViewGlobalUseCase,
        private readonly connectedDevicesUseCase: ConnectedDevicesUseCase,
        private readonly getAlarmLogListUseCase: GetAlarmLogListUseCase,
        private readonly getWayosLastOfflineMomentListUseCase: GetWayosLastOfflineMomentListUseCase,
        private readonly getInccloudLastOfflineMomentListUseCase: GetInccloudLastOfflineMomentListUseCase,
        @Inject(WAYOS_CONSTANTS.WAYOS_SERVICE)
        private readonly wayosService: WayosServiceInterface
    ) { }

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

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get('view-global')
    async getWayosHealthCheck(@Response() res: any): Promise<any> {
        // await delay(1500);
        // res.status(200).json(data);
        const response = await this.viewGlobalUseCase.execute();
        res.status(200).json(response);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get('connected-devices/:sn')
    async getConnectedDevices(@Param('sn') sn: string): Promise<any> {
        return await this.connectedDevicesUseCase.execute(sn);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get('alarms/device-type/:deviceType/value/:value/day-range/:dayRange')
    @ApiOperation({
        summary: 'Obtem a lista de logs de alarmes',
        description: 'Retorna uma lista de logs de alarmes para a cena especificada, filtrada por tipo de dispositivo e valor adicional.'
    })
    @ApiParam({
        name: 'deviceType',
        description: 'Tipo de dispositivo (router, switch ou ap)',
        enum: ['router', 'switch', 'ap'],
        required: true,
        example: 'router'
    })
    @ApiParam({
        name: 'value',
        description: 'Valor adicional para filtrar os logs de alarmes',
        required: true,
        example: '12345'
    })
    @ApiParam({
        name: 'dayRange',
        description: 'Número de dias para o intervalo de busca (padrão é 15)',
        required: false,
        example: 15
    })
    @ApiOkResponse({
        description: 'Lista de logs de alarmes obtida com sucesso',
        schema: {
            type: 'array',
            items: { type: 'object' }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid parameters'
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error'
    })
    async getAlarmLogs(
        @Param('deviceType') deviceType: 'router' | 'switch' | 'ap',
        @Param('value') value: any,
        @Param('dayRange') dayRange: number = 15,
        @Response() res: any
    ): Promise<any> {
        const alarms = await this.getAlarmLogListUseCase.execute({ deviceType, value, dayRange });
        if (alarms.length === 0) {
            res.status(204).send();
        } else {
            res.status(200).json(alarms);
        }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get('wayos-last-offline-moment-list/:sceneId')
    async getWayosLastOfflineMomentList(@Param('sceneId') sceneId: number): Promise<any[]> {
        return await this.getWayosLastOfflineMomentListUseCase.execute(sceneId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get('inccloud-last-offline-moment-list/:sn')
    async getIncCloudLastOfflineMomentList(@Param('sn') sn: string): Promise<any[]> {
        return await this.getInccloudLastOfflineMomentListUseCase.execute(sn);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get('wayos-user-scene-list-summerired')
    async getUserSceneListSummeriredAllPages(): Promise<any[]> {
        return this.wayosService.getUserSceneListSummeriredAllPages();
    }
}
