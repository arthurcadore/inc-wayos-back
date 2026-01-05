import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Alarm } from "../entities/alarm.entity";
import { AlarmRepositoryInterface, CreateAlarmDto } from "../interfaces/alarm-repository.interface";

@Injectable()
export class AlarmRepository implements AlarmRepositoryInterface {
    constructor(
        @InjectRepository(Alarm)
        private readonly repository: Repository<Alarm>,
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

    createComment(alarmId: string, text: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
