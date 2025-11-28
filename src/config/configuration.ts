import { ConfigModuleOptions } from '@nestjs/config';
import { validateEnvironment } from './environment.config';

export default (): ConfigModuleOptions => ({
    envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    validate: validateEnvironment,
    isGlobal: true
});

export const getEnvPath = (): string => {
    const env = process.env.NODE_ENV || 'development';
    return `.env.${env}`;
};

export const isProduction = (): boolean => {
    return process.env.NODE_ENV === 'production';
};

export const isDevelopment = (): boolean => {
    return process.env.NODE_ENV === 'development';
};

export const isHomologation = (): boolean => {
    return process.env.NODE_ENV === 'homologation';
};

export const isSwaggerEnabled = (): boolean => {
    return process.env.SWAGGER_ENABLED === 'true' && !isProduction();
};
