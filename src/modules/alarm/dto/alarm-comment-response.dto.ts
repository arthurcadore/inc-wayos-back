import { ApiProperty } from '@nestjs/swagger';

export class AlarmCommentResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    text: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
