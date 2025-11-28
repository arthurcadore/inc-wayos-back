import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, catchError, defer } from 'rxjs';
import { AxiosError } from 'axios';
import { GetShopDevicePageResponse, IncCloudDeviceOperationResponse, IncCloudShopResponse } from '../dto/inccloud-response.dto';
import { IncCloudServiceInterface } from '../interfaces/inccloud-service.interface';

@Injectable()
export class IncCloudService implements IncCloudServiceInterface {
    private readonly baseUrl: string;
    private readonly apiKey: string;
    private readonly method: string;
    private readonly userName: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.baseUrl = this.configService.get<string>('INC_CLOUD_BASE_URL')!;
        this.apiKey = this.configService.get<string>('INC_CLOUD_API_KEY')!;
        this.method = this.configService.get<string>('INC_CLOUD_DEVICE_OPERATION_METHOD')!;
        this.userName = this.configService.get<string>('INC_CLOUD_USERNAME')!;
    }

    async getShopDevicePage(): Promise<GetShopDevicePageResponse> {
        const response = await firstValueFrom(
            defer(() => {
                const headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    apikey: this.apiKey
                };

                return this.httpService.post<GetShopDevicePageResponse>(`${this.baseUrl}/device/page?user_name=${this.userName}&locale=en`, {}, { headers });
            }).pipe(
                catchError((error: AxiosError) => {
                    throw new HttpException(error.response?.data || 'Internal Server Error', error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
                })
            )
        );

        return response.data;
    }

    async getShops(): Promise<IncCloudShopResponse> {
        const { data } = await firstValueFrom(
            this.httpService
                .get<IncCloudShopResponse>(`${this.baseUrl}/user/shop`, {
                    headers: {
                        apikey: this.apiKey
                    }
                })
                .pipe(
                    catchError((error: AxiosError) => {
                        throw new HttpException(error.response?.data || 'Internal Server Error', error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
                    })
                )
        );
        return data;
    }

    async getDeviceOperations(devSN: string[]): Promise<IncCloudDeviceOperationResponse> {
        const headers = {
            apikey: this.apiKey
        };
        const body = {
            method: this.method,
            devSN: devSN
        };

        const { data } = await firstValueFrom(
            this.httpService.post<IncCloudDeviceOperationResponse>(`${this.baseUrl}/device/operation`, body, { headers }).pipe(
                catchError((error: AxiosError) => {
                    throw new HttpException(error.response?.data || 'Internal Server Error', error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
                })
            )
        );
        return data;
    }
}
