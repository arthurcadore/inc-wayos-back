import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class LoginResponseDto {
    @ApiProperty({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    access_token: string;

    @ApiProperty({
        description: 'User information',
        type: UserResponseDto
    })
    user: UserResponseDto;

    constructor(partial: Partial<LoginResponseDto>) {
        Object.assign(this, partial);
    }
}
