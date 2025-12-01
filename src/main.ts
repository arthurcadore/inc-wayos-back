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
            transform: true
        })
    );

    app.enableCors({
        origin: configService.get<string>('CORS_ORIGIN'),
        methods: configService.get<string>('CORS_METHODS'),
        credentials: configService.get<string>('CORS_CREDENTIALS'),
        allowedHeaders: 'Content-Type,Authorization,Accept'
    });

    // Set global API prefix
    const apiPrefix = configService.get<string>('API_PREFIX');
    const apiVersion = configService.get<string>('API_VERSION');
    app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

    // Setup Swagger (only for development and homologation)
    const isSwaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED');
    const nodeEnv = configService.get<string>('NODE_ENV');

    if (isSwaggerEnabled && nodeEnv !== 'production') {
        const config = new DocumentBuilder()
            .setTitle(configService.get<string>('SWAGGER_TITLE')!)
            .setDescription(configService.get<string>('SWAGGER_DESCRIPTION')!)
            .setVersion(configService.get<string>('SWAGGER_VERSION')!)
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token'
                },
                'access-token'
            )
            .build();

        const document = SwaggerModule.createDocument(app, config);
        const swaggerPath = configService.get<string>('SWAGGER_PATH') || 'docs';
        SwaggerModule.setup(swaggerPath, app, document, {
            // Configurações para melhorar a performance do Swagger UI
            swaggerOptions: {
                syntaxHighlight: false,
                docExpansion: 'none',
                deepLinking: false,
            }
        });

        console.log(`📚 Swagger documentation available at: /${swaggerPath}`);
    }

    const port = configService.get<number>('PORT')!;
    const host = configService.get<string>('HOST')!;

    await app.listen(port, host);

    console.log(`🚀 Application is running on: http://${host}:${port}/${apiPrefix}/${apiVersion}`);
    console.log(`🌍 Environment: ${nodeEnv}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
