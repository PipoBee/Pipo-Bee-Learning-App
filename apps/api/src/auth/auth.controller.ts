import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

export class LoginDto {
  @ApiProperty({ example: 'student@phonicsquest.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Learner123!' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'Jamie Rivera' })
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({ example: 'jamie@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Learn123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: ['STUDENT', 'PARENT'], example: 'STUDENT' })
  @IsIn(['STUDENT', 'PARENT'])
  role: 'STUDENT' | 'PARENT';
}

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a Student or Parent account' })
  @ApiResponse({ status: 201, description: 'Account created' })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user & return JWT token with profile' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user & linked profiles' })
  async getMe(@Request() req: { user: { id: string } }) {
    return this.authService.getMe(req.user.id);
  }
}
