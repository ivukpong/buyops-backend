import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { 
  IsEmail, 
  IsNotEmpty, 
  MinLength, 
  IsString, 
  IsIn,
  Matches 
} from 'class-validator';
import { Transform } from 'class-transformer';

// ══════════════════════════════════════════════════════════════════════════
// DTOs with ALL BUG FIXES
// ══════════════════════════════════════════════════════════════════════════

export class LoginDto {
  // BUG_001 FIX: Case-insensitive email
  // BUG_002 FIX: Trim whitespace
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class RegisterDto {
  // BUG_001 & BUG_002 FIX: Transform email
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  // BUG_009 FIX: ISO 27001 compliant password policy
  // - Minimum 8 characters
  // - At least one uppercase letter
  // - At least one lowercase letter
  // - At least one number
  // - At least one special character
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, {
    message: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)',
  })
  password: string;

  // BUG_010 FIX: Name field is required
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  // BUG_011 FIX: Role field is required and validated
  @IsString()
  @IsNotEmpty({ message: 'Role is required' })
  @IsIn(['ADMIN', 'AGENT', 'FREELANCER', 'USER', 'TEAM_LEAD', 'INVESTOR'], { 
    message: 'Role must be one of: ADMIN, AGENT, FREELANCER, USER, TEAM_LEAD, INVESTOR' 
  })
  role: string;
}

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken!: string;
}

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword!: string;

  // Apply same password policy as registration
  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, {
    message: 'New password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newPassword!: string;
}

export class ForgotPasswordDto {
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Reset token is required' })
  token!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, {
    message: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newPassword!: string;
}

// ══════════════════════════════════════════════════════════════════════════
// CONTROLLER
// ══════════════════════════════════════════════════════════════════════════

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) {
    // Optional: implement token blacklisting here in production
    return { message: 'Logged out successfully' };
  }

  // BUG_004 FIX: Refresh token endpoint now requires authentication
  // This prevents unauthorized access to refresh tokens
  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: any, @Body() dto: RefreshTokenDto) {
    // Now requires valid Bearer access token AND refresh token
    return this.authService.refreshToken(dto.refreshToken, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body('email') email: string) {
    return this.authService.resendVerificationEmail(email);
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body('token') token: string) {
    try {
      const user = await this.authService.validateToken(token);
      return { valid: true, user };
    } catch {
      return { valid: false, message: 'Invalid or expired token' };
    }
  }
}
