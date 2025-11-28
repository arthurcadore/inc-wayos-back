import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, UserInToken } from '../services/auth.service';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: LoginResponseDto
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid credentials'
    })
    async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
        return this.authService.login(loginDto);
    }

    // Endpoint de exemplo protegido por JWT
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
        status: 200,
        description: 'User profile retrieved successfully',
        type: UserResponseDto
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized'
    })
    getProfile(@Request() req: { user: UserInToken }): unknown {
        return req.user;
    }
}
