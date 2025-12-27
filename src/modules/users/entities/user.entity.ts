import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;
}
