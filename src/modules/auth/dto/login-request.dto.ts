import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
    @ApiProperty({
        description: 'User email',
        example: 'admin@intelbras.com.br'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'e@ce123',
        minLength: 6
    })
    @IsString()
    @MinLength(6)
    password: string;
}
