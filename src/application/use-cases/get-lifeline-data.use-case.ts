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
        const { startAt, endAt } = DateConverter.createRangeDateStgs(daysRange);
        const response = await this.wayosService.deviceLoadList(sn, startAt, endAt);

        const result = response.map(item => {
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

        // Implementar os 'gaps' na linha do tempo quando não houver dados e inserir itens do tipo vermelho nesses intervalos.
        // O tempo entre cada item é sempre de 5 minutos.
        // Considere o startAt e endAt para determinar os intervalos faltantes.


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
