import {
    CommonTopoLinkData,
    CommonTopoNode,
    IncCloudAlarmItem,
    IncCloudResponseBase,
    RegionDevice,
    ShopDevice,
} from '../dto/inccloud-response.dto';

export interface IncCloudServiceInterface {
    getShopDevicePage(): Promise<ShopDevice[]>;
    getRegionDevices1(sn: string, start: number, size: number): Promise<IncCloudResponseBase<RegionDevice>>;
    getRegionDevices1AllPages(sn: string): Promise<RegionDevice[]>;
    getIncCloudAlarmHistoryList(devSn: string, pageNum: number, pageSize: number, startTime: number, endTime: number): Promise<IncCloudAlarmItem[]>;
    commonTopoNodes(shopId: number): Promise<CommonTopoNode[]>;
    commonTopoLinks(shopId: number): Promise<CommonTopoLinkData>;
}
