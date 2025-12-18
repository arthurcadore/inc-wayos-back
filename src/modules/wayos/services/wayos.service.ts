import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    WayosAlarmLogItem,
    WayosAlarmLogResponse,
    WayosGetDeviceInfoResponse,
    WayosGetDeviceOnlineUserResponse,
    WayosGetUserSceneListItem,
    WayosGetUserSceneListResponse,
} from '../dto/wayos-response.dto';
import { WayosServiceInterface } from '../interfaces/wayos-service.interface';
import { WayosBaseService } from './wayos-base.service';
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { PerformanceLogger } from 'src/shared/utils/performance-logger';


@Injectable()
export class WayosService extends WayosBaseService implements WayosServiceInterface {
    private readonly baseUrl: string;
    private readonly axiosInstance: AxiosInstance;

    constructor(
        private readonly configService: ConfigService
    ) {
        super();
        this.baseUrl = this.configService.get<string>('WAYOS_BASE_URL')!;

        // Cria instância dedicada do axios
        this.axiosInstance = axios.create({
            timeout: 15000, // 15 segundos
            maxBodyLength: Infinity,
        });

        // Configura retry UMA VEZ na instância
        axiosRetry(this.axiosInstance, {
            retries: 10,
            shouldResetTimeout: true,
            retryDelay: axiosRetry.exponentialDelay, // Delay exponencial (1s, 2s, 4s)
            retryCondition: (error) => {
                // Retry apenas em erros de rede ou timeout
                return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
                    error.code === 'ECONNABORTED';
            },
            onRetry: (retryCount, error, requestConfig) => {
                console.log(`[Wayos] Tentativa ${retryCount} após erro: ${error.message}`);
            }
        });
    }

    async getUserSceneList(page: number, limit: number): Promise<WayosGetUserSceneListResponse> {
        try {
            console.log(`[Wayos] Iniciando requisição para: ${this.baseUrl}/open-api/v1/user-scene/list`);
            const startTime = Date.now();

            const body = {
                request_id: this.generateRequestId(),
                page,
                limit
            };
            const timestamp = this.getTimestamp();
            const signature = this.buildSignature(timestamp, body);
            const headers = {
                'Content-Type': 'application/json',
                'X-App-Id': this.appId,
                'X-Timestamp': timestamp,
                'X-Signature': signature
            };
            const response = await this.axiosInstance.request<WayosGetUserSceneListResponse>({
                method: 'POST',
                maxBodyLength: Infinity,
                url: `${this.baseUrl}/open-api/v1/user-scene/list`,
                headers,
                data: body,
            });

            const endTime = Date.now();
            console.log(`[Wayos] Requisição completada em ${PerformanceLogger.formatDuration(endTime - startTime)}`);

            return response.data;
        } catch (error) {
            return this.parseError(error);
        }
    }

    async getUserSceneListAllPages(): Promise<WayosGetUserSceneListItem[]> {
        const pageSize = 1000;
        const userScenes: WayosGetUserSceneListItem[] = [];

        console.log(`[Wayos] Iniciando recuperação de todas as cenas de usuário`);
        const startTime = Date.now();

        while (true) {
            const response = await this.getUserSceneList(Math.floor(userScenes.length / pageSize) + 1, pageSize);

            if (response.code !== 0) {
                throw new Error(response.msg || 'Internal Server Error');
            }

            userScenes.push(...response.data.list);

            if (userScenes.length >= response.data.total) {
                break;
            }
        }

        const endTime = Date.now();
        console.log(`[Wayos] Recuperação completada em ${PerformanceLogger.formatDuration(endTime - startTime)}. Total de cenas recuperadas: ${userScenes.length}`);

        return userScenes;
    }

