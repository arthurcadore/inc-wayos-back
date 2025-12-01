export interface EnvironmentVariables {
    // Application Environment
    NODE_ENV: 'development' | 'homologation' | 'production';

    // Application Configuration
    APP_NAME: string;
    APP_VERSION: string;
    APP_DESCRIPTION: string;

    // Server Configuration
    PORT: number;
    HOST: string;

    // API Configuration
    API_PREFIX: string;
    API_VERSION: string;

    // CORS Configuration
    CORS_ORIGIN: string;
    CORS_METHODS: string;
    CORS_CREDENTIALS: boolean;

    // Swagger Configuration
    SWAGGER_ENABLED?: boolean;
    SWAGGER_PATH?: string;
    SWAGGER_TITLE?: string;
    SWAGGER_DESCRIPTION?: string;
    SWAGGER_VERSION?: string;

    // Logging Configuration
    LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
    LOG_FORMAT: 'combined' | 'json' | 'simple';

    // Rate Limiting Configuration
    RATE_LIMIT_TTL: number;
    RATE_LIMIT_LIMIT: number;

    // Inc Cloud Configuration
    INC_CLOUD_BASE_URL: string;
    INC_CLOUD_API_KEY: string;
    INC_CLOUD_USERNAME: string;

    // WayOS Configuration
    WAYOS_BASE_URL: string;
    WAYOS_ACCESS_KEY_ID: string;
    WAYOS_ACCESS_KEY_SECRET: string;

    // JWT Configuration
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
}

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
    return {
        NODE_ENV: config.NODE_ENV as 'development' | 'homologation' | 'production',
        APP_NAME: config.APP_NAME as string,
        APP_VERSION: config.APP_VERSION as string,
        APP_DESCRIPTION: config.APP_DESCRIPTION as string,
        PORT: parseInt(config.PORT as string, 10) || 3000,
        HOST: config.HOST as string,
        API_PREFIX: config.API_PREFIX as string,
        API_VERSION: config.API_VERSION as string,
        CORS_ORIGIN: config.CORS_ORIGIN as string,
        CORS_METHODS: config.CORS_METHODS as string,
        CORS_CREDENTIALS: config.CORS_CREDENTIALS === 'true',
        SWAGGER_ENABLED: config.SWAGGER_ENABLED === 'true',
        SWAGGER_PATH: config.SWAGGER_PATH as string,
        SWAGGER_TITLE: config.SWAGGER_TITLE as string,
        SWAGGER_DESCRIPTION: config.SWAGGER_DESCRIPTION as string,
        SWAGGER_VERSION: config.SWAGGER_VERSION as string,
        LOG_LEVEL: config.LOG_LEVEL as 'error' | 'warn' | 'info' | 'debug',
        LOG_FORMAT: config.LOG_FORMAT as 'combined' | 'json' | 'simple',
        RATE_LIMIT_TTL: parseInt(config.RATE_LIMIT_TTL as string, 10) || 60000,
        RATE_LIMIT_LIMIT: parseInt(config.RATE_LIMIT_LIMIT as string, 10) || 100,
        INC_CLOUD_BASE_URL: config.INC_CLOUD_BASE_URL as string,
        INC_CLOUD_API_KEY: config.INC_CLOUD_API_KEY as string,
        INC_CLOUD_USERNAME: config.INC_CLOUD_USERNAME as string,
        WAYOS_BASE_URL: config.WAYOS_BASE_URL as string,
        WAYOS_ACCESS_KEY_ID: config.WAYOS_ACCESS_KEY_ID as string,
        WAYOS_ACCESS_KEY_SECRET: config.WAYOS_ACCESS_KEY_SECRET as string,
        JWT_SECRET: config.JWT_SECRET as string,
        JWT_EXPIRES_IN: (config.JWT_EXPIRES_IN as string) || '24h'
    };
}
