import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  // ────────────────────────────────────────────────
  // Core authentication methods
  // ────────────────────────────────────────────────

  async validateUser(email: string, password: string) {
    console.log('VALIDATE USER:', email);
    const user = await this.prisma.user.findUnique({ where: { email } });
   console.log(user)
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    console.log(isValid)
    if (!isValid) return null;

    const { password: _, ...result } = user;
    console.log(result)
    return result;
  }

  async login(user: any) {
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
        role: user.role || 'USER',
      },
    };
  }

  async register(data: { email: string; password: string; name?: string; role?: UserRole }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name || data.email.split('@')[0],
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
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Security: don't reveal whether email exists
    if (!user) {
      return { message: 'If an account exists, a reset link has been sent.' };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '1h' },
    );

    // TODO: in production → send email with link
    // For development/testing:
    console.log(`Reset password token for ${email}: ${resetToken}`);

    return {
      message: 'If an account exists, a reset link has been sent.',
      // Only return token in dev – remove in production!
      // resetToken,
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
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { message: 'If an account exists, a verification link has been sent.' };
    }

    const verificationToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '24h' },
    );

    // TODO: in production → send email
    console.log(`Verification token for ${email}: ${verificationToken}`);

    return {
      message: 'If an account exists, a verification link has been sent.',
      // verificationToken,  // remove in production
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
}