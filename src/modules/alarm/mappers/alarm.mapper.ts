import { Alarm } from '../entities/alarm.entity';
import { AlarmComment } from '../entities/alarm-comment.entity';
import { AlarmResponseDto } from '../dto/alarm-response.dto';
import { AlarmCommentResponseDto } from '../dto/alarm-comment-response.dto';

export class AlarmMapper {
    static toDto(alarm: Alarm, includeComments = false): AlarmResponseDto {
        const dto: AlarmResponseDto = {
            id: alarm.id,
            externalId: alarm.externalId,
            title: alarm.title,
            isSolved: alarm.isSolved,
            createdAt: alarm.createdAt,
            updatedAt: alarm.updatedAt,
        };

        if (includeComments && alarm.comments) {
            dto.comments = alarm.comments.map(comment =>
                AlarmCommentMapper.toDto(comment)
            );
        }

        return dto;
    }

    static toDtoList(alarms: Alarm[], includeComments = false): AlarmResponseDto[] {
        return alarms.map(alarm => this.toDto(alarm, includeComments));
    }
}

export class AlarmCommentMapper {
    static toDto(comment: AlarmComment): AlarmCommentResponseDto {
        return {
            id: comment.id,
            text: comment.text,
            editedAt: comment.editedAt,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        };
    }

    static toDtoList(comments: AlarmComment[]): AlarmCommentResponseDto[] {
        return comments.map(comment => this.toDto(comment));
    }
}
