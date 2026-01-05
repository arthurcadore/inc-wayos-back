import { Controller, Inject, Post, UseGuards, Body } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ALARM_CONSTANTS } from "../alarm.constants";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { CreateAlarmCommentDto } from "../dto/create-alarm-comment.dto";
import type { AlarmRepositoryInterface } from "../interfaces/alarm-repository.interface";

@ApiTags('Alarm')
@Controller('alarm')
export class AlarmController {
    constructor(
        @Inject(ALARM_CONSTANTS.ALARM_REPOSITORY)
        private readonly alarmRepository: AlarmRepositoryInterface,
    ) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Postar comentário em alarme',
        description: 'Endpoint para postar um comentário em um alarme específico.',
    })
    @Post('alarm-comments')
    async postComment(@Body() { alarmId, text }: CreateAlarmCommentDto): Promise<void> {
        await this.alarmRepository.createComment(alarmId, text);
    }
}
