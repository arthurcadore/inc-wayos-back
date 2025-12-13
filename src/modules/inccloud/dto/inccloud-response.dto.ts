export interface IncCloudResponseBase<T> {
    code: number;
    message: string;
    data: IncCloudDataBase<T>;
}

export interface IncCloudDataBase<T> {
    rowCount: number;
    data: T[];
}

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

export interface RegionDevice {
    regionId: number;
    regionName: string;
    shopId: number;
    shopName: string;
    deviceId: number;
    devAlias: string;
    customType: string;
    devModel: string;
    devType: number;
    devSn: string;
    url: string;
    status: number;
    devVer: string;
    softVer: string;
    versionNum: number;
    oldVer: string;
    verUpdateTime: number;
    verUpdateStatus: number;
    hardVer: string;
    powerOnTime: number;
    groupId: number;
    groupName: string;
    groupType: number;
    macAddr: string;
    addTime: number;
    firstOnlineTime: number;
    wifiStatus: string;
    rzxAuditStatus: string;
    xrAuditStatus: string;
    probeStatus: string;
    dpiStatus: string;
    versionList: any[];
    devIp: string;
    devBindStatus: any;
    devQR: any;
    devDesc: any;
    onlineTime: number;
    customTypeStr: string;
    verUpdateTimeStr: string;
    powerOnTimeStr: string;
    powerOnDurationStr: string;
    onlineTimeStr: string;
    onlineDurationStr: string;
    offlineTime: number;
    offlineTimeStr: string;
    offlineDurationStr: string;
    addTimeStr: string;
    firstOnlineTimeStr: string;
}
