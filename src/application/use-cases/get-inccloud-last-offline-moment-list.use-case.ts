import { Inject, Injectable } from '@nestjs/common';
import { RegionDevice } from 'src/modules/inccloud/dto/inccloud-response.dto';
import { INC_CLOUD_CONSTANTS } from 'src/modules/inccloud/inc-cloud.constants';
import type { IncCloudServiceInterface } from 'src/modules/inccloud/interfaces/inccloud-service.interface';

@Injectable()
export class GetInccloudLastOfflineMomentListUseCase {
    private readonly DAYS_RANGE = 30;

    constructor(
        @Inject(INC_CLOUD_CONSTANTS.INC_CLOUD_SERVICE)
        private readonly inccloudService: IncCloudServiceInterface,
    ) { }

    async execute(sn: string): Promise<RegionDevice[]> {
        const offlineMoments = await this.inccloudService.getRegionDevices1AllPages(sn);
        const filteredOfflineMoments = offlineMoments
            .filter(device => device.offlineTime && device.offlineTime > 0)
            .sort((a, b) => new Date(b.offlineTime).getTime() - new Date(a.offlineTime).getTime());
        return filteredOfflineMoments;
    }
}
