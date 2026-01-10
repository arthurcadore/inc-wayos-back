import { AlarmModel } from '../data/models/alarm.model';
import { AlarmCommentModel } from '../data/models/alarm-comment.model';
import { AlarmResponseDto } from '../dto/alarm-response.dto';
import { AlarmCommentResponseDto } from '../dto/alarm-comment-response.dto';
import { Alarm } from '../domain/entities/alarm.entity';
import { AlarmComment } from '../domain/entities/alarm-comment.entity';
import { UUID } from 'src/domain/object-values/uuid';

export class AlarmMapper {
    static toModel(alarm: Alarm): AlarmModel {
        const model = new AlarmModel();
        model.id = alarm.id.toString();
        model.externalId = alarm.externalId;
        model.deviceType = alarm.deviceType;
        model.title = alarm.title;
        model.isSolved = alarm.isSolved;
        model.createdAt = alarm.createdAt;
        model.updatedAt = alarm.updatedAt;
        return model;
    }

    static toEntity(alarmModel: AlarmModel): Alarm {
        const entity = new Alarm(
            UUID.fromString(alarmModel.id),
            alarmModel.externalId,
            alarmModel.deviceType,
            alarmModel.title,
            alarmModel.isSolved,
            alarmModel.createdAt,
            alarmModel.updatedAt,
        );

        if (alarmModel.comments) {
            entity.addComments(alarmModel.comments.map(commentModel => AlarmCommentMapper.toEntity(commentModel)));
        }

        return entity;
    }

    static toDto(alarm: Alarm, includeComments = false): AlarmResponseDto {
        const dto: AlarmResponseDto = {
            id: alarm.id.toString(),
            externalId: alarm.externalId,
            deviceType: alarm.deviceType,
            title: alarm.title,
            isSolved: alarm.isSolved,
            createdAt: alarm.createdAt,
            updatedAt: alarm.updatedAt,
        };

        if (includeComments) {
            dto.comments = alarm.getComments().map(comment => AlarmCommentMapper.toDto(comment));
        }

        return dto;
    }

    static toDtoList(alarms: Alarm[], includeComments = false): AlarmResponseDto[] {
        return alarms.map(alarm => this.toDto(alarm, includeComments));
    }
}

export class AlarmCommentMapper {
    static toModel(alarm: Alarm): AlarmModel {
        const model = new AlarmModel();
        model.id = alarm.id.toString();
        model.externalId = alarm.externalId;
        model.deviceType = alarm.deviceType;
        model.title = alarm.title;
        model.isSolved = alarm.isSolved;
        model.createdAt = alarm.createdAt;
        model.updatedAt = alarm.updatedAt;
        return model;
    }

    static toEntity(commentModel: AlarmCommentModel): AlarmComment {
        return new AlarmComment(
            UUID.fromString(commentModel.id),
            commentModel.text,
            UUID.fromString(commentModel.alarm.id),
            commentModel.createdAt,
            commentModel.updatedAt,
        );
    }

    static toDto(comment: AlarmComment): AlarmCommentResponseDto {
        return {
            id: comment.id.toString(),
            text: comment.text,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        };
    }

    static toDtoList(comments: AlarmComment[]): AlarmCommentResponseDto[] {
        return comments.map(comment => this.toDto(comment));
    }
}
