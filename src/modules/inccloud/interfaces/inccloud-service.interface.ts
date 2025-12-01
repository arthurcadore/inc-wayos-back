import { GetShopDevicePageResponse } from '../dto/inccloud-response.dto';

export interface IncCloudServiceInterface {
    getShopDevicePage(): Promise<GetShopDevicePageResponse>;
}
