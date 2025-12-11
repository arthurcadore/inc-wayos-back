import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WayosAlarmLogItem, WayosAlarmLogResponse, WayosGetDeviceInfoResponse, WayosGetDeviceOnlineUserResponse, WayosGetUserSceneListResponse } from '../dto/wayos-response.dto';
import { WayosServiceInterface } from '../interfaces/wayos-service.interface';
import { WayosBaseService } from './wayos-base.service';
import axios from 'axios';

@Injectable()
export class WayosService extends WayosBaseService implements WayosServiceInterface {
    private readonly baseUrl: string;

    constructor(
        private readonly configService: ConfigService
    ) {
        super();
        this.baseUrl = this.configService.get<string>('WAYOS_BASE_URL')!;
    }

    async getUserSceneList(page: number, limit: number): Promise<WayosGetUserSceneListResponse> {
        try {
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
            const response = await axios.request<WayosGetUserSceneListResponse>({
                method: 'POST',
                maxBodyLength: Infinity,
                url: `${this.baseUrl}/open-api/v1/user-scene/list`,
                headers,
                data: body,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new HttpException(error.response?.data || 'Internal Server Error', error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getDeviceInfo(sn: string): Promise<WayosGetDeviceInfoResponse> {
        try {
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
            const response = await axios.request<WayosGetDeviceInfoResponse>({
                method: 'POST',
                maxBodyLength: Infinity,
                url: `${this.baseUrl}/open-api/v1/device/info`,
                headers,
                data: body,
            });
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
            const response = await axios.request<WayosGetDeviceOnlineUserResponse>({
                method: 'POST',
                maxBodyLength: Infinity,
                url: `${this.baseUrl}/open-api/v1/device/online-user`,
                headers,
                data: body,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new HttpException(error.response?.data || 'Internal Server Error', error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getAlarmLogList(sceneId: number, page: number, limit: number, startAt: string, endAt: string): Promise<WayosAlarmLogResponse> {
        try {
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
            const response = await axios.request<WayosAlarmLogResponse>({
                method: 'POST',
                maxBodyLength: Infinity,
                url: `${this.baseUrl}/open-api/v1/alarm/log/list`,
                headers,
                data: body,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new HttpException(error.response?.data || 'Internal Server Error', error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getAlarmLogListAllPages(sceneId: number, startAt: string, endAt: string): Promise<WayosAlarmLogItem[]> {
        const pageSize = 10;
        const alarmLogs: WayosAlarmLogItem[] = [];

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

        return alarmLogs;
    }
}
