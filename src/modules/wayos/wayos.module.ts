import { Module } from '@nestjs/common';
import { WayosService } from './services/wayos.service';
import { WAYOS_CONSTANTS } from './wayos.constants';

@Module({
    imports: [],
    providers: [
        {
            provide: WAYOS_CONSTANTS.WAYOS_SERVICE,
            useClass: WayosService
        }
    ],
    exports: [WAYOS_CONSTANTS.WAYOS_SERVICE]
})
export class WayosModule {}
