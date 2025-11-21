import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnvironment } from './config/environment.config';
import { IncCloudModule } from './modules/inccloud/inccloud.module';
import { WayosModule } from './modules/wayos/wayos.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [
                `.env.${process.env.NODE_ENV || 'development'}`,
                '.env',
            ],
            validate: validateEnvironment,
            isGlobal: true,
        }),
        IncCloudModule,
        WayosModule,
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
