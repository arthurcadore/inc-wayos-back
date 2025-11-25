import { WayosGetDeviceInfoResponse } from '../dto/wayos-response.dto';

export interface WayosServiceInterface {
    getDeviceInfo(sn: string): Promise<WayosGetDeviceInfoResponse>;
}
