import { Injectable } from "@nestjs/common";
import { AlarmRepositoryInterface, CreateAlarmDto } from "../../interfaces/alarm-repository.interface";
import { Alarm } from "../../domain/entities/alarm.entity";
import { UUID } from "src/domain/object-values/uuid";
import { AlarmComment } from "../../domain/entities/alarm-comment.entity";

@Injectable()
export class AlarmInMemoryRepository implements AlarmRepositoryInterface {
    private alarms: Alarm[] = [];

    async findAll(): Promise<Alarm[]> {
        return this.alarms;
    }

    async create(alarm: CreateAlarmDto): Promise<Alarm> {
        const newAlarm: Alarm = new Alarm(
            UUID.generate(),
            alarm.externalId,
            alarm.title,
            alarm.isSolved,
            new Date(),
            new Date(),
        );
        this.alarms.push(newAlarm);
        return newAlarm;
    }

    async findByExternalId(externalId: string): Promise<Alarm[]> {
        return this.alarms.filter(alarm => alarm.externalId === externalId);
    }

    async createComment(alarmId: UUID, text: string): Promise<void> {
        const alarm = this.alarms.find(alarm => alarm.id.isEqual(alarmId));

        if (!alarm) {
            throw new Error('Alarme não encontrado');
        }

        const alarmComment = new AlarmComment(
            UUID.generate(),
            text,
            null,
            alarmId,
            new Date(),
            new Date(),
        );

        alarm.addComment(alarmComment);
    }

    async updateComment(alarmId: UUID, alarmCommentId: UUID, text: string): Promise<void> {
        const alarm = this.alarms.find(alarm => alarm.id.isEqual(alarmId));

        if (!alarm) {
            throw new Error('Alarme não encontrado');
        }

        const comment = alarm.getComments().find(comment => comment.id.isEqual(alarmCommentId));

        if (!comment) {
            throw new Error('Comentário não encontrado');
        }

        comment.setText(text);
    }
}
