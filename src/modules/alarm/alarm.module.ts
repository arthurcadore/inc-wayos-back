import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alarm } from './entities/alarm.entity';
import { AlarmComment } from './entities/alarm-comment.entity';
import { ALARM_CONSTANTS } from './alarm.constants';
import { CreateTestAlarmsSeed } from '../../database/seeds/create-test-alarms.seed';
import { AlarmController } from './controller/alarm.controller';
import { AlarmInMemoryRepository } from './repositories/alarm.in-memory.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Alarm, AlarmComment])],
    controllers: [AlarmController],
    providers: [
        {
            provide: ALARM_CONSTANTS.ALARM_REPOSITORY,
            useClass: AlarmInMemoryRepository,
        },
        CreateTestAlarmsSeed, // TODO: Remover essa classe após terminar o módulo de alarmes
    ],
    exports: [
        ALARM_CONSTANTS.ALARM_REPOSITORY,
    ],
})
export class AlarmModule { }
