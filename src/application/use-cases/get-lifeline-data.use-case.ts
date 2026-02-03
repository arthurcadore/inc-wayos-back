import { Inject, Injectable } from "@nestjs/common";
import type { WayosServiceInterface } from "src/modules/wayos/interfaces/wayos-service.interface";
import { WAYOS_CONSTANTS } from "src/modules/wayos/wayos.constants";
import { DateConverter } from "src/shared/converters/date-converte";
import { PerformanceLogger } from "src/shared/utils/performance-logger";

@Injectable()
export class GetLifelineDataUseCase {
    constructor(
        @Inject(WAYOS_CONSTANTS.WAYOS_SERVICE)
        private readonly wayosService: WayosServiceInterface,
    ) {}

    async execute(sn: string, daysRange: number): Promise<LifelineItem[]> {
        const { startAt, endAt } = DateConverter.createRangeDates(daysRange);
        startAt.setMinutes(0, 0, 0); // Ajusta para o início da hora
        const startAtStr = DateConverter.toISO8601(startAt);
        const endAtStr = DateConverter.toISO8601(endAt);

        const response = await this.wayosService.deviceLoadList(sn, startAtStr, endAtStr);

        const mappedData = response.map(item => {
            const [cpuM]: CpuM[] = JSON.parse(item.cpu_m);
            const memM: MemM = JSON.parse(item.mem_m);
            return {
                type: this.processData(item.up_rate, item.down_rate),
                startAt: item.stat_at,
                cpu: `${cpuM.u}%`,
                mem: memM.t === 0 ? '0%' : `${((memM.u / memM.t) * 100).toFixed(2)}%`,
                up: PerformanceLogger.bytesSize(item.up_rate),
                down: PerformanceLogger.bytesSize(item.down_rate),
            };
        });

        // Preenche as lacunas com itens vermelhos em intervalos de 15 minutos
        const result = this.fillTimelineGaps(mappedData, startAtStr, endAtStr);

        return result;
    }

    private processData(upRate: number, downRate: number): LifelineItemType {
        const totalRate = upRate + downRate;

        if (totalRate < 1048576) {
            return LifelineItemType.Yellow;
        } else {
            return LifelineItemType.Green;
        }
    }

    /**
     * Parseia um timestamp no formato "YYYY-MM-DD HH:mm:ss" para Date
     */
    private parseTimestamp(timestamp: string): Date {
        const [datePart, timePart] = timestamp.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    /**
     * Formata um objeto Date para o formato "YYYY-MM-DD HH:mm:ss"
     */
    private formatTimestamp(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }1

    /**
     * Cria um item vermelho (offline) com valores zerados
     */
    private createRedLifelineItem(timestamp: string): LifelineItem {
        return {
            type: LifelineItemType.Red,
            startAt: timestamp,
            cpu: '0%',
            mem: '0%',
            up: '0 B',
            down: '0 B',
        };
    }

    /**
     * Gera todos os timestamps esperados em intervalos de 15 minutos
     */
    private generateExpectedTimestamps(startAt: string, endAt: string): string[] {
        const timestamps: string[] = [];
        const start = this.parseTimestamp(startAt);
        const end = this.parseTimestamp(endAt);

        const current = new Date(start);

        while (current <= end) {
            timestamps.push(this.formatTimestamp(current));
            current.setMinutes(current.getMinutes() + 15);
        }

        return timestamps;
    }

    /**
     * Preenche as lacunas na linha do tempo com itens vermelhos
     */
    private fillTimelineGaps(
        data: LifelineItem[],
        startAt: string,
        endAt: string,
    ): LifelineItem[] {
        // Cria um mapa dos dados existentes por timestamp
        const dataMap = new Map<string, LifelineItem>();
        data.forEach(item => {
            dataMap.set(item.startAt, item);
        });

        // Gera todos os timestamps esperados
        const expectedTimestamps = this.generateExpectedTimestamps(startAt, endAt);

        // Preenche lacunas
        const result: LifelineItem[] = [];
        expectedTimestamps.forEach(timestamp => {
            if (dataMap.has(timestamp)) {
                result.push(dataMap.get(timestamp)!);
            } else {
                result.push(this.createRedLifelineItem(timestamp));
            }
        });

        return result;
    }
}

type CpuM = {
    i: number;
    u: number;
    t: number;
};

type MemM = {
    t: number;
    u: number;
};

export enum LifelineItemType {
    Green = 0,
    Yellow = 1,
    Red = 2,
}

export interface LifelineItem {
    type: LifelineItemType;
    startAt: string;
    cpu: string;    // porcentagem de uso da CPU em porcentagem
    mem: string;    // porcentagem de uso da memoria em porcentagem
    up: string;     // velocidade de upload em bytes por segundo
    down: string;   // velocidade de download em bytes por segundo
}
