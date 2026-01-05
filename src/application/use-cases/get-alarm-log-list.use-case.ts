import { Inject, Injectable } from '@nestjs/common';
import { INC_CLOUD_CONSTANTS } from 'src/modules/inccloud/inc-cloud.constants';
import type { IncCloudService } from 'src/modules/inccloud/services/inccloud.service';
import type { WayosServiceInterface } from 'src/modules/wayos/interfaces/wayos-service.interface';
import { WAYOS_CONSTANTS } from 'src/modules/wayos/wayos.constants';
import { ALARM_CONSTANTS } from 'src/modules/alarm/alarm.constants';
import { AlarmMapper } from 'src/modules/alarm/mappers/alarm.mapper';
import { AlarmResponseDto } from 'src/modules/alarm/dto/alarm-response.dto';
import type { AlarmRepositoryInterface } from 'src/modules/alarm/interfaces/alarm-repository.interface';

@Injectable()
export class GetAlarmLogListUseCase {

    constructor(
        @Inject(WAYOS_CONSTANTS.WAYOS_SERVICE)
        private readonly wayosService: WayosServiceInterface,
        @Inject(INC_CLOUD_CONSTANTS.INC_CLOUD_SERVICE)
        private readonly incCloudService: IncCloudService,

        @Inject(ALARM_CONSTANTS.ALARM_REPOSITORY)
        private readonly alarmInMemoryRepository: AlarmRepositoryInterface,
    ) { }

    async execute({ deviceType, value, dayRange }: GetAlarmLogInput): Promise<AlarmResponseDto[]> {
        // Mocked response for development purposes
        const alarms = await this.alarmInMemoryRepository.findByExternalId(value);
        return AlarmMapper.toDtoList(alarms, true);

        // Implemwntar lógica real.
    }
}

export interface GetAlarmLogInput {
    deviceType: 'router' | 'switch' | 'ap';
    value: any;
    dayRange: number;
}
