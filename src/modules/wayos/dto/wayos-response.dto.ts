// Wayos Device Info DTOs

export interface WayosGetDeviceInfo {
    login_at: string;
    logout_at: string;
    sn: string;
    name: string;
    online: boolean;
    model: string;
    sversion: string;
    plat: string;
    wan_ip: string;
    lan_ip: string;
    lan_mac: string;
    http_port: number;
    telnet_port: number;
    with_wifi: boolean;
    with_wifi_5g: boolean;
}

export interface WayosGetDeviceInfoResponse {
    code: number;
    msg: string;
    data: WayosGetDeviceInfo;
}

// User Scene List DTOs

export interface WayosUserScene {
    id: number;
    sn: string;
    name: string;
}

export interface WayosGetUserSceneListItem {
    id: number;
    create_at: string;
    update_at: string;
    expire_at: string;
    scene: WayosUserScene;
    scene_id: number;
    group_id: number;
    mode: number;
}

export interface WayosGetUserSceneData {
    total: number;
    list: WayosGetUserSceneListItem[];
}

export interface WayosGetUserSceneListResponse {
    code: number;
    msg: string;
    data: WayosGetUserSceneData;
}

export interface WayosGetDeviceOnlineUser {
    auth_type: number;
    conn_type: number;
    down_flow: number;
    ip: string;
    login_at: number;
    logout_at: number;
    mac: string;
    mfr: number;
    name: string;
    os: number;
    sn: string;
    ssid: string;
    status: number;
    ua: string;
    up_flow: number;
}

export interface WayosGetDeviceOnlineUserData {
    total: number;
    list: WayosGetDeviceOnlineUser[];
}

export interface WayosGetDeviceOnlineUserResponse {
    code: number;
    msg: string;
    data: WayosGetDeviceOnlineUserData;
}

export enum WayosAlarmType {
    DEV_ONLINE = 'dev_online',
    DEV_OFFLINE = 'dev_offline',
    DEV_ATTACKED = 'dev_attacked',
}

export interface WayosAlarmLogItem {
    id: string;
    create_at: string;
    update_at: string;
    happen_at: string;
    scene_id: number;
    sn: string;
    level: number;
    type: WayosAlarmType;
    msg: string;
    status: number;
    pushed: boolean;
}

export interface WayosAlarmLogData {
    total: number;
    list: WayosAlarmLogItem[];
}

export interface WayosAlarmLogResponse {
    code: number;
    msg: string;
    data: WayosAlarmLogData;
}

export interface WayosGetUserSceneSummeriredItem {
    id: number;
    create_at: string;
    update_at: string;
    login_at: string;
    logout_at: string;
    parent_id: number;
    scene_id: number;
    sn: string;
    name: string;
    online: boolean;
    type: number;
    svn: number;
    psvn: number;
    model: string;
    plat: string;
    sversion: string;
    start_at: number;
    wan_mac: string;
    lan_mac: string;
    wan_ip: string;
    lan_ip: string;
    public_ip: string;
    region: string;
    http_port: number;
    telnet_port: number;
    remark: string;
    alone: boolean;
    ui: number;
    third: boolean;
    group_id: number;
    acs_template: number;
    simet_label: string;
    sort_weight: number;
    latest_firmware: {
        id: number;
        from: number;
        model: string;
        sversion: string;
        svn: number;
        ui: number;
    } | null;
    group: any;
    scene: WayosUserScene;
}

export interface WayosGetUserSceneSummeriredData {
    total: number;
    list: WayosGetUserSceneSummeriredItem[];
}

export interface WayosGetUserSceneListSummeriredResponse {
    code: number;
    msg: string;
    data: WayosGetUserSceneSummeriredData;
}
