import { Module } from '@nestjs/common';
import { IncCloudService } from './services/inccloud.service';
import { HttpModule } from '@nestjs/axios';
import { INC_CLOUD_CONSTANTS } from './inc-cloud.constants';

@Module({
    imports: [
        HttpModule.register({
            timeout: 10000,
            maxRedirects: 5
        })
    ],
    providers: [
        {
            provide: INC_CLOUD_CONSTANTS.INC_CLOUD_SERVICE,
            useClass: IncCloudService
        }
    ],
    exports: [INC_CLOUD_CONSTANTS.INC_CLOUD_SERVICE]
})
export class IncCloudModule {}
