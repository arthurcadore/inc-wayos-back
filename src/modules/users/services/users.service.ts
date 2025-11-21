import { Injectable } from '@nestjs/common';
import { UsersServiceInterface } from '../interfaces/users-service.interface';
import { UsersRepository } from '../repositories/users.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService implements UsersServiceInterface {
    constructor(private readonly usersRepository: UsersRepository) {}

    async findByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findByEmail(email);
    }

    async findById(id: string): Promise<User | undefined> {
        return this.usersRepository.findById(id);
    }
}
