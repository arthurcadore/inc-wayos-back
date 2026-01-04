import { BaseEntity } from "src/database/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity('alarms')
export class Alarm extends BaseEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    externalId: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'boolean', nullable: false })
    isSolved: boolean;
}
