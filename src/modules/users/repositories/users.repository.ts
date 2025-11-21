import { Injectable, OnModuleInit } from '@nestjs/common';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository implements OnModuleInit {
    private users: Map<string, User> = new Map();

    async onModuleInit() {
        // Initialize with default admin user
        const adminPassword = await bcrypt.hash('e@ce123', 10);
        const adminUser = new User({
            id: '1',
            email: 'admin@intelbras.com.br',
            password: adminPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        this.users.set(adminUser.id, adminUser);
    }

    findByEmail(email: string): Promise<User | undefined> {
        return Promise.resolve(
            Array.from(this.users.values()).find(u => u.email === email),
        );
    }

    findById(id: string): Promise<User | undefined> {
        return Promise.resolve(this.users.get(id));
    }
}
