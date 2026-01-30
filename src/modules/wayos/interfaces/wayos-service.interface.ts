import {
    WayosAlarmLogItem,
    WayosAlarmLogResponse,
    WayosGetDeviceInfoResponse,
    WayosGetDeviceOnlineUserResponse,
    WayosGetUserSceneListItem,
    WayosGetUserSceneListResponse,
    WayosGetUserSceneListSummeriredResponse,
    WayosGetUserSceneSummeriredItem,
} from '../dto/wayos-response.dto';

export interface WayosServiceInterface {
    deviceLoad(sn: string): Promise<any>;
    getUserSceneListSummerired(page: number, limit: number): Promise<WayosGetUserSceneListSummeriredResponse>;
    getUserSceneListSummeriredAllPages(): Promise<WayosGetUserSceneSummeriredItem[]>;
    getUserSceneList(page: number, limit: number): Promise<WayosGetUserSceneListResponse>;
    getUserSceneListAllPages(): Promise<WayosGetUserSceneListItem[]>;
    getDeviceInfo(sn: string): Promise<WayosGetDeviceInfoResponse>;
    getDeviceOnlineUser(sn: string): Promise<WayosGetDeviceOnlineUserResponse>;
    getAlarmLogList(sceneId: number, page: number, limit: number, startAt: string, endAt: string): Promise<WayosAlarmLogResponse>;
    getAlarmLogListAllPages(sceneId: number, startAt: string, endAt: string): Promise<WayosAlarmLogItem[]>;
}
