import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ShopDeviceData } from 'src/modules/inccloud/dto/inccloud-response.dto';
import { INC_CLOUD_CONSTANTS } from 'src/modules/inccloud/inc-cloud.constants';
import type { IncCloudServiceInterface } from 'src/modules/inccloud/interfaces/inccloud-service.interface';
import type { WayosServiceInterface } from 'src/modules/wayos/interfaces/wayos-service.interface';
import { WAYOS_CONSTANTS } from 'src/modules/wayos/wayos.constants';

@Injectable()
export class ViewGlobalUseCase {
    private readonly WAYOS_PAGE_SIZE = 1000;
    private wayosRouterInfos: WayosRouterInfo[] = [];
    private shopDeviceData: ShopDeviceData;

    constructor(
        @Inject(WAYOS_CONSTANTS.WAYOS_SERVICE)
        private readonly wayosService: WayosServiceInterface,
        @Inject(INC_CLOUD_CONSTANTS.INC_CLOUD_SERVICE)
        private readonly incCloudService: IncCloudServiceInterface
    ) {}

    async execute(): Promise<ViewGlobalUseCaseOutput> {
        // Implemente um marcador de tempo para medir a duração total da operação
        const startTime = Date.now();
        // await this.getWayosUserScenes();
        // await this.getWayosDeviceInfos();
        await this.getIncCloudDevices();
        const endTime = Date.now();
        console.log(`Duração total da operação: ${endTime - startTime} ms`);
        return {
            // totalRouters: this.wayosRouterInfos.length,
            // onlineRouters: this.wayosRouterInfos.filter((router) => router.online).length,
            // wayosRouterInfos: this.wayosRouterInfos,
            shopDeviceData: this.shopDeviceData,
        };
    }

    async getWayosUserScenes(): Promise<void> {
        while (true) {
            const response = await this.wayosService.getUserSceneList(Math.floor(this.wayosRouterInfos.length / this.WAYOS_PAGE_SIZE) + 1, this.WAYOS_PAGE_SIZE);

            if (response.code !== 0) {
                throw new HttpException(response.msg || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // console.log('Fetched Wayos User Scenes:', response.data.list.length);

            this.wayosRouterInfos.push(
                ...response.data.list.map((item) => ({
                    sn: item.scene.sn,
                    inep: item.scene.name,
                    online: false // Placeholder, will be updated later
                }))
            );

            if (this.wayosRouterInfos.length >= response.data.total) {
                break;
            }
        }

        this.displayDataSize(this.wayosRouterInfos, 'WayOS Router');
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
                    routerInfo.online = response.data.online;
                }
                return routerInfo;
            });
        });

        for (let i = 0; i < tasks.length; i += concurrency) {
            await Promise.all(tasks.slice(i, i + concurrency).map((task) => task()));
        }

        this.displayDataSize(this.wayosRouterInfos, 'WayOS Router Infos');
    }

    async getIncCloudDevices(): Promise<void> {
        this.shopDeviceData = (await this.incCloudService.getShopDevicePage()).data;
        this.displayDataSize(this.shopDeviceData, 'IncCloud Shop Device Data');
    }

    async displayDataSize(value: any, name: string): Promise<void> {
        // Imprima no console o espaço em megabytes ocupado pelos dados recebidos
        const dataSizeInBytes = Buffer.byteLength(JSON.stringify(value), 'utf8');
        const dataSizeInMB = (dataSizeInBytes / (1024 * 1024)).toFixed(2);
        console.log(`Tamanho dos dados do ${name} recebidos: ${dataSizeInMB} MB`);
    }
}

export interface WayosRouterInfo {
    sn: string;
    inep: string;
    online: boolean;
}

export interface ViewGlobalUseCaseOutput {
    // totalRouters: number;
    // onlineRouters: number;
    // wayosRouterInfos: WayosRouterInfo[];
    shopDeviceData: ShopDeviceData;
}
