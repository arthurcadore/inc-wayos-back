import { Inject, Injectable } from '@nestjs/common';
import { INC_CLOUD_CONSTANTS } from 'src/modules/inccloud/inc-cloud.constants';
import type { IncCloudService } from 'src/modules/inccloud/services/inccloud.service';
import { WayosAlarmLogItem, WayosAlarmType } from 'src/modules/wayos/dto/wayos-response.dto';
import type { WayosServiceInterface } from 'src/modules/wayos/interfaces/wayos-service.interface';
import { WAYOS_CONSTANTS } from 'src/modules/wayos/wayos.constants';
import { DateConverter } from 'src/shared/converters/date-converte';
import { delay } from 'src/shared/utils/delay';
import * as data from 'src/alarms-response.json';

@Injectable()
export class GetAlarmLogListUseCase {

    constructor(
        @Inject(WAYOS_CONSTANTS.WAYOS_SERVICE)
        private readonly wayosService: WayosServiceInterface,
        @Inject(INC_CLOUD_CONSTANTS.INC_CLOUD_SERVICE)
        private readonly incCloudService: IncCloudService,
    ) { }

    async execute({ deviceType, value, dayRange }: GetAlarmLogInput): Promise<any[]> {
        await delay(1500);
        return data.list;

        // let alarmLogs: any[] = [];
        // const { startAt, endAt } = DateConverter.createRangeDates(dayRange);

        // if (deviceType === 'router') {
        //     alarmLogs = await this.wayosService.getAlarmLogListAllPages(parseInt(value), startAt, endAt);
        // } else if (deviceType === 'switch' || deviceType === 'ap') {
        //     const { startAt, endAt } = DateConverter.createRangeDates(this.DAYS_RANGE);
        //     const alarmLogs = await this.incCloudService.getAlarmLogListAllPages(deviceIds, startAt, endAt);
        //     return alarmLogs;
        //     return [];
        // }

        // return alarmLogs;
    }
}

export interface GetAlarmLogInput {
    deviceType: 'router' | 'switch' | 'ap';
    value: any;
    dayRange: number;
}
