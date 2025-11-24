import { Module } from '@nestjs/common';
import { WayosService } from './services/wayos.service';
import { WAYOS_CONSTANTS } from './wayos.constants';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule.register({
            timeout: 10000,
            maxRedirects: 5,
        }),
    ],
    providers: [
        {
            provide: WAYOS_CONSTANTS.WAYOS_SERVICE,
            useClass: WayosService,
        },
    ],
    exports: [WAYOS_CONSTANTS.WAYOS_SERVICE],
})
export class WayosModule {}
