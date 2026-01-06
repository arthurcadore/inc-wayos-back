import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from '../data/user.model';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(UserModel)
        private readonly repository: Repository<UserModel>,
    ) {}

    async findByEmail(email: string): Promise<UserModel | null> {
        return this.repository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<UserModel | null> {
        return this.repository.findOne({ where: { id } });
    }

    async create(userData: Partial<UserModel>): Promise<UserModel> {
        const user = this.repository.create(userData);
        return this.repository.save(user);
    }

    async save(user: UserModel): Promise<UserModel> {
        return this.repository.save(user);
    }
}
