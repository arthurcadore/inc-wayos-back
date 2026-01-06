import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AlarmModel } from "../models/alarm.model";
import { AlarmRepositoryInterface, CreateAlarmDto } from "../../interfaces/alarm-repository.interface";
import { Alarm } from "../../domain/entities/alarm.entity";
import { UUID } from "src/domain/object-values/uuid";

@Injectable()
export class AlarmRepository implements AlarmRepositoryInterface {
    constructor(
        @InjectRepository(AlarmModel)
        private readonly repository: Repository<AlarmModel>,
    ) {}

    findAll(): Promise<Alarm[]> {
        throw new Error("Method not implemented.");
    }

    create(alarm: CreateAlarmDto): Promise<Alarm> {
        throw new Error("Method not implemented.");
    }

    findByExternalId(externalId: string): Promise<Alarm[]> {
        throw new Error("Method not implemented.");
    }

    createComment(alarmId: UUID, text: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    updateComment(alarmId: UUID, alarmCommentId: UUID, text: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    deleteComment(alarmId: UUID, alarmCommentId: UUID): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
