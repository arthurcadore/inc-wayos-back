import { BaseModel } from "src/database/models/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { AlarmCommentModel } from "./alarm-comment.model";
import { DeviceType } from "src/domain/object-values/device-type";

@Entity('alarms')
export class AlarmModel extends BaseModel {
    @Column({ type: 'varchar', length: 255, nullable: false })
    externalId: string; // Wayos == sceneid, IncCloud == shopId

    @Column({ type: 'varchar', length: 50, nullable: false })
    deviceType: DeviceType;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'boolean', nullable: false })
    isSolved: boolean;

    @OneToMany(() => AlarmCommentModel, (comment) => comment.alarm)
    comments: AlarmCommentModel[];
}
