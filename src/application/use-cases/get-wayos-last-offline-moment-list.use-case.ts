import { Inject, Injectable } from '@nestjs/common';
import { WayosAlarmLogItem, WayosAlarmType } from 'src/modules/wayos/dto/wayos-response.dto';
import { WAYOS_CONSTANTS } from 'src/modules/wayos/wayos.constants';
import type { WayosServiceInterface } from 'src/modules/wayos/interfaces/wayos-service.interface';
import { DateConverter } from 'src/shared/converters/date-converte';

@Injectable()
export class GetWayosLastOfflineMomentListUseCase {
    private readonly DAYS_RANGE = 30;

    constructor(
        @Inject(WAYOS_CONSTANTS.WAYOS_SERVICE)
        private readonly wayosService: WayosServiceInterface,
    ) { }

    async execute(sceneId: number): Promise<WayosAlarmLogItem[]> {
        const { startAt, endAt } = DateConverter.createRangeDates(this.DAYS_RANGE);
        const alarmLogs = await this.wayosService.getAlarmLogListAllPages(sceneId, startAt, endAt);
        const filteredLogs = alarmLogs.filter(log => log.type === WayosAlarmType.DEV_OFFLINE)
        filteredLogs.sort((a, b) => new Date(b.happen_at).getTime() - new Date(a.happen_at).getTime());
        return filteredLogs;
    }
}
