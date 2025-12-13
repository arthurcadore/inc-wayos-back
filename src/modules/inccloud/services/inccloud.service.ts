import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncCloudResponseBase, ShopDevice } from '../dto/inccloud-response.dto';
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
            timeout: 5000, // 5 segundos
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

    async getRegionDevices1(sn: string, start: number, size: number): Promise<any> {
        try {
            console.log(`[IncCloud] Iniciando requisição para: ${this.baseUrl}/regiondevices1`);
            const startTime = Date.now();

            const response = await this.axiosInstance.request<any>({
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
}
