/// ### Shop DTOs ### ///

export interface IncCloudShop {
    userName: string;
    shopId: number;
    shopName: string;
    province: string;
    city: string;
    area: string;
    address: string;
    phone: string;
    scenarioName: string;
    columns: unknown[] | null;
}

export interface IncCloudShopResponse {
    code: number;
    message: string;
    data: IncCloudShop[];
}

/// ### Device Operation DTOs ### ///

export interface IncCloudDeviceLocation {
    country: string;
    province: string;
    city: string;
}

export interface IncCloudDeviceOperation {
    devSN: string;
    devName: string;
    devHardVersion: string;
    devSoftVersion: string;
    devMode: string;
    devType: string;
    devOnlineTime: number;
    devLocation: IncCloudDeviceLocation;
    devAddress: string;
    devMAC: string;
    memoryTotalSize: number;
    diskTotalSize: number;
    devStatus: string;
}

export interface IncCloudDeviceOperationResponse {
    code: number;
    message: string;
    data: IncCloudDeviceOperation[];
}
