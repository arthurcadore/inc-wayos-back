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

    async save(alarm: Alarm): Promise<void> {
        this.alarms.push(alarm);
    }

    async findByExternalId(externalId: string): Promise<Alarm | null> {
        const alarm = this.alarms.find(alarm => alarm.externalId === externalId);

        if (!alarm) {
            return null;
        }

        return alarm;
    }

    async createComment(alarmId: UUID, text: string): Promise<void> {
        const alarm = this.alarms.find(alarm => alarm.id.isEqual(alarmId));

        if (!alarm) {
            throw new Error('Alarme não encontrado');
        }

        const alarmComment = new AlarmComment(
            UUID.generate(),
            text,
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

    async deleteComment(alarmId: UUID, alarmCommentId: UUID): Promise<void> {
        const alarm = this.alarms.find(alarm => alarm.id.isEqual(alarmId));

        if (!alarm) {
            throw new Error('Alarme não encontrado');
        }

        alarm.removeComment(alarmCommentId);
    }
}
