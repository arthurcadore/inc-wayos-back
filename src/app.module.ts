import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
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
import { GetWayosLastOfflineMomentListUseCase } from './application/use-cases/get-wayos-last-offline-moment-list.use-case';
import { GetInccloudLastOfflineMomentListUseCase } from './application/use-cases/get-inccloud-last-offline-moment-list.use-case';
import { AlarmModule } from './modules/alarm/alarm.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
            validate: validateEnvironment,
            isGlobal: true
        }),
        ScheduleModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT'),
                username: configService.get<string>('DATABASE_USERNAME'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
                synchronize: false,
                migrationsRun: true,
                logging: configService.get<boolean>('DATABASE_LOGGING'),
                autoLoadEntities: true,
            }),
        }),
        IncCloudModule,
        WayosModule,
        AuthModule,
        UsersModule,
        AlarmModule,
    ],
    controllers: [AppController],
    providers: [
        ViewGlobalUseCase,
        ConnectedDevicesUseCase,
        GetAlarmLogListUseCase,
        GetWayosLastOfflineMomentListUseCase,
        GetInccloudLastOfflineMomentListUseCase,
        AppService,
    ]
})
export class AppModule {}
