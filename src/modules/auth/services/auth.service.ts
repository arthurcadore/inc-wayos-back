import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    AuthServiceInterface,
    ValidedUser,
} from '../interfaces/auth-service.interface';
import { UsersService } from '../../users/services/users.service';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import * as bcrypt from 'bcrypt';

export interface UserInToken {
    email: string;
    sub: string;
}

@Injectable()
export class AuthService implements AuthServiceInterface {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(
        email: string,
        password: string,
    ): Promise<ValidedUser | null> {
        const user = await this.usersService.findByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _, ...result } = user;
            return result;
        }

        return null;
    }

    async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: UserInToken = {
            email: user.email,
            sub: user.id,
        };
        const access_token = this.jwtService.sign(payload);

        return new LoginResponseDto({
            access_token,
            user: new UserResponseDto({
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }),
        });
    }
}