    async getDeviceInfo(sn: string): Promise<WayosGetDeviceInfoResponse> {
        try {
            // console.log(`[Wayos] Iniciando requisição para: ${this.baseUrl}/open-api/v1/device/info`);
            // const startTime = Date.now();

            const body = {
                request_id: this.generateRequestId(),
                sn
            };
            const timestamp = this.getTimestamp();
            const signature = this.buildSignature(timestamp, body);
            const headers = {
                'Content-Type': 'application/json',
                'X-App-Id': this.appId,
                'X-Timestamp': timestamp,
                'X-Signature': signature
            };
            const response = await this.axiosInstance.request<WayosGetDeviceInfoResponse>({
                method: 'POST',
                maxBodyLength: Infinity,
                url: `${this.baseUrl}/open-api/v1/device/info`,
                headers,
                data: body,
            });

            // const endTime = Date.now();
            // console.log(`[Wayos] Requisição completada em ${PerformanceLogger.formatDuration(endTime - startTime)}`);

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new HttpException(error.response?.data || 'Internal Server Error', error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getDeviceOnlineUser(sn: string): Promise<WayosGetDeviceOnlineUserResponse> {
        try {
            console.log(`[Wayos] Iniciando requisição para: ${this.baseUrl}/open-api/v1/device/online-user`);
            const startTime = Date.now();

            const body = {
                request_id: this.generateRequestId(),
                sn,
            };
            const timestamp = this.getTimestamp();
            const signature = this.buildSignature(timestamp, body);
            const headers = {
                'Content-Type': 'application/json',
                'X-App-Id': this.appId,
                'X-Timestamp': timestamp,
                'X-Signature': signature
            };
            const response = await this.axiosInstance.request<WayosGetDeviceOnlineUserResponse>({
                method: 'POST',
                maxBodyLength: Infinity,
                url: `${this.baseUrl}/open-api/v1/device/online-user`,
                headers,
                data: body,
            });

            const endTime = Date.now();
            console.log(`[Wayos] Requisição completada em ${PerformanceLogger.formatDuration(endTime - startTime)}`);

            return response.data;
        } catch (error) {
            return this.parseError(error);
        }
    }

    async getAlarmLogList(sceneId: number, page: number, limit: number, startAt: string, endAt: string): Promise<WayosAlarmLogResponse> {
        try {
            // console.log(`[Wayos] Iniciando requisição para: ${this.baseUrl}/open-api/v1/alarm/log/list`);
            // const startTime = Date.now();

            const body = {
                request_id: this.generateRequestId(),
                scene_id: sceneId,
                page,
                limit,
                start_at: startAt,
                end_at: endAt,
            };
            const timestamp = this.getTimestamp();
            const signature = this.buildSignature(timestamp, body);
            const headers = {
                'Content-Type': 'application/json',
                'X-App-Id': this.appId,
                'X-Timestamp': timestamp,
                'X-Signature': signature
            };
            const response = await this.axiosInstance.request<WayosAlarmLogResponse>({
                method: 'POST',
                maxBodyLength: Infinity,
                url: `${this.baseUrl}/open-api/v1/alarm/log/list`,
                headers,
                data: body,
            });

            // const endTime = Date.now();
            // console.log(`[Wayos] Requisição completada em ${PerformanceLogger.formatDuration(endTime - startTime)}`);

            return response.data;
        } catch (error) {
            return this.parseError(error);
        }
    }

    async getAlarmLogListAllPages(sceneId: number, startAt: string, endAt: string): Promise<WayosAlarmLogItem[]> {
        const pageSize = 10;
        const alarmLogs: WayosAlarmLogItem[] = [];

        console.log(`[Wayos] Iniciando recuperação de todos os logs de alarme para cena ID ${sceneId} entre ${startAt} e ${endAt}`);
        const startTime = Date.now();

        while (true) {
            const response = await this.getAlarmLogList(sceneId, Math.floor(alarmLogs.length / pageSize) + 1, pageSize, startAt, endAt);

            if (response.code !== 0) {
                throw new Error(response.msg || 'Internal Server Error');
            }

            alarmLogs.push(...response.data.list);

            if (alarmLogs.length >= response.data.total) {
                break;
            }
        }

        const endTime = Date.now();
        console.log(`[Wayos] Recuperação completada em ${PerformanceLogger.formatDuration(endTime - startTime)}. Total de logs recuperados: ${alarmLogs.length}`);

        return alarmLogs;
    }

    private parseError(error: any): any {
        if (axios.isAxiosError(error)) {
            console.error(`[Wayos] Erro na requisição:`, {
                message: error.message,
                code: error.code,
                status: error.response?.status,
            });
            throw new HttpException(
                error.response?.data || error.message || 'Internal Server Error',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        } else {
            console.error(`[Wayos] Erro desconhecido:`, error);
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
