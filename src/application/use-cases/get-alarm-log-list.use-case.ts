import { Inject, Injectable } from '@nestjs/common';
import { INC_CLOUD_CONSTANTS } from 'src/modules/inccloud/inc-cloud.constants';
import type { IncCloudService } from 'src/modules/inccloud/services/inccloud.service';
import type { WayosServiceInterface } from 'src/modules/wayos/interfaces/wayos-service.interface';
import { WAYOS_CONSTANTS } from 'src/modules/wayos/wayos.constants';
import { ALARM_CONSTANTS } from 'src/modules/alarm/alarm.constants';
import { AlarmMapper } from 'src/modules/alarm/mappers/alarm.mapper';
import { AlarmResponseDto } from 'src/modules/alarm/dto/alarm-response.dto';
import type { AlarmRepositoryInterface } from 'src/modules/alarm/interfaces/alarm-repository.interface';
import { DeviceType } from 'src/domain/object-values/device-type';
import { DateConverter } from 'src/shared/converters/date-converte';
import { Alarm } from 'src/modules/alarm/domain/entities/alarm.entity';

@Injectable()
export class GetAlarmLogListUseCase {

    constructor(
        @Inject(WAYOS_CONSTANTS.WAYOS_SERVICE)
        private readonly wayosService: WayosServiceInterface,
        @Inject(INC_CLOUD_CONSTANTS.INC_CLOUD_SERVICE)
        private readonly incCloudService: IncCloudService,

        @Inject(ALARM_CONSTANTS.ALARM_REPOSITORY)
        private readonly alarmRepository: AlarmRepositoryInterface,
    ) { }

    async execute({ deviceType, value, dayRange }: GetAlarmLogInput): Promise<AlarmResponseDto[]> {
        let alarmListFromApi: any[] = [];

        if (deviceType === DeviceType.Router) {
            const { startAt, endAt } = DateConverter.createRangeDateStgs(dayRange);
            const alarms = await this.wayosService.getAlarmLogListAllPages(Number.parseInt(value), startAt, endAt);
            const onlyOfflineAlarms = alarms.filter(alarm => alarm.type === 'dev_offline') || [];

            if (onlyOfflineAlarms.length === 0) {
                return [];
            }

            alarmListFromApi = onlyOfflineAlarms.map(alarm => ({
                externalId: alarm.id,
                title: alarm.type,
                deviceType: DeviceType.Router,
                createAt: alarm.happen_at,
            }));
        } else if (deviceType === DeviceType.Switch || deviceType === DeviceType.AccessPoint) {
            const { startAt, endAt } = DateConverter.createRangeDates(dayRange);
            const alarms = await this.incCloudService.getIncCloudAlarmHistoryList(value, 1, 100, startAt.getTime(), endAt.getTime());

            if (!alarms || alarms.length === 0) {
                return [];
            }

            alarmListFromApi = alarms.map(alarm => ({
                externalId: alarm.id,
                title: alarm.alarmTypeName_en,
                deviceType: deviceType,
                createAt: new Date(alarm.alarmTime),
            }));
        } else {
            throw new Error('Unsupported device type');
        }

        const alarms: Alarm[] = [];

        for (const alarmData of alarmListFromApi) {
            const existingAlarm = await this.alarmRepository.findByExternalId(alarmData.externalId);
            if (existingAlarm) {
                alarms.push(existingAlarm);
            } else {
                const newAlarm = Alarm.create(
                    alarmData.externalId,
                    alarmData.deviceType,
                    alarmData.title,
                    alarmData.createAt,
                );
                await this.alarmRepository.save(newAlarm);
                alarms.push(newAlarm);
            }

        }

        return AlarmMapper.toDtoList(alarms, true);
    }
}

export interface GetAlarmLogInput {
    deviceType: 'router' | 'switch' | 'ap';
    value: any;
    dayRange: number;
}
