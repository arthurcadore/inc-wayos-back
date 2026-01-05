import { BaseEntity } from "src/database/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { AlarmComment } from "./alarm-comment.entity";

@Entity('alarms')
export class Alarm extends BaseEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    externalId: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'boolean', nullable: false })
    isSolved: boolean;

    @OneToMany(() => AlarmComment, (comment) => comment.alarm)
    comments: AlarmComment[];
}
