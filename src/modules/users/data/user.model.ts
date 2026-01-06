import { Entity, Column } from 'typeorm';
import { BaseModel } from '../../../database/models/base.entity';

@Entity('users')
export class UserModel extends BaseModel {
    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;
}
