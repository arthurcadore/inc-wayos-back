import { Injectable } from "@nestjs/common";
import { Alarm } from "../entities/alarm.entity";
import { AlarmRepositoryInterface, CreateAlarmDto } from "../interfaces/alarm-repository.interface";
import { v4 as uuidv4 } from 'uuid';
import { AlarmComment } from "../entities/alarm-comment.entity";

@Injectable()
export class AlarmInMemoryRepository implements AlarmRepositoryInterface {
    private alarms: Alarm[] = [];

    async findAll(): Promise<Alarm[]> {
        return this.alarms;
    }

    async create(alarm: CreateAlarmDto): Promise<Alarm> {
        const newAlarm: Alarm = {
            id: uuidv4(),
            externalId: alarm.externalId,
            title: alarm.title,
            isSolved: alarm.isSolved,
            comments: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.alarms.push(newAlarm);
        return newAlarm;
    }

    async findByExternalId(externalId: string): Promise<Alarm[]> {
        return this.alarms.filter(alarm => alarm.externalId === externalId);
    }

    async createComment(alarmId: string, text: string): Promise<void> {
        const alarm = this.alarms.find(alarm => alarm.id === alarmId);

        if (!alarm) {
            throw new Error('Alarme não encontrado');
        }

        const alarmComment: AlarmComment = {
            id: uuidv4(),
            text,
            createdAt: new Date(),
            updatedAt: new Date(),
            editedAt: null,
            alarm,
        };
        alarm.comments.push(alarmComment);
        alarm.updatedAt = new Date();
    }
}
