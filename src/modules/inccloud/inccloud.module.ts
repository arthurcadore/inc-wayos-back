import { Module } from '@nestjs/common';
import { IncCloudService } from './services/inccloud.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule.register({
            timeout: 10000,
            maxRedirects: 5,
        }),
    ],
    providers: [IncCloudService],
    exports: [IncCloudService],
})
export class IncCloudModule {}
