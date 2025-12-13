import { ShopDevice } from '../dto/inccloud-response.dto';

export interface IncCloudServiceInterface {
    getShopDevicePage(): Promise<ShopDevice[]>
}
