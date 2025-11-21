import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';

export type ValidedUser = {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface AuthServiceInterface {
    login(loginDto: LoginRequestDto): Promise<LoginResponseDto>;
    validateUser(email: string, password: string): Promise<ValidedUser | null>;
}
