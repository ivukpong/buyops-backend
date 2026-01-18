import { PrismaService } from '../prisma/prisma.service';
export declare class InvestmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: {
        amount: number;
        note?: string;
    }): Promise<{
        amount: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
    }>;
    findByUser(userId: string): Promise<{
        amount: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
    }[]>;
    findAll(): Promise<{
        amount: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
    }[]>;
}
