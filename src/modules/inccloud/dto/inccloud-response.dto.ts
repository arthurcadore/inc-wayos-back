export interface ShopDevice {
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

export interface IncCloudDataBase<T> {
    rowCount: number;
    data: T[];
}

export interface IncCloudResponseBase<T> {
    code: number;
    message: string;
    data: IncCloudDataBase<T>;
}
