import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        role: string;
        phone: string | null;
    }>;
    login(user: any): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    register(data: {
        email: string;
        password: string;
        name?: string;
        role?: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    validateToken(token: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        role: string;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
}
