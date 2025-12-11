import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetShopDevicePageResponse } from '../dto/inccloud-response.dto';
import { IncCloudServiceInterface } from '../interfaces/inccloud-service.interface';
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import dns from 'dns';

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

    async getShopDevicePage(): Promise<GetShopDevicePageResponse> {
        try {
            console.log(`[IncCloud] Iniciando requisição para: ${this.baseUrl}/shop/device/page`);
            const startTime = Date.now();

            const response = await this.axiosInstance.request<GetShopDevicePageResponse>({
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
            console.log(`[IncCloud] Requisição completada em ${endTime - startTime}ms`);

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
