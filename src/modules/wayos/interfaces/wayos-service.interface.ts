import { WayosGetDeviceInfoResponse, WayosGetUserSceneListResponse } from '../dto/wayos-response.dto';

export interface WayosServiceInterface {
    getUserSceneList(page: number, limit: number): Promise<WayosGetUserSceneListResponse>;
    getDeviceInfo(sn: string): Promise<WayosGetDeviceInfoResponse>;
}
