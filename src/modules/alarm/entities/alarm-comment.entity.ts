import { BaseEntity } from "src/database/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Alarm } from "./alarm.entity";
import { Exclude } from "class-transformer";

@Entity('alarm_comments')
export class AlarmComment extends BaseEntity {
    @Column({ type: 'varchar', length: 5000, nullable: false })
    text: string;

    @Column({ type: 'timestamp', nullable: true })
    editedAt: Date | null;

    @ManyToOne(() => Alarm, (alarm) => alarm.comments, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'alarm_id' })
    alarm: Alarm;
}
