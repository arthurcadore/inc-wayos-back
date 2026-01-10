import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ALARM_CONSTANTS } from '../../modules/alarm/alarm.constants';
import type { AlarmRepositoryInterface } from 'src/modules/alarm/interfaces/alarm-repository.interface';
import { DeviceType } from 'src/domain/object-values/device-type';
import { Alarm } from 'src/modules/alarm/domain/entities/alarm.entity';

@Injectable()
export class CreateTestAlarmsSeed implements OnModuleInit {
    constructor(
        @Inject(ALARM_CONSTANTS.ALARM_REPOSITORY)
        private readonly alarmRepository: AlarmRepositoryInterface,
    ) { }

    async onModuleInit() {
        // Only run in development
        if (process.env.NODE_ENV !== 'development') {
            return;
        }

        console.log('🌱 Creating test alarms and comments...');

        try {
            // Check if alarms already exist
            const existingAlarms = await this.alarmRepository.findAll();
            if (existingAlarms.length > 0) {
                console.log('⚠️  Test alarms already exist. Skipping seed.');
                return;
            }

            // Create test alarms
            const alarm1 = Alarm.create(
                '179219', // sceneId de um Router WayOS
                DeviceType.Router,
                'Device offline',
            );
            await this.alarmRepository.save(alarm1);

            const alarm2 = Alarm.create(
                '179220', // sceneId de um Router WayOS
                DeviceType.Router,
               'Device offline',
            );
            await this.alarmRepository.save(alarm2);

            const alarm3 = Alarm.create(
                '179219', // sceneId de um Router WayOS
                DeviceType.Router,
                'Device offline',
            );
            await this.alarmRepository.save(alarm3);

            // Create comments for alarm1
            await this.alarmRepository.createComment(
                alarm1.id,
                'Problema persiste após reiniciar o dispositivo. Checar configuração de rede.',
            );

            await this.alarmRepository.createComment(
                alarm1.id,
                'Verificar se o cabo de rede está conectado corretamente.',
            );

            // Create comments for alarm2
            await this.alarmRepository.createComment(
                alarm2.id,
                'Equipamento estava em um ambiente fechado sem ventilação adequada. O problema foi resolvido após mover para um local mais fresco.',
            );

            // Create comments for alarm2
            await this.alarmRepository.createComment(
                alarm3.id,
                'Verificar local de instalação do dispositivo para melhorar ventilação.',
            );

            // Create comment for alarm3
            await this.alarmRepository.createComment(
                alarm3.id,
                'Problema resolvido após atualização de credenciais',
            );

            alarm2.markAsSolved();
            alarm3.markAsSolved();

            console.log('✅ Test alarms and comments created successfully');
        } catch (error) {
            console.error('❌ Error creating test alarms:', error);
        }
    }
}
