import { IncCloudResponseBase, RegionDevice, ShopDevice } from '../dto/inccloud-response.dto';

export interface IncCloudServiceInterface {
    getShopDevicePage(): Promise<ShopDevice[]>;
    getRegionDevices1(sn: string, start: number, size: number): Promise<IncCloudResponseBase<RegionDevice>>;
    getRegionDevices1AllPages(sn: string): Promise<RegionDevice[]>;
}
