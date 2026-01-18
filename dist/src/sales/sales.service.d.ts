import { PrismaService } from '../prisma/prisma.service';
export declare class SalesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: {
        productId: string;
        quantity: number;
        total: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        quantity: number;
        total: number;
        productId: string;
    }>;
    findByUser(userId: string): Promise<({
        product: {
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: number | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        quantity: number;
        total: number;
        productId: string;
    })[]>;
    findAll(): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
        product: {
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: number | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        quantity: number;
        total: number;
        productId: string;
    })[]>;
}
