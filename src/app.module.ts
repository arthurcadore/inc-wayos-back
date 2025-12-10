import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnvironment } from './config/environment.config';
import { IncCloudModule } from './modules/inccloud/inccloud.module';
import { WayosModule } from './modules/wayos/wayos.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ViewGlobalUseCase } from './application/use-cases/view-global.use-case';
import { ConnectedDevicesUseCase } from './application/use-cases/connected-devices.use-case';
import { GetAlarmLogListUseCase } from './application/use-cases/get-alarm-log-list.use-case';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
            validate: validateEnvironment,
            isGlobal: true
        }),
        IncCloudModule,
        WayosModule,
        AuthModule,
        UsersModule
    ],
    controllers: [AppController],
    providers: [
        ViewGlobalUseCase,
        ConnectedDevicesUseCase,
        GetAlarmLogListUseCase,
        AppService,
    ]
})
export class AppModule {}
