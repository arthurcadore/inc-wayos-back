export interface ShopDeviceItem {
    shopId: number;
    shopName: string;
    customType: string;
    devModel: string;
    devSn: string;
    status: number;
    onlineTime: number;
    firstOnlineTime: number;
    aliasName: string;
    devType: string;
}

export interface ShopDeviceData {
    rowCount: number;
    data: ShopDeviceItem[];
}

export interface GetShopDevicePageResponse {
    code: number;
    message: string;
    data: ShopDeviceData;
}
