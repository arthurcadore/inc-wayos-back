import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
config({ path: resolve(process.cwd(), envFile) });
config({ path: resolve(process.cwd(), '.env') });

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'eace_user',
    password: process.env.DATABASE_PASSWORD || 'eace_password',
    database: process.env.DATABASE_NAME || 'eace_backend_dashboard',
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['src/database/migrations/*{.ts,.js}'],
    synchronize: false,
    logging: process.env.DATABASE_LOGGING === 'true',
    migrationsTableName: 'migrations',
});
