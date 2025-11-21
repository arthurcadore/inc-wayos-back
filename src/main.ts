import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Get configuration service
    const configService = app.get(ConfigService);

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Enable CORS
    app.enableCors({
        origin: (configService.get<string>('CORS_ORIGIN') || '*').split(','),
        methods: (
            configService.get<string>('CORS_METHODS') ||
            'GET,HEAD,PUT,PATCH,POST,DELETE'
        ).split(','),
        credentials: configService.get<string>('CORS_CREDENTIALS') === 'false',
    });

    // Set global API prefix
    const apiPrefix = configService.get<string>('API_PREFIX') || 'api';
    const apiVersion = configService.get<string>('API_VERSION') || 'v1';
    app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

    // Setup Swagger (only for development and homologation)
    const isSwaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED');
    const nodeEnv = configService.get<string>('NODE_ENV');

    if (isSwaggerEnabled && nodeEnv !== 'production') {
        const config = new DocumentBuilder()
            .setTitle(
                configService.get<string>('SWAGGER_TITLE') ||
                    'EACE Backend Dashboard API',
            )
            .setDescription(
                configService.get<string>('SWAGGER_DESCRIPTION') ||
                    'API documentation for EACE Backend Dashboard',
            )
            .setVersion(configService.get<string>('SWAGGER_VERSION') || '1.0.0')
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token',
                },
                'access-token',
            )
            .build();

        const document = SwaggerModule.createDocument(app, config);
        const swaggerPath = configService.get<string>('SWAGGER_PATH') || 'docs';
        SwaggerModule.setup(swaggerPath, app, document);

        console.log(`📚 Swagger documentation available at: /${swaggerPath}`);
    }

    const port = configService.get<number>('PORT') || 3000;
    const host = configService.get<string>('HOST') || 'localhost';

    await app.listen(port, host);

    console.log(
        `🚀 Application is running on: http://${host}:${port}/${apiPrefix}/${apiVersion}`,
    );
    console.log(`🌍 Environment: ${nodeEnv}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
