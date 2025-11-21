import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { WayosUserSceneResponse } from '../dto/wayos-response.dto';
import { WayosServiceInterface } from '../interfaces/wayos-service.interface';
import { WayosSignatureService } from './wayos-signature-generator.service';
import { WAYOS_CONSTANTS } from '../wayos.constants';
import { defer } from 'rxjs';

@Injectable()
export class WayosService implements WayosServiceInterface {
    private readonly baseUrl: string;
    private readonly appId: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject(WAYOS_CONSTANTS.WAYOS_SIGNATURE_SERVICE)
        private readonly service: WayosSignatureService,
    ) {
        this.baseUrl = this.configService.get<string>('WAYOS_BASE_URL')!;
        this.appId = this.configService.get<string>('WAYOS_ACCESS_KEY_ID')!;
    }

    async getDeviceInfo(sn: string): Promise<WayosUserSceneResponse> {
        const response = await firstValueFrom(
            defer(() => {
                const timestamp = new Date().getTime().toString();
                const body = {
                    requestId: this.service.generateRequestId(),
                    sn,
                };
                const signature = this.service.buildSignature(timestamp, body);
                const headers = {
                    'X-App-Id': this.appId,
                    'X-Timestamp': timestamp,
                    'X-Signature': signature,
                };

                return this.httpService.post<WayosUserSceneResponse>(
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
