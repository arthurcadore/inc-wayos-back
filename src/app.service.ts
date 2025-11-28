import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface HealthCheckResponse {
    message: string;
    timestamp: string;
    environment: string;
    version: string;
}

@Injectable()
export class AppService {
    constructor(private readonly configService: ConfigService) {}

    getHealthCheck(): HealthCheckResponse {
        return {
            message: 'EACE Backend Dashboard is running!',
            timestamp: new Date().toISOString(),
            environment: this.configService.get<string>('NODE_ENV') || 'development',
            version: this.configService.get<string>('APP_VERSION') || '0.0.1'
        };
    }
}
