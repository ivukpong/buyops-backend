import { PrismaService } from "../prisma/prisma.service";
export declare class CompaniesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            transactions: number;
            assets: number;
        };
        assets: {
            id: string;
            status: string;
            name: string;
        }[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        address: string | null;
        email: string;
        phone: string;
        activeAssets: number;
        registrationNumber: string | null;
        contactPerson: string;
        agreementStartDate: Date;
        agreementExpiryDate: Date;
        commissionRate: number;
        paymentTerms: string;
        notes: string | null;
        accountName: string | null;
        bankName: string | null;
        accountNumber: string | null;
        totalTransactions: number;
    })[]>;
    findById(id: string): Promise<{
        _count: {
            transactions: number;
            assets: number;
        };
        transactions: {
            amount: number;
            id: string;
            status: string;
            date: Date;
        }[];
        assets: {
            id: string;
            status: string;
            name: string;
            type: string;
            finalPrice: number;
        }[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        address: string | null;
        email: string;
        phone: string;
        activeAssets: number;
        registrationNumber: string | null;
        contactPerson: string;
        agreementStartDate: Date;
        agreementExpiryDate: Date;
        commissionRate: number;
        paymentTerms: string;
        notes: string | null;
        accountName: string | null;
        bankName: string | null;
        accountNumber: string | null;
        totalTransactions: number;
    }>;
    create(data: any): Promise<{
        _count: {
            transactions: number;
            assets: number;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        address: string | null;
        email: string;
        phone: string;
        activeAssets: number;
        registrationNumber: string | null;
        contactPerson: string;
        agreementStartDate: Date;
        agreementExpiryDate: Date;
        commissionRate: number;
        paymentTerms: string;
        notes: string | null;
        accountName: string | null;
        bankName: string | null;
        accountNumber: string | null;
        totalTransactions: number;
    }>;
    update(id: string, data: any): Promise<{
        _count: {
            transactions: number;
            assets: number;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        address: string | null;
        email: string;
        phone: string;
        activeAssets: number;
        registrationNumber: string | null;
        contactPerson: string;
        agreementStartDate: Date;
        agreementExpiryDate: Date;
        commissionRate: number;
        paymentTerms: string;
        notes: string | null;
        accountName: string | null;
        bankName: string | null;
        accountNumber: string | null;
        totalTransactions: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        address: string | null;
        email: string;
        phone: string;
        activeAssets: number;
        registrationNumber: string | null;
        contactPerson: string;
        agreementStartDate: Date;
        agreementExpiryDate: Date;
        commissionRate: number;
        paymentTerms: string;
        notes: string | null;
        accountName: string | null;
        bankName: string | null;
        accountNumber: string | null;
        totalTransactions: number;
    }>;
    updateStats(companyId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        address: string | null;
        email: string;
        phone: string;
        activeAssets: number;
        registrationNumber: string | null;
        contactPerson: string;
        agreementStartDate: Date;
        agreementExpiryDate: Date;
        commissionRate: number;
        paymentTerms: string;
        notes: string | null;
        accountName: string | null;
        bankName: string | null;
        accountNumber: string | null;
        totalTransactions: number;
    }>;
}
