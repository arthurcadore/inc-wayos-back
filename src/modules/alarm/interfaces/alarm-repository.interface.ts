import { Alarm } from "../entities/alarm.entity";

export interface CreateAlarmDto {
    externalId: string;
    title: string;
    isSolved: boolean;
}

export interface AlarmRepositoryInterface {
    findAll(): Promise<Alarm[]>;
    create(alarm: CreateAlarmDto): Promise<Alarm>;
    findByExternalId(externalId: string): Promise<Alarm[]>;
    createComment(alarmId: string, text: string): Promise<void>;
}
