import { Inject, Injectable } from '@nestjs/common';
import { ShopDevice } from 'src/modules/inccloud/dto/inccloud-response.dto';
import { INC_CLOUD_CONSTANTS } from 'src/modules/inccloud/inc-cloud.constants';
import type { IncCloudServiceInterface } from 'src/modules/inccloud/interfaces/inccloud-service.interface';
import type { WayosServiceInterface } from 'src/modules/wayos/interfaces/wayos-service.interface';
import { WAYOS_CONSTANTS } from 'src/modules/wayos/wayos.constants';
import { PerformanceLogger } from 'src/shared/utils/performance-logger';
import { IncCloudDevice, ViewGlobalItem, ViewGlobalUseCaseOutput, WayosRouterInfo } from './dto/view-global';

@Injectable()
export class ViewGlobalUseCase {
    constructor(
        @Inject(WAYOS_CONSTANTS.WAYOS_SERVICE)
        private readonly wayosService: WayosServiceInterface,
        @Inject(INC_CLOUD_CONSTANTS.INC_CLOUD_SERVICE)
        private readonly incCloudService: IncCloudServiceInterface
    ) { }

    async execute(): Promise<ViewGlobalUseCaseOutput> {
        const startTime = Date.now();

        const shopDevices = await this.getIncCloudDevices();
        const wayosRouterInfos = await this.getWayosUserScenesSummarired();
        const viewGlobalItems: ViewGlobalItem[] = [];

        viewGlobalItems.push(
            ...wayosRouterInfos.map((item) => ({
                inep: item.inep,
                shopId: shopDevices.find(sd => sd.shopName === item.inep)?.shopId!,
                city: 'n/d',
                router: item,
                switches: [],
                aps: [],
            }))
        );

        this.parseDeviceItems(shopDevices, viewGlobalItems);
        await this.updateRegionName(viewGlobalItems);

        const endTime = Date.now();
        console.log(`Duração total da operação: ${PerformanceLogger.formatDuration(endTime - startTime)}`);

        return this.parseOutput(viewGlobalItems);
    }

    async getIncCloudDevices(): Promise<ShopDevice[]> {
        let shopDevices = await this.incCloudService.getShopDevicePage();

        // Normalizar shopName
        for (const item of shopDevices) {
            item.shopName = item.shopName.replaceAll(' ', '').toUpperCase();
        }

        // Filtrar shopDevices com shopName que correspondem ao padrão INEP-XXXXXXXX
        shopDevices = shopDevices.filter((item) => {
            const regex = /^INEP-\d{8}$/;
            return regex.test(item.shopName);
        });

        PerformanceLogger.logDataSize(shopDevices, 'IncCloud Shop Device Data');

        return shopDevices;
    }

    async getWayosUserScenesSummarired(): Promise<WayosRouterInfo[]> {
        let userScenes = await this.wayosService.getUserSceneListSummeriredAllPages();

        // Normalizar scene.name
        for (const item of userScenes) {
            item.scene.name = item.scene.name.replaceAll(' ', '').toUpperCase();
        }

        const regex = /^INEP-\d{8}$/;
        userScenes = userScenes.filter(item => regex.test(item.scene.name));

        const wayosRouterInfos: WayosRouterInfo[] = userScenes.map((item) => ({
            inep: item.scene.name,
            sceneId: item.scene_id,
            sn: item.scene.sn,
            model: item.model,
            wanIp: item.wan_ip,
            lanIp: item.lan_ip,
            lanMac: item.lan_mac,
            online: item.online,
        }));

        PerformanceLogger.logDataSize(wayosRouterInfos, 'WayOS Router Summarired');

        return wayosRouterInfos;
    }

    parseDeviceItems(shopDevices: ShopDevice[], viewGlobalItems: ViewGlobalItem[]): void {
        // Agrupar shopDeviceItems por shopName (INEP)
        const groupedDevicesByInep: Record<string, IncCloudDevice[]> = {};

        for (const item of shopDevices) {
            const device: IncCloudDevice = {
                devType: item.devType,
                sn: item.devSn,
                online: item.status === 1,
                onlineTime: item.onlineTime,
                firstOnlineTime: item.firstOnlineTime,
                aliasName: item.aliasName,
                devIp: 'n/d',
                devMac: 'n/d',
            };

            const inep = item.shopName.replaceAll(' ', '').toUpperCase();

            if (!groupedDevicesByInep[inep]) {
                groupedDevicesByInep[inep] = [];
            }

            groupedDevicesByInep[inep].push(device);
        }

        // Mapear dispositivos agrupados para viewGlobalItems
        for (const inep in groupedDevicesByInep) {
            const targetItem = viewGlobalItems.find((item) => item.inep === inep);

            if (targetItem) {
                const devices = groupedDevicesByInep[inep];
                targetItem.switches = devices.filter((device) => device.devType.startsWith('SWITCH'));
                targetItem.aps = devices.filter((device) => device.devType.startsWith('CLOUDAP'));
            }
        }

        PerformanceLogger.logDataSize(viewGlobalItems, 'View Global Items after IncCloud');
    }

    async updateRegionName(viewGlobalItems: ViewGlobalItem[]): Promise<void> {
        const regionDevices = await this.incCloudService.getRegionDevices1AllPages('');
        const groupedRegionDevicesByInep: Record<string, string> = {};

        for (const device of regionDevices) {
            device.shopName = device.shopName.replaceAll(' ', '').toUpperCase();

            if (!groupedRegionDevicesByInep[device.shopName]) {
                groupedRegionDevicesByInep[device.shopName] = device.regionName;
            }
        }

        for (const inep in groupedRegionDevicesByInep) {
            const targetItem = viewGlobalItems.find((item) => item.inep === inep);

            if (targetItem) {
                targetItem.city = groupedRegionDevicesByInep[inep];

                targetItem.switches.forEach((sw) => {
                    const regionDevice = regionDevices.find(rd => rd.devSn === sw.sn);
                    if (regionDevice) {
                        sw.devIp = regionDevice.devIp;
                        sw.devMac = regionDevice.macAddr;
                    }
                });

                targetItem.aps.forEach((ap) => {
                    const regionDevice = regionDevices.find(rd => rd.devSn === ap.sn);
                    if (regionDevice) {
                        ap.devIp = regionDevice.devIp;
                        ap.devMac = regionDevice.macAddr;
                    }
                });
            }
        }
    }

    parseOutput(viewGlobalItems: ViewGlobalItem[]): ViewGlobalUseCaseOutput {
        const output: ViewGlobalUseCaseOutput = {
            refreshedAt: new Date().toISOString(),

            totalRouters: viewGlobalItems.length,
            onlineRouters: viewGlobalItems.filter((item) => item.router.online).length,

            totalSwitches: viewGlobalItems.reduce((sum, item) => sum + item.switches.length, 0),
            onlineSwitches: viewGlobalItems.reduce((sum, item) => sum + item.switches.filter((sw) => sw.online).length, 0),

            totalAps: viewGlobalItems.reduce((sum, item) => sum + item.aps.length, 0),
            onlineAps: viewGlobalItems.reduce((sum, item) => sum + item.aps.filter((ap) => ap.online).length, 0),

            data: viewGlobalItems,
        };

        return output;
    }
}
