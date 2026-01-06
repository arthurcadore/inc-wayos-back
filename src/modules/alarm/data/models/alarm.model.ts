import { BaseModel } from "src/database/models/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { AlarmCommentModel } from "./alarm-comment.model";

@Entity('alarms')
export class AlarmModel extends BaseModel {
    @Column({ type: 'varchar', length: 255, nullable: false })
    externalId: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'boolean', nullable: false })
    isSolved: boolean;

    @OneToMany(() => AlarmCommentModel, (comment) => comment.alarm)
    comments: AlarmCommentModel[];
}
