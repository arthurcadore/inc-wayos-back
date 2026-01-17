import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommonTopoLinkData, CommonTopoLinkResponse, CommonTopoNode, CommonTopoNodeResponse, IncCloudAlarmHistoryList, IncCloudAlarmItem, IncCloudResponseBase, RegionDevice, ShopDevice } from '../dto/inccloud-response.dto';
import { IncCloudServiceInterface } from '../interfaces/inccloud-service.interface';
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import dns from 'dns';
import { PerformanceLogger } from 'src/shared/utils/performance-logger';

// Força IPv4 primeiro
dns.setDefaultResultOrder('ipv4first');

@Injectable()
export class IncCloudService implements IncCloudServiceInterface {
    private readonly baseUrl: string;
    private readonly apiKey: string;
    private readonly userName: string;
    private readonly axiosInstance: AxiosInstance;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.baseUrl = this.configService.get<string>('INC_CLOUD_BASE_URL')!;
        this.apiKey = this.configService.get<string>('INC_CLOUD_API_KEY')!;
        this.userName = this.configService.get<string>('INC_CLOUD_USERNAME')!;

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
                console.log(`[IncCloud] Tentativa ${retryCount} após erro: ${error.message}`);
            }
        });
    }

    async getShopDevicePage(): Promise<ShopDevice[]> {
        try {
            console.log(`[IncCloud] Iniciando requisição para: ${this.baseUrl}/shop/device/page`);
            const startTime = Date.now();

            const response = await this.axiosInstance.request<IncCloudResponseBase<ShopDevice>>({
                method: 'POST',
                maxBodyLength: Infinity,
                url: `${this.baseUrl}/shop/device/page?user_name=${this.userName}&locale=en`,
                headers: {
                    'accept': 'application/json',
                    'apikey': this.apiKey,
                    'Content-Type': 'application/json',
                },
                data: {},
            });

            const endTime = Date.now();
            console.log(`[IncCloud] Requisição completada em ${PerformanceLogger.formatDuration(endTime - startTime)}`);

            return response.data.data.data;
        } catch (error) {
            return this.parseError(error);
        }
    }

    async getRegionDevices1(sn: string, start: number, size: number): Promise<IncCloudResponseBase<RegionDevice>> {
        try {
            console.log(`[IncCloud] Iniciando requisição para: ${this.baseUrl}/regiondevices1`);
            const startTime = Date.now();

            const response = await this.axiosInstance.request<IncCloudResponseBase<RegionDevice>>({
                method: 'POST',
                url: `${this.baseUrl}/regiondevices1?user_name=${this.userName}&locale=en`,
                headers: {
                    'accept': 'application/json',
                    'apikey': this.apiKey,
                    'Content-Type': 'application/json',
                },
                data: {
                    devAlias: "",
                    devSn: sn,
                    start: start,
                    size: size,
                    orderby: "devAlias",
                    ascending: false,
                    status: null,
                    devDesc: "",
                    customTypeStrList: ["Router", "Switch", "AC", "AP", "FatAP", "Security", "Xiaobei Router", "IoT", "Cloud AP", "MerRouter", "Cloud Gateway", "Security Serial", "Rover AP", "ER G3 Router", "S1600V2 Switches", "Xiaobei FW", "UR Routers", "CPE 5G"],
                    regionId: 1034
                },
            });

            const endTime = Date.now();
            console.log(`[IncCloud] Requisição completada em ${PerformanceLogger.formatDuration(endTime - startTime)}`);

            return response.data;
        } catch (error) {
            return this.parseError(error);
        }
    }

    async getRegionDevices1AllPages(sn: string): Promise<RegionDevice[]> {
        const pageSize = 1000;
        const regionDevices: RegionDevice[] = [];

        console.log(`[IncCloud] Iniciando obtenção de todos os dispositivos regionais para SN: ${sn}`);
        const startTime = Date.now();

        while (true) {
            const response = await this.getRegionDevices1(sn, Math.floor(regionDevices.length / pageSize) + 1, pageSize);

            if (response.code !== 0) {
                throw new Error(response.message || 'Internal Server Error');
            }

            regionDevices.push(...response.data.data);

            if (regionDevices.length >= response.data.rowCount) {
                break;
            }
        }

        const endTime = Date.now();
        console.log(`[IncCloud] Obtenção completada em ${PerformanceLogger.formatDuration(endTime - startTime)}`);

        return regionDevices;
    }

    async getIncCloudAlarmHistoryList(devSn: string, pageNum: number, pageSize: number, startTime: number, endTime: number): Promise<IncCloudAlarmItem[]> {
        try {
            console.log(`[IncCloud] Iniciando requisição para histórico de logs de alarmes`);
            const requestStartTime = Date.now();

            const response = await this.axiosInstance.request<IncCloudAlarmHistoryList>({
                method: 'POST',
                maxBodyLength: Infinity,
                url: `${this.baseUrl}/alarm/history/list?user_name=${this.userName}&locale=en`,
                headers: {
                    'accept': 'application/json',
                    'apikey': this.apiKey,
                    'Content-Type': 'application/json',
                },
                data: {
                    devSn,
                    pageNum,
                    pageSize,
                    startTime,
                    endTime,
                    alarmTypeName_en: "Device offline"
                },
            });

            const requestEndTime = Date.now();
            console.log(`[IncCloud] Requisição completada em ${PerformanceLogger.formatDuration(requestEndTime - requestStartTime)}`);

            return response.data.data.historyList;
        } catch (error) {
            return this.parseError(error);
        }
    }

    async commonTopoNodes(shopId: number): Promise<CommonTopoNode[]> {
        try {
            console.log(`[IncCloud] Iniciando requisição para: ${this.baseUrl}/common/topo/nodes`);
            const startTime = Date.now();

            const response = await this.axiosInstance.request<CommonTopoNodeResponse>({
                method: 'GET',
                url: `${this.baseUrl}/common/topo/nodes?user_name=${this.userName}&locale=en&shopId=${shopId}`,
                headers: {
                    'accept': 'application/json',
                    'apikey': this.apiKey,
                    'Content-Type': 'application/json',
                },
            });

            const endTime = Date.now();
            console.log(`[IncCloud] Requisição completada em ${PerformanceLogger.formatDuration(endTime - startTime)}`);

            return response.data.data;
        } catch (error) {
            return this.parseError(error);
        }
    }

    async commonTopoLinks(shopId: number): Promise<CommonTopoLinkData> {
        try {
            console.log(`[IncCloud] Iniciando requisição para: ${this.baseUrl}/common/topo/links`);
            const startTime = Date.now();

            const response = await this.axiosInstance.request<CommonTopoLinkResponse>({
                method: 'GET',
                url: `${this.baseUrl}/common/topo/links?user_name=${this.userName}&locale=en&shopId=${shopId}`,
                headers: {
                    'accept': 'application/json',
                    'apikey': this.apiKey,
                    'Content-Type': 'application/json',
                },
            });

            const endTime = Date.now();
            console.log(`[IncCloud] Requisição completada em ${PerformanceLogger.formatDuration(endTime - startTime)}`);

            return response.data.data;
        } catch (error) {
            return this.parseError(error);
        }
    }

    private parseError(error: any): any {
        if (axios.isAxiosError(error)) {
            console.error(`[IncCloud] Erro na requisição:`, {
                message: error.message,
                code: error.code,
                status: error.response?.status,
            });
            throw new HttpException(
                error.response?.data || error.message || 'Internal Server Error',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        } else {
            console.error(`[IncCloud] Erro desconhecido:`, error);
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
