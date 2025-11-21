import {
    IncCloudDeviceOperationResponse,
    IncCloudShopResponse,
} from '../dto/inccloud-response.dto';

export interface IncCloudServiceInterface {
    getShops(): Promise<IncCloudShopResponse>;
    getDeviceOperations(
        devSN: string[],
    ): Promise<IncCloudDeviceOperationResponse>;
}
