import { User } from '../entities/user.entity';

export interface UsersServiceInterface {
    findByEmail(email: string): Promise<User | undefined>;
    findById(id: string): Promise<User | undefined>;
}
