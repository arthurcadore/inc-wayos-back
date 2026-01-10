import { BaseModel } from "src/database/models/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AlarmModel } from "./alarm.model";

@Entity('alarmComments')
export class AlarmCommentModel extends BaseModel {
    @Column({ type: 'varchar', length: 5000, nullable: false })
    text: string;

    @ManyToOne(() => AlarmModel, (alarm) => alarm.comments, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'alarmId' })
    alarm: AlarmModel;
}
