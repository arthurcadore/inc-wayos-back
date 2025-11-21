import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({
        description: 'User ID',
        example: '1',
    })
    id: string;

    @ApiProperty({
        description: 'User email',
        example: 'admin@intelbras.com.br',
    })
    email: string;

    @ApiProperty({
        description: 'User creation date',
        example: '2025-11-21T00:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'User last update date',
        example: '2025-11-21T00:00:00.000Z',
    })
    updatedAt: Date;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}
