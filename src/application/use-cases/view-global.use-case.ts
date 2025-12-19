import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegionDevice, ShopDevice } from 'src/modules/inccloud/dto/inccloud-response.dto';
import { INC_CLOUD_CONSTANTS } from 'src/modules/inccloud/inc-cloud.constants';
import type { IncCloudServiceInterface } from 'src/modules/inccloud/interfaces/inccloud-service.interface';
import type { WayosServiceInterface } from 'src/modules/wayos/interfaces/wayos-service.interface';
import { WAYOS_CONSTANTS } from 'src/modules/wayos/wayos.constants';
import { PerformanceLogger } from 'src/shared/utils/performance-logger';
import { IncCloudDevice, ViewGlobalItem, ViewGlobalUseCaseOutput, WayosRouterInfo } from './dto/view-global';

@Injectable()
export class ViewGlobalUseCase {
    private readonly WAYOS_PAGE_SIZE = 1000;

    private viewGlobalItems: ViewGlobalItem[] = [];
    private wayosRouterInfos: WayosRouterInfo[] = [];
    private shopDevices: ShopDevice[] = [];

    constructor(
        @Inject(WAYOS_CONSTANTS.WAYOS_SERVICE)
        private readonly wayosService: WayosServiceInterface,
        @Inject(INC_CLOUD_CONSTANTS.INC_CLOUD_SERVICE)
        private readonly incCloudService: IncCloudServiceInterface
    ) { }

    async execute(): Promise<ViewGlobalUseCaseOutput> {
        const startTime = Date.now();
        this.initializeProperties();
        await this.getIncCloudDevices();
        await this.getWayosUserScenesSummarired();
        // await this.getWayosUserScenes();
        // await this.getWayosDeviceInfos();
        this.parseDeviceItems();
        await this.updateRegionName();
        const endTime = Date.now();
        console.log(`Duração total da operação: ${PerformanceLogger.formatDuration(endTime - startTime)}`);
        return this.parseOutput();
    }

    private initializeProperties(): void {
        this.viewGlobalItems = [];
        this.wayosRouterInfos = [];
        this.shopDevices = [];
    }

    async getIncCloudDevices(): Promise<void> {
        this.shopDevices = await this.incCloudService.getShopDevicePage();

        // Normalizar shopName
        for (const item of this.shopDevices) {
            item.shopName = item.shopName.replaceAll(' ', '').toUpperCase();
        }

        // Filtrar shopDevices com shopName que correspondem ao padrão INEP-XXXXXXXX
        this.shopDevices = this.shopDevices.filter((item) => {
            const regex = /^INEP-\d{8}$/;
            return regex.test(item.shopName);
        });

        PerformanceLogger.logDataSize(this.shopDevices, 'IncCloud Shop Device Data');
    }

    async getWayosUserScenesSummarired(): Promise<void> {
        let userScenes = await this.wayosService.getUserSceneListSummeriredAllPages();

        // Normalizar scene.name
        for (const item of userScenes) {
            item.scene.name = item.scene.name.replaceAll(' ', '').toUpperCase();
        }

        const regex = /^INEP-\d{8}$/;
        userScenes = userScenes.filter(item => regex.test(item.scene.name));

        this.wayosRouterInfos = userScenes.map((item) => ({
            inep: item.scene.name,
            sceneId: item.scene_id,
            sn: item.scene.sn,
            model: item.model,
            wanIp: item.wan_ip,
            lanIp: item.lan_ip,
            lanMac: item.lan_mac,
            online: item.online,
        }));

        this.viewGlobalItems.push(
            ...this.wayosRouterInfos.map((item) => ({
                inep: item.inep,
                city: 'n/d',
                router: item,
                switches: [],
                aps: [],
            }))
        );

        PerformanceLogger.logDataSize(this.wayosRouterInfos, 'WayOS Router Summarired');
    }

    /**
     * @deprecated Use getWayosUserScenesSummarired instead
     */
    async getWayosUserScenes(): Promise<void> {
        let userScenes = await this.wayosService.getUserSceneListAllPages();

        // Normalizar scene.name
        for (const item of userScenes) {
            item.scene.name = item.scene.name.replaceAll(' ', '').toUpperCase();
        }

        const regex = /^INEP-\d{8}$/;

        // const ineps = userScenes.map(item => item.scene.name);
        // const uniqueIneps = Array.from(new Set(ineps));
        // const filteredIneps = uniqueIneps.filter(inep => !regex.test(inep));

        this.wayosRouterInfos = userScenes
            // Filtrar cenas com nomes que correspondem ao padrão INEP-XXXXXXXX
            .filter(item => regex.test(item.scene.name))
            .map((item) => ({
                inep: item.scene.name,
                sceneId: item.scene_id,
                sn: item.scene.sn,
                model: null,
                wanIp: null,
                lanIp: null,
                lanMac: null,
                online: false,
            }));

        PerformanceLogger.logDataSize(this.wayosRouterInfos, 'WayOS Router');
    }

