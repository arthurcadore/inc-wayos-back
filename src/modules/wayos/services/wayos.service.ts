import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { WayosGetDeviceInfoResponse } from '../dto/wayos-response.dto';
import { WayosServiceInterface } from '../interfaces/wayos-service.interface';
import { defer } from 'rxjs';
import { WayosBaseService } from './wayos-base.service';

@Injectable()
export class WayosService
    extends WayosBaseService
    implements WayosServiceInterface
{
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        super();
        this.baseUrl = this.configService.get<string>('WAYOS_BASE_URL')!;
    }

    async getDeviceInfo(sn: string): Promise<WayosGetDeviceInfoResponse> {
        const response = await firstValueFrom(
            defer(() => {
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
                    'X-Signature': signature,
                };

                return this.httpService.post<WayosGetDeviceInfoResponse>(
                    `${this.baseUrl}/open-api/v1/device/info`,
                    body,
                    { headers },
                );
            }).pipe(
                // retry({
                //     count: 3,
                //     delay: (error, retryCount) => timer(Math.pow(2, retryCount - 1) * 1000),
                // }),
                catchError((error: AxiosError) => {
                    throw new HttpException(
                        error.response?.data || 'Internal Server Error',
                        error.response?.status ||
                            HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                }),
            ),
        );

        return response.data;
    }
}
