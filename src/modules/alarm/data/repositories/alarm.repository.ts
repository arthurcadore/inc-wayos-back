import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AlarmModel } from "../models/alarm.model";
import { AlarmRepositoryInterface, CreateAlarmDto } from "../../interfaces/alarm-repository.interface";
import { Alarm } from "../../domain/entities/alarm.entity";
import { UUID } from "src/domain/object-values/uuid";
import { AlarmMapper } from "../../mappers/alarm.mapper";
import { AlarmCommentModel } from "../models/alarm-comment.model";

@Injectable()
export class AlarmRepository implements AlarmRepositoryInterface {
    constructor(
        @InjectRepository(AlarmModel)
        private readonly repository: Repository<AlarmModel>,
        @InjectRepository(AlarmCommentModel)
        private readonly commentRepository: Repository<AlarmCommentModel>,
    ) {}

    async findAll(): Promise<Alarm[]> {
        const alarmModels = await this.repository.find({
            relations: ['comments'],
            order: {
                createdAt: 'DESC',
                comments: {
                    createdAt: 'ASC'
                }
            }
        });

        return alarmModels.map(model => AlarmMapper.toEntity(model, true));
    }

    async save(alarm: Alarm): Promise<void> {
        const model = AlarmMapper.toModel(alarm);
        await this.repository.save(model);
    }

    async findByExternalId(externalId: string): Promise<Alarm | null> {
        try {
            const alarmModel = await this.repository.findOne({
                where: { externalId },
                relations: ['comments'],
            });

            if (!alarmModel) {
                return null;
            }

            return AlarmMapper.toEntity(alarmModel, true);
        } catch (error) {
            throw new Error(`Erro ao buscar alarme por externalId: ${error}`);
        }
    }

    async createComment(alarmId: UUID, text: string): Promise<void> {
        const alarm = await this.repository.findOne({
            where: { id: alarmId.toString() }
        });

        if (!alarm) {
            throw new Error('Alarme não encontrado.');
        }

        const comment = this.commentRepository.create({
            text,
            alarm,
        });

        await this.commentRepository.save(comment);
    }

    async updateComment(alarmId: UUID, alarmCommentId: UUID, text: string): Promise<void> {
        const comment = await this.commentRepository.findOne({
            where: {
                id: alarmCommentId.toString(),
                alarm: { id: alarmId.toString() }
            }
        });

        if (!comment) {
            throw new Error('Comentário não encontrado.');
        }

        comment.text = text;
        await this.commentRepository.save(comment);
    }

    async deleteComment(alarmId: UUID, alarmCommentId: UUID): Promise<void> {
        const comment = await this.commentRepository.findOne({
            where: {
                id: alarmCommentId.toString(),
                alarm: { id: alarmId.toString() }
            }
        });

        if (!comment) {
            throw new Error('Comentário não encontrado.');
        }

        await this.commentRepository.remove(comment);
    }

    async toogleAlarmSolved(alarmId: UUID): Promise<void> {
        const alarm = await this.repository.findOne({
            where: { id: alarmId.toString() }
        });

        if (!alarm) {
            throw new Error('Alarme não encontrado.');
        }

        const alarmEntity = AlarmMapper.toEntity(alarm);
        alarmEntity.toogleSolved();
        await this.repository.save(AlarmMapper.toModel(alarmEntity));
    }
}
