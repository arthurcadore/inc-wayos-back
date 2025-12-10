import { Inject, Injectable } from '@nestjs/common';
import { WayosAlarmLogItem, WayosAlarmType } from 'src/modules/wayos/dto/wayos-response.dto';
import type { WayosServiceInterface } from 'src/modules/wayos/interfaces/wayos-service.interface';
import { WAYOS_CONSTANTS } from 'src/modules/wayos/wayos.constants';
import { DateConverter } from 'src/shared/converters/date-converte';

@Injectable()
export class GetAlarmLogListUseCase {
    private readonly PAGE_SIZE = 10;
    private readonly DAYS_RANGE = 15;

    constructor(
        @Inject(WAYOS_CONSTANTS.WAYOS_SERVICE)
        private readonly wayosService: WayosServiceInterface,
    ) {}

    async execute(sceneId: number): Promise<WayosAlarmLogItem[]> {
        const endAtDate = new Date();
        const startAtDate = new Date(endAtDate);
        startAtDate.setDate(startAtDate.getDate() - this.DAYS_RANGE);

        const startAt = DateConverter.toISO8601(startAtDate);
        const endAt = DateConverter.toISO8601(endAtDate);

        const alarmLogs: WayosAlarmLogItem[] = [];

        while (true) {
            const response = await this.wayosService.getAlarmLogList(sceneId, Math.floor(alarmLogs.length / this.PAGE_SIZE) + 1, this.PAGE_SIZE, startAt, endAt);

            if (response.code !== 0) {
                throw new Error(response.msg || 'Internal Server Error');
            }

            alarmLogs.push(...response.data.list);

            if (alarmLogs.length >= response.data.total) {
                break;
            }
        }

        const filteredLogs = alarmLogs.filter(log => log.type === WayosAlarmType.DEV_OFFLINE)
        filteredLogs.sort((a, b) => new Date(b.happen_at).getTime() - new Date(a.happen_at).getTime());
        return filteredLogs;
    }
}
