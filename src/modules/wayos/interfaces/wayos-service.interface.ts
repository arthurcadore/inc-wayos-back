import { WayosUserSceneResponse } from '../dto/wayos-response.dto';

export interface WayosServiceInterface {
    getDeviceInfo(sn: string): Promise<WayosUserSceneResponse>;
}
