import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlarmCommentResponseDto } from './alarm-comment-response.dto';
import { DeviceType } from 'src/domain/object-values/device-type';

export class AlarmResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    externalId: string; // Wayos == sceneid, IncCloud == shopId

    @ApiProperty()
    deviceType: DeviceType;

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
