import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlarmCommentResponseDto } from './alarm-comment-response.dto';

export class AlarmResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    externalId: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    isSolved: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiPropertyOptional({ type: [AlarmCommentResponseDto] })
    comments?: AlarmCommentResponseDto[];
}
