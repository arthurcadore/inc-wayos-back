import {
    WayosAlarmLogItem,
    WayosAlarmLogResponse,
    WayosGetDeviceInfoResponse,
    WayosGetDeviceOnlineUserResponse,
    WayosGetUserSceneListResponse,
} from '../dto/wayos-response.dto';

export interface WayosServiceInterface {
    getUserSceneList(page: number, limit: number): Promise<WayosGetUserSceneListResponse>;
    getDeviceInfo(sn: string): Promise<WayosGetDeviceInfoResponse>;
    getDeviceOnlineUser(sn: string): Promise<WayosGetDeviceOnlineUserResponse>;
    getAlarmLogList(sceneId: number, page: number, limit: number, startAt: string, endAt: string): Promise<WayosAlarmLogResponse>;
    getAlarmLogListAllPages(sceneId: number, startAt: string, endAt: string): Promise<WayosAlarmLogItem[]>
}
