import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsUUID } from 'class-validator';

export class CreateAlarmCommentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    text: string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    alarmId: string;
}

export class EditAlarmCommentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    text: string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    alarmId: string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    alarmCommentId: string;
}

export class ToogleAlarmSolvedDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    alarmId: string;
}
