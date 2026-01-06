import { UUID } from "src/domain/object-values/uuid";
import { Alarm } from "../domain/entities/alarm.entity";
import { AlarmComment } from "../domain/entities/alarm-comment.entity";

export interface CreateAlarmDto {
    externalId: string;
    title: string;
    isSolved: boolean;
}

export interface AlarmRepositoryInterface {
    findAll(): Promise<Alarm[]>;
    create(alarm: CreateAlarmDto): Promise<Alarm>;
    findByExternalId(externalId: string): Promise<Alarm[]>;
    createComment(alarmId: UUID, text: string): Promise<void>;
    updateComment(alarmId: UUID, alarmCommentId: UUID, text: string): Promise<void>;
}
