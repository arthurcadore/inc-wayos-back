import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { UserModel } from './data/user.model';

@Module({
    imports: [TypeOrmModule.forFeature([UserModel])],
    providers: [UsersService, UsersRepository],
    exports: [UsersService]
})
export class UsersModule {}
