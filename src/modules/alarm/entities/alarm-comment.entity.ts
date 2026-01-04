import { BaseEntity } from "src/database/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity('alarm_comments')
export class AlarmComment extends BaseEntity {
    @Column({ type: 'varchar', length: 5000, nullable: false })
    text: string;

    @Column({ type: 'timestamp', nullable: true })
    editedAt: Date | null;
}
