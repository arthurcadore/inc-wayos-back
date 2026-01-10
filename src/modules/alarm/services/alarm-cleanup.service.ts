import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { ALARM_CONSTANTS } from '../alarm.constants';
import type { AlarmRepositoryInterface } from '../interfaces/alarm-repository.interface';

@Injectable()
export class AlarmCleanupService {
    private readonly logger = new Logger(AlarmCleanupService.name);

    constructor(
        @Inject(ALARM_CONSTANTS.ALARM_REPOSITORY)
        private readonly alarmRepository: AlarmRepositoryInterface,
        private readonly configService: ConfigService,
    ) {}

    /**
     * Executa a limpeza automática de alarmes antigos diariamente às 23:00
     * Remove alarmes (e seus comentários via cascade) cujo updatedAt seja superior ao threshold configurado
     */
    @Cron('0 23 * * *', {
        name: 'alarm-cleanup',
        timeZone: 'America/Sao_Paulo', // Ajuste o timezone conforme necessário
    })
    async handleAlarmCleanup() {
        const startTime = Date.now();
        this.logger.log('Iniciando limpeza automática de alarmes antigos...');

        try {
            // Obter configuração de horas (padrão: 24 horas)
            const cleanupHours = this.configService.get<number>('ALARM_CLEANUP_HOURS', 24);

            // Calcular o threshold (data/hora limite)
            const thresholdDate = new Date();
            thresholdDate.setHours(thresholdDate.getHours() - cleanupHours);

            this.logger.log(`Threshold configurado: ${cleanupHours} horas`);
            this.logger.log(`Deletando alarmes com updatedAt anterior a: ${thresholdDate.toISOString()}`);

            // Executar deleção
            const deletedCount = await this.alarmRepository.deleteAlarmsByUpdatedAt(thresholdDate);

            const elapsedTime = Date.now() - startTime;
            this.logger.log(
                `Limpeza concluída com sucesso: ${deletedCount} alarme(s) deletado(s) em ${elapsedTime}ms`
            );
        } catch (error) {
            const elapsedTime = Date.now() - startTime;
            this.logger.error(
                `Erro durante limpeza de alarmes após ${elapsedTime}ms: ${error.message}`,
                error.stack
            );
        }
    }
}