    /**
     * @deprecated Use getWayosUserScenesSummarired instead
     */
    async getWayosDeviceInfos(): Promise<void> {
        const concurrency = 100; // Number of concurrent requests
        const tasks = this.wayosRouterInfos.map((scene) => async () => {
            const response = await this.wayosService.getDeviceInfo(scene.sn);

            if (response.code !== 0) {
                throw new HttpException(response.msg || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            this.wayosRouterInfos = this.wayosRouterInfos.map((routerInfo) => {
                if (routerInfo.sn === response.data.sn) {
                    routerInfo.model = response.data.model;
                    routerInfo.wanIp = response.data.wan_ip;
                    routerInfo.lanIp = response.data.lan_ip;
                    routerInfo.lanMac = response.data.lan_mac;
                    routerInfo.online = response.data.online;
                }
                return routerInfo;
            });
        });

        for (let i = 0; i < tasks.length; i += concurrency) {
            await Promise.all(tasks.slice(i, i + concurrency).map((task) => task()));
        }

        this.viewGlobalItems.push(
            ...this.wayosRouterInfos.map((item) => ({
                inep: item.inep,
                city: 'n/d',
                router: item,
                switches: [],
                aps: [],
            }))
        );

        PerformanceLogger.logDataSize(this.wayosRouterInfos, 'WayOS Router Infos');
    }

    parseDeviceItems(): void {
        // Agrupar shopDeviceItems por shopName (INEP)
        const groupedDevicesByInep: Record<string, IncCloudDevice[]> = {};

        for (const item of this.shopDevices) {
            const device: IncCloudDevice = {
                devType: item.devType,
                sn: item.devSn,
                online: item.status === 1,
                onlineTime: item.onlineTime,
                firstOnlineTime: item.firstOnlineTime,
                aliasName: item.aliasName,
            };

            const inep = item.shopName.replaceAll(' ', '').toUpperCase();

            if (!groupedDevicesByInep[inep]) {
                groupedDevicesByInep[inep] = [];
            }

            groupedDevicesByInep[inep].push(device);
        }

        // Mapear dispositivos agrupados para viewGlobalItems
        for (const inep in groupedDevicesByInep) {
            const targetItem = this.viewGlobalItems.find((item) => item.inep === inep);

            if (targetItem) {
                const devices = groupedDevicesByInep[inep];
                targetItem.switches = devices.filter((device) => device.devType.startsWith('SWITCH'));
                targetItem.aps = devices.filter((device) => device.devType.startsWith('CLOUDAP'));
            }
        }

        PerformanceLogger.logDataSize(this.viewGlobalItems, 'View Global Items after IncCloud');
    }

    async updateRegionName(): Promise<void> {
        const regionDevices = await this.incCloudService.getRegionDevices1AllPages('');
        const groupedRegionDevicesByInep: Record<string, string> = {};

        for (const device of regionDevices) {
            device.shopName = device.shopName.replaceAll(' ', '').toUpperCase();

            if (!groupedRegionDevicesByInep[device.shopName]) {
                groupedRegionDevicesByInep[device.shopName] = device.regionName;
            }
        }

        for (const inep in groupedRegionDevicesByInep) {
            const targetItem = this.viewGlobalItems.find((item) => item.inep === inep);

            if (targetItem) {
                targetItem.city = groupedRegionDevicesByInep[inep];
            }
        }
    }

    parseOutput(): ViewGlobalUseCaseOutput {
        const output: ViewGlobalUseCaseOutput = {
            refreshedAt: new Date().toISOString(),

            totalRouters: this.viewGlobalItems.length,
            onlineRouters: this.viewGlobalItems.filter((item) => item.router.online).length,

            totalSwitches: this.viewGlobalItems.reduce((sum, item) => sum + item.switches.length, 0),
            onlineSwitches: this.viewGlobalItems.reduce((sum, item) => sum + item.switches.filter((sw) => sw.online).length, 0),

            totalAps: this.viewGlobalItems.reduce((sum, item) => sum + item.aps.length, 0),
            onlineAps: this.viewGlobalItems.reduce((sum, item) => sum + item.aps.filter((ap) => ap.online).length, 0),

            data: this.viewGlobalItems,
        };

        return output;
    }
}
