import { UserModel } from '../data/user.model';

export interface UsersServiceInterface {
    findByEmail(email: string): Promise<UserModel | null>;
    findById(id: string): Promise<UserModel | null>;
}
