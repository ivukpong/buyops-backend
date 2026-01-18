import { PrismaService } from '../prisma/prisma.service';
export declare class InvestmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: {
        amount: number;
        note?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        note: string | null;
    }>;
    findByUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        note: string | null;
    }[]>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        note: string | null;
    }[]>;
}
