import { UUID } from "src/domain/object-values/uuid";
import { Alarm } from "../domain/entities/alarm.entity";
import { DeviceType } from "src/domain/object-values/device-type";

export interface CreateAlarmDto {
    externalId: string;
    deviceType: DeviceType;
    title: string;
    isSolved: boolean;
}

export interface AlarmRepositoryInterface {
    findAll(): Promise<Alarm[]>;
    save(alarm: Alarm): Promise<void>;
    findByExternalId(externalId: string): Promise<Alarm | null>;
    createComment(alarmId: UUID, text: string): Promise<void>;
    updateComment(alarmId: UUID, alarmCommentId: UUID, text: string): Promise<void>;
    deleteComment(alarmId: UUID, alarmCommentId: UUID): Promise<void>;
}
