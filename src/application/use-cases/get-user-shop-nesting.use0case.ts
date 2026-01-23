import { Inject, Injectable } from "@nestjs/common";
import { INC_CLOUD_CONSTANTS } from "src/modules/inccloud/inc-cloud.constants";
import type { IncCloudServiceInterface } from "src/modules/inccloud/interfaces/inccloud-service.interface";

@Injectable()
export class GetUserShopNestingUseCase {
    constructor(
        @Inject(INC_CLOUD_CONSTANTS.INC_CLOUD_SERVICE)
        private readonly inccloudService: IncCloudServiceInterface
    ) { }

    async execute(filteredBy: string): Promise<any[]> {
        const response = await this.inccloudService.getUserShopNesting();

        if (!response) {
            return [];
        }

        const branch = response.children.find(item => item.title === filteredBy);

        const shopsInfos: ShopInfoItem[] = [];

        for (const state of branch?.children || []) {
            for (const city of state.children) {
                for (const shop of city.shopsInfo) {
                    shopsInfos.push({
                        stateName: state.title,
                        cityName: city.title,
                        inep: shop.shopName.replaceAll(' ', '').toUpperCase(),
                        shopId: shop.shopId,
                        // customType: shop.customType,
                        type: shop.type,
                        devCnt: shop.devCnt,
                        devTypes: shop.devTypes
                    });
                }
            }
        }

        return shopsInfos;
    }
}

export interface ShopInfoItem {
    stateName: string;
    cityName: string;
    inep: string;
    shopId: number;
    // customType: number;
    type: string;
    devCnt: {
        [propName: string]: number[];
    };
    devTypes: string[];
}
