import { Injectable } from '@nestjs/common';
import { UsersServiceInterface } from '../interfaces/users-service.interface';
import { UsersRepository } from '../repositories/users.repository';
import { UserModel } from '../data/user.model';

@Injectable()
export class UsersService implements UsersServiceInterface {
    constructor(private readonly usersRepository: UsersRepository) {}

    async findByEmail(email: string): Promise<UserModel | null> {
        return this.usersRepository.findByEmail(email);
    }

    async findById(id: string): Promise<UserModel | null> {
        return this.usersRepository.findById(id);
    }
}
