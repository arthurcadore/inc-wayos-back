// import dns from 'dns';
// dns.setDefaultResultOrder('ipv4first');

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetShopDevicePageResponse } from '../dto/inccloud-response.dto';
import { IncCloudServiceInterface } from '../interfaces/inccloud-service.interface';
import axios from 'axios';
import * as http from 'http';
import * as https from 'https';

@Injectable()
export class IncCloudService implements IncCloudServiceInterface {
    private readonly baseUrl: string;
    private readonly apiKey: string;
    private readonly userName: string;

    private readonly httpAgent = new http.Agent({ family: 4 });
    private readonly httpsAgent = new https.Agent({ family: 4 });

    constructor(
        private readonly configService: ConfigService
    ) {
        this.baseUrl = this.configService.get<string>('INC_CLOUD_BASE_URL')!;
        this.apiKey = this.configService.get<string>('INC_CLOUD_API_KEY')!;
        this.userName = this.configService.get<string>('INC_CLOUD_USERNAME')!;

    }

    async getShopDevicePage(): Promise<GetShopDevicePageResponse> {
        try {
            console.log(`[IncCloud] Iniciando requisição para: ${this.baseUrl}/shop/device/page`);
            const startTime = Date.now();

            const data = JSON.stringify({});

            const isHttps = this.baseUrl.startsWith('https://');

            const config = {
                method: 'post' as const,
                maxBodyLength: Infinity,
                url: `${this.baseUrl}/shop/device/page?user_name=${this.userName}&locale=en`,
                headers: {
                    'accept': 'application/json',
                    'apikey': this.apiKey,
                    'Content-Type': 'application/json',
                },
                data: data,
                timeout: 30000, // 30 segundos (suficiente já que curl demora 1s)
                httpAgent: isHttps ? undefined : this.httpAgent,
                httpsAgent: isHttps ? this.httpsAgent : undefined,
            };

            const response = await axios.request<GetShopDevicePageResponse>(config);

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
