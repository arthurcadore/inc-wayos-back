import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ShopDevice } from 'src/modules/inccloud/dto/inccloud-response.dto';
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
        await this.getWayosUserScenes();
        await this.getWayosDeviceInfos();
        this.parseDeviceItems();
        const endTime = Date.now();
        console.log(`Duração total da operação: ${PerformanceLogger.formatDuration(endTime - startTime)}`);
        return this.parseOutput();
    }

    private initializeProperties(): void {
        this.viewGlobalItems = [];
        this.wayosRouterInfos = [];
        this.shopDevices = [];
    }

    private adjustShopName(): void {
        for (const item of this.shopDevices) {
            item.shopName = item.shopName.replaceAll(' ', '').toUpperCase();
        }
    }

    async getIncCloudDevices(): Promise<void> {
        this.shopDevices = await this.incCloudService.getShopDevicePage();
        this.adjustShopName();
        PerformanceLogger.logDataSize(this.shopDevices, 'IncCloud Shop Device Data');
    }

    async getWayosUserScenes(): Promise<void> {
        while (true) {
            const response = await this.wayosService.getUserSceneList(Math.floor(this.wayosRouterInfos.length / this.WAYOS_PAGE_SIZE) + 1, this.WAYOS_PAGE_SIZE);

            if (response.code !== 0) {
                throw new HttpException(response.msg || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            console.log('Fetched Wayos User Scenes:', response.data.list.length);


            this.wayosRouterInfos.push(
                ...response.data.list.map((item) => ({
                    inep: item.scene.name,
                    sceneId: item.scene_id,
                    sn: item.scene.sn,
                    model: null,
                    wanIp: null,
                    lanIp: null,
                    lanMac: null,
                    online: false,
                }))
            );

            if (this.wayosRouterInfos.length >= response.data.total) {
                break;
            }
        }

        PerformanceLogger.logDataSize(this.wayosRouterInfos, 'WayOS Router');
    }

    async getWayosDeviceInfos(): Promise<void> {
        const concurrency = 50; // Number of concurrent requests
        const tasks = this.wayosRouterInfos.map((scene) => async () => {
            const response = await this.wayosService.getDeviceInfo(scene.sn);

            if (response.code !== 0) {
                throw new HttpException(response.msg || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // console.log('Fetched Wayos Device Info:', response.data.sn);

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
