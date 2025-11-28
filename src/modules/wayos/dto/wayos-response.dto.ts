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
