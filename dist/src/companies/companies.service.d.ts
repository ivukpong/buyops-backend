import { PrismaService } from "../prisma/prisma.service";
export declare class CompaniesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        assets: {
            id: string;
            name: string;
            status: string;
        }[];
        _count: {
            transactions: number;
            assets: number;
        };
    } & {
        id: string;
        email: string;
        name: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        registrationNumber: string | null;
        contactPerson: string;
        address: string | null;
        agreementStartDate: Date;
        agreementExpiryDate: Date;
        commissionRate: number;
        paymentTerms: string;
        notes: string | null;
        accountName: string | null;
        bankName: string | null;
        accountNumber: string | null;
        status: string;
        activeAssets: number;
        totalTransactions: number;
    })[]>;
    findById(id: string): Promise<{
        transactions: {
            id: string;
            status: string;
            amount: number;
            date: Date;
        }[];
        assets: {
            id: string;
            name: string;
            type: string;
            status: string;
            finalPrice: number;
        }[];
        _count: {
            transactions: number;
            assets: number;
        };
    } & {
        id: string;
        email: string;
        name: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        registrationNumber: string | null;
        contactPerson: string;
        address: string | null;
        agreementStartDate: Date;
        agreementExpiryDate: Date;
        commissionRate: number;
        paymentTerms: string;
        notes: string | null;
        accountName: string | null;
        bankName: string | null;
        accountNumber: string | null;
        status: string;
        activeAssets: number;
        totalTransactions: number;
    }>;
    create(data: any): Promise<{
        _count: {
            transactions: number;
            assets: number;
        };
    } & {
        id: string;
        email: string;
        name: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        registrationNumber: string | null;
        contactPerson: string;
        address: string | null;
        agreementStartDate: Date;
        agreementExpiryDate: Date;
        commissionRate: number;
        paymentTerms: string;
        notes: string | null;
        accountName: string | null;
        bankName: string | null;
        accountNumber: string | null;
        status: string;
        activeAssets: number;
        totalTransactions: number;
    }>;
    update(id: string, data: any): Promise<{
        _count: {
            transactions: number;
            assets: number;
        };
    } & {
        id: string;
        email: string;
        name: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        registrationNumber: string | null;
        contactPerson: string;
        address: string | null;
        agreementStartDate: Date;
        agreementExpiryDate: Date;
        commissionRate: number;
        paymentTerms: string;
        notes: string | null;
        accountName: string | null;
        bankName: string | null;
        accountNumber: string | null;
        status: string;
        activeAssets: number;
        totalTransactions: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        registrationNumber: string | null;
        contactPerson: string;
        address: string | null;
        agreementStartDate: Date;
        agreementExpiryDate: Date;
        commissionRate: number;
        paymentTerms: string;
        notes: string | null;
        accountName: string | null;
        bankName: string | null;
        accountNumber: string | null;
        status: string;
        activeAssets: number;
        totalTransactions: number;
    }>;
    updateStats(companyId: string): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        registrationNumber: string | null;
        contactPerson: string;
        address: string | null;
        agreementStartDate: Date;
        agreementExpiryDate: Date;
        commissionRate: number;
        paymentTerms: string;
        notes: string | null;
        accountName: string | null;
        bankName: string | null;
        accountNumber: string | null;
        status: string;
        activeAssets: number;
        totalTransactions: number;
    }>;
}
