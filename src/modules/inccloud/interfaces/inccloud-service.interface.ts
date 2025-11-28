import { GetShopDevicePageResponse, IncCloudDeviceOperationResponse, IncCloudShopResponse } from '../dto/inccloud-response.dto';

export interface IncCloudServiceInterface {
    getShopDevicePage(): Promise<GetShopDevicePageResponse>;
    getShops(): Promise<IncCloudShopResponse>;
    getDeviceOperations(devSN: string[]): Promise<IncCloudDeviceOperationResponse>;
}
