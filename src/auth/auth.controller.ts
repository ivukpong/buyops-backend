import { Body, Controller, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards, Get, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '@prisma/client';

export class LoginDto {
  @Transform(({ value }) => String(value || '').trim().toLowerCase())
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  // At least one number and one special character
  // Custom validator could be used for more complex rules
  password!: string;
}

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  role?: UserRole;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }


  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    // First, validate the user and get the full user object:
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user); // user has id, email, role, etc.
  }


  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // AuthService expects a user object, not separate args
    return this.authService.register(dto);
  }

  // FIX 3: refreshToken service method only takes 1 arg (the token string)
  // NOTE: No JwtAuthGuard here — the refresh token itself is verified inside the service.
  // Guarding with JwtAuthGuard would cause refresh to always fail since it's only
  // called when the access token has already expired.
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  // Get current user profile (GET /auth/me)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    return this.usersService.findById(req.user.id);
  }

  // Update current user profile (PUT /auth/me)
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(@Req() req: any, @Body() dto: any) {
    return this.usersService.updateUser(req.user.id, dto);
  }

  // Change password (POST /auth/change-password)
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req: any, @Body() body: { currentPassword: string; newPassword: string }) {
    return this.authService.changePassword(req.user.id, body.currentPassword, body.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    return this.authService.logout(req.user.id);
  }

  // ── 2FA endpoints ──────────────────────────────

  /** Step 1: Generate a TOTP secret and QR code for the current user */
  @UseGuards(JwtAuthGuard)
  @Post('2fa/setup')
  async setup2FA(@Req() req: any) {
    return this.authService.generate2FASecret(req.user.id);
  }

  /** Step 2: Confirm the code scanned from the QR and enable 2FA */
  @UseGuards(JwtAuthGuard)
  @Post('2fa/enable')
  @HttpCode(200)
  async enable2FA(@Req() req: any, @Body() body: { token: string }) {
    return this.authService.enable2FA(req.user.id, body.token);
  }

  /** Disable 2FA (requires a valid TOTP to confirm intent) */
  @UseGuards(JwtAuthGuard)
  @Post('2fa/disable')
  @HttpCode(200)
  async disable2FA(@Req() req: any, @Body() body: { token: string }) {
    return this.authService.disable2FA(req.user.id, body.token);
  }

  /** During login: exchange interim token + TOTP code for a full JWT */
  @Post('2fa/verify')
  @HttpCode(200)
  async verify2FA(@Body() body: { interimToken: string; token: string }) {
    return this.authService.verify2FAAndLogin(body.interimToken, body.token);
  }
}
