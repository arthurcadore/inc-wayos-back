import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../../modules/users/data/user.model';

// Load environment variables
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
config({ path: resolve(process.cwd(), envFile) });
config({ path: resolve(process.cwd(), '.env') });

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'eace_user',
    password: process.env.DATABASE_PASSWORD || 'eace_password',
    database: process.env.DATABASE_NAME || 'eace_backend_dashboard',
    entities: [UserModel],
    synchronize: false,
});

async function seed() {
    try {
        console.log('🌱 Starting database seeding...');

        await dataSource.initialize();
        console.log('✅ Database connection established');

        const userRepository = dataSource.getRepository(UserModel);

        // Check if admin user already exists
        const existingAdmin = await userRepository.findOne({
            where: { email: 'admin@intelbras.com.br' },
        });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists. Skipping seed.');
            await dataSource.destroy();
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('e@ce123', 10);
        const adminUser = userRepository.create({
            email: 'admin@intelbras.com.br',
            password: hashedPassword,
        });

        await userRepository.save(adminUser);
        console.log('✅ Admin user created successfully');
        console.log('📧 Email: admin@intelbras.com.br');
        console.log('🔑 Password: e@ce123');

        await dataSource.destroy();
        console.log('✅ Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        await dataSource.destroy();
        process.exit(1);
    }
}

seed();
