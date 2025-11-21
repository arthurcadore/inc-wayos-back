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
        {
            provide: WAYOS_CONSTANTS.WAYOS_SIGNATURE_SERVICE,
            useFactory(): WayosSignatureService {
                return new WayosSignatureService(
                    process.env.WAYOS_ACCESS_KEY_ID!,
                    process.env.WAYOS_ACCESS_KEY_SECRET!,
                );
            },
        },
        WayosService,
    ],
    exports: [WAYOS_CONSTANTS.WAYOS_SIGNATURE_SERVICE, WayosService],
})
export class WayosModule {}
