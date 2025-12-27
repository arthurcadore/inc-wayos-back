import { User } from '../entities/user.entity';

export interface UsersServiceInterface {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
