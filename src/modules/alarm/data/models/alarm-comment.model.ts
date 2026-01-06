import { BaseModel } from "src/database/models/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AlarmModel } from "./alarm.model";

@Entity('alarm_comments')
export class AlarmCommentModel extends BaseModel {
    @Column({ type: 'varchar', length: 5000, nullable: false })
    text: string;

    @Column({ type: 'timestamp', nullable: true })
    editedAt: Date | null;

    @ManyToOne(() => AlarmModel, (alarm) => alarm.comments, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'alarm_id' })
    alarm: AlarmModel;
}
