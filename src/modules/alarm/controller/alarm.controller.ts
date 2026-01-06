import { Controller, Inject, Post, UseGuards, Body, Patch, Param, Delete } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ALARM_CONSTANTS } from "../alarm.constants";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { CreateAlarmCommentDto, EditAlarmCommentDto } from "../dto/alarm-request.dto";
import type { AlarmRepositoryInterface } from "../interfaces/alarm-repository.interface";
import { UUID } from "src/domain/object-values/uuid";

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
        await this.alarmRepository.createComment(UUID.fromString(alarmId), text);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Editar comentário de alarme',
        description: 'Endpoint para editar um comentário existente de um alarme específico.',
    })
    @Patch('alarm-comments')
    async updateComment(@Body() { alarmId, alarmCommentId, text }: EditAlarmCommentDto): Promise<void> {
        await this.alarmRepository.updateComment(UUID.fromString(alarmId), UUID.fromString(alarmCommentId), text);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Deletar comentário de alarme',
        description: 'Endpoint para deletar um comentário existente de um alarme específico.',
    })
    @Delete('alarm-comments/alarmId/:alarmId/alarmCommentId/:alarmCommentId')
    async deleteComment(@Param('alarmId') alarmId: string, @Param('alarmCommentId') alarmCommentId: string): Promise<void> {
        await this.alarmRepository.deleteComment(UUID.fromString(alarmId), UUID.fromString(alarmCommentId));
    }
}
