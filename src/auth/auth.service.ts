import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { UserRole } from '@prisma/client';
import { generateSerialId } from '../common/serial-id.helper';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) { }

  // ────────────────────────────────────────────────
  // Core authentication methods
  // ────────────────────────────────────────────────

  async validateUser(email: string, password: string) {
    // Normalize email: trim and lowercase
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    // Check if 2FA is required for this user
    const fullUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { twoFactorEnabled: true },
    });

    if ((fullUser as any)?.twoFactorEnabled) {
      // Issue a short-lived interim token (no role, short expiry) for 2FA step
      const interimToken = this.jwtService.sign(
        { sub: user.id, email: user.email, requires2FA: true },
        { expiresIn: '5m' },
      );
      return { requiresTwoFactor: true, interimToken };
    }

    console.log('LOGIN USER:', user); // Add this line
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0],
        phone: user.phone || null,
        role: user.role || 'USER',
      },
    };
  }

  async register(data: { email: string; password: string; name?: string; role?: UserRole; phone?: string }) {
    // Normalize email: trim and lowercase
    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) throw new ConflictException('Email already in use');

    // Enforce strong password: min 8 chars, at least one number and one special char
    const strongPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!strongPassword.test(data.password)) {
      throw new ConflictException('Password must be at least 8 characters long and include a number and a special character.');
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const serialId = await generateSerialId(this.prisma, 'USR');
    const user = await this.prisma.user.create({
      data: {
        serialId,
        email: normalizedEmail,
        password: hashed,
        name: data.name || normalizedEmail.split('@')[0],
        phone: data.phone || null,
        role: data.role || UserRole.USER,
      },
    });

    const { password: _, ...result } = user;
    return this.login(result);
  }

  // ────────────────────────────────────────────────
  // Token & session related
  // ────────────────────────────────────────────────

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, name: true, role: true },
      });
      if (!user) throw new UnauthorizedException('User not found');
      return user;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, name: true, role: true },
      });
      if (!user) throw new UnauthorizedException('User not found');
      return this.login(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // ────────────────────────────────────────────────
  // Profile & password management
  // ────────────────────────────────────────────────

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Optional: include relations if your UI needs them
        // agentProfile: { ... },
        // freelancerProfile: { ... },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return { message: 'Password changed successfully' };
  }

  // ────────────────────────────────────────────────
  // Password recovery flow
  // ────────────────────────────────────────────────

  async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Security: don't reveal whether email exists
    if (!user) {
      return { message: 'If an account exists, a reset link has been sent.' };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '1h' },
    );

    // Send password reset email
    await this.notificationService.sendPasswordResetEmail(user, resetToken);

    return {
      message: 'If an account exists, a reset link has been sent.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) throw new UnauthorizedException('Invalid reset token');

      const hashed = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashed },
      });

      return { message: 'Password reset successfully' };
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }

  // ────────────────────────────────────────────────
  // Email verification flow (if you implement it)
  // ────────────────────────────────────────────────

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) throw new UnauthorizedException('Invalid verification token');

      // TODO: update emailVerified field if you have it
      // await this.prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });

      return { message: 'Email verified successfully' };
    } catch {
      throw new UnauthorizedException('Invalid or expired verification token');
    }
  }

  async resendVerificationEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return { message: 'If an account exists, a verification link has been sent.' };
    }

    const verificationToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '24h' },
    );

    // Send verification email
    await this.notificationService.sendEmailVerificationEmail(user, verificationToken);

    return {
      message: 'If an account exists, a verification link has been sent.',
    };
  }

  // ────────────────────────────────────────────────
  // Logout (mostly client-side, but can be extended)
  // ────────────────────────────────────────────────

  async logout(userId: string) {
    // In stateless JWT → nothing to do server-side
    // In production you could:
    // • add token to blacklist (Redis)
    // • log the event
    return { message: 'Logged out successfully' };
  }

  // ────────────────────────────────────────────────
  // Two-Factor Authentication (TOTP)
  // ────────────────────────────────────────────────

  async generate2FASecret(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const secret = speakeasy.generateSecret({
      name: `BuyOps (${user.email})`,
      issuer: 'BuyOps',
      length: 20,
    });

    // Temporarily store the secret (not yet enabled)
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 } as any,
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);
    return { secret: secret.base32, qrCode: qrCodeUrl };
  }

  async enable2FA(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const secret = (user as any).twoFactorSecret;
    if (!secret) throw new BadRequestException('Please set up 2FA first');

    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) throw new BadRequestException('Invalid verification code');

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true } as any,
    });

    return { message: '2FA enabled successfully' };
  }

  async disable2FA(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (!(user as any).twoFactorEnabled) throw new BadRequestException('2FA is not enabled');

    const secret = (user as any).twoFactorSecret;
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) throw new BadRequestException('Invalid verification code');

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null } as any,
    });

    return { message: '2FA disabled successfully' };
  }

  async verify2FAAndLogin(interimToken: string, totpToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(interimToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired interim token');
    }

    if (!payload.requires2FA) throw new UnauthorizedException('Invalid interim token');

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('User not found');

    const secret = (user as any).twoFactorSecret;
    if (!secret) throw new BadRequestException('2FA secret not found');

    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: totpToken,
      window: 1,
    });

    if (!verified) throw new UnauthorizedException('Invalid 2FA code');

    // Issue full JWT
    const { password: _, ...safeUser } = user as any;
    const jwtPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(jwtPayload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(jwtPayload, { expiresIn: '30d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0],
        phone: user.phone || null,
        role: user.role,
      },
    };
  }
}