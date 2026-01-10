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

export interface IncCloudAlarmItem {
    id: number;
    userId: number;
    userName: string;
    shopId: number;
    shopName: string;
    level: number;
    alarmTime: number;
    alarmValue: any | null;
    status: number;
    clearTime: any | null;
    alarmNumber: any | null;
    module: any | null;
    alarmTypeName: string;
    alarmTypeName_en: string;
    alarmType: string;
    alarmTypeNumber: number;
    message: string;
    message_en: string;
    detail: string;
    detail_en: string;
    devType: string;
    devSn: string;
    devName: string;
    dayLabel: number;
    hourLabel: number;
    fiveMinLabel: number;
    readStatus: number;
    remark: any | null;
    regionId: any | null;
    regionName: string;
    mac: any | null;
    ifName: any | null;
    tunnelId: any | null;
    tunnelName: any | null;
    updatedTime: any | null;
    expireTime: number;
    ip: any | null;
}

export interface IncCloudAlarmHistoryList {
    code: number;
    message: string;
    data: {
        size: any | null;
        start: any | null;
        level: any | null;
        levels: any | null;
        status: any | null;
        alarmTypeName: any | null;
        alarmTypeName_en: any | null;
        shopName: any | null;
        devSn: any | null;
        detail: any | null;
        detail_en: any | null;
        devName: any | null;
        devType: any | null;
        shopIds: any | null;
        alarmTime: any | null;
        clearTime: any | null;
        count: number;
        todayNotClearedCount: number;
        historyList: IncCloudAlarmItem[];
        startTime: any | null;
        endTime: any | null;
        order: any | null;
        sort: any | null;
        regionName: any | null;
        timeType: any | null;
        alarmTypeList: any | null;
    };
}
