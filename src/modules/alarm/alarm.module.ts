import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmModel } from './data/models/alarm.model';
import { AlarmCommentModel } from './data/models/alarm-comment.model';
import { ALARM_CONSTANTS } from './alarm.constants';
// import { CreateTestAlarmsSeed } from '../../database/seeds/create-test-alarms.seed';
import { AlarmController } from './controller/alarm.controller';
import { AlarmRepository } from './data/repositories/alarm.repository';

@Module({
    imports: [TypeOrmModule.forFeature([AlarmModel, AlarmCommentModel])],
    controllers: [AlarmController],
    providers: [
        {
            provide: ALARM_CONSTANTS.ALARM_REPOSITORY,
            useClass: AlarmRepository,
        },
        // CreateTestAlarmsSeed, // TODO: Remover essa classe após terminar o módulo de alarmes
    ],
    exports: [
        ALARM_CONSTANTS.ALARM_REPOSITORY,
    ],
})
export class AlarmModule { }
