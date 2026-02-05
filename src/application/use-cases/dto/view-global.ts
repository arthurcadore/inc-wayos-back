export function backupScriptStatusParser(value: number): string {
    switch (value) {
        case 0:
            return 'Desconhecido';
        case 1:
            return 'Sincronizado';
        case 2:
            return 'Não Sincronizado';
        case 3:
            return 'Falha de resolução';
        case 4:
            return 'Falha de Download';
        default:
            return 'n/d';
    }
}

export interface WayosRouterInfo {
    inep: string;
    sceneId: number;
    sn: string;
    simetBox: string | null;
    backupScriptStatus : string | null;
    model: string | null;
    wanIp: string | null;
    lanIp: string | null;
    lanMac: string | null;
    online: boolean;
    lastOnlineTime: string | null;
}

export interface IncCloudDevice {
    devType: string;
    sn: string;
    online: boolean;
    onlineTime: number;
    firstOnlineTime: number;
    aliasName: string;
    devIp: string;
    devMac: string;
}

export interface ViewGlobalItem {
    inep: string;
    shopId: number;
    installedDevices: boolean;
    city: string;
    router: WayosRouterInfo;
    switches: IncCloudDevice[]; // devType === 'SWITCH'
    aps: IncCloudDevice[]; // devType === 'CLOUDAP'
}

export interface ViewGlobalUseCaseOutput {
    refreshedAt: string;

    totalRouters: number;
    onlineRouters: number;

    totalSwitches: number;
    onlineSwitches: number;

    totalAps: number;
    onlineAps: number;

    totalInstalledSites: number;
    totalUninstalledSites: number;

    data: ViewGlobalItem[];
}
