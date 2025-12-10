import { Inject, Injectable } from '@nestjs/common';
import { WayosGetDeviceOnlineUserResponse } from 'src/modules/wayos/dto/wayos-response.dto';
import type { WayosServiceInterface } from 'src/modules/wayos/interfaces/wayos-service.interface';
import { WAYOS_CONSTANTS } from 'src/modules/wayos/wayos.constants';

@Injectable()
export class ConnectedDevicesUseCase {
    private readonly WAYOS_PAGE_SIZE = 10;

    constructor(
        @Inject(WAYOS_CONSTANTS.WAYOS_SERVICE)
        private readonly wayosService: WayosServiceInterface,
    ) {}

    async execute(sn: string): Promise<WayosGetDeviceOnlineUserResponse> {
        return await this.wayosService.getDeviceOnlineUser(sn);
    }
}
