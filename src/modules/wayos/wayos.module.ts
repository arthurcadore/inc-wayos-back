import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WayosService } from './services/wayos.service';
import { WayosSignatureService } from './services/wayos-signature-generator.service';
import { WAYOS_CONSTANTS } from './wayos.constants';

@Module({
    imports: [
        HttpModule.register({
            timeout: 10000,
            maxRedirects: 5,
        }),
    ],
    providers: [
        { provide: WAYOS_CONSTANTS.WAYOS_SERVICE, useClass: WayosService },
        {
            provide: WAYOS_CONSTANTS.WAYOS_SIGNATURE_SERVICE,
            useFactory: () =>
                new WayosSignatureService(
                    process.env.WAYOS_APP_ID!,
                    process.env.WAYOS_SECRET_KEY!,
                ),
        },
    ],
    exports: [
        WAYOS_CONSTANTS.WAYOS_SERVICE,
        WAYOS_CONSTANTS.WAYOS_SIGNATURE_SERVICE,
    ],
})
export class WayosModule {}
