import { CompaniesService } from "./companies.service";
declare class CreateCompanyDto {
    name: string;
    type: string;
    registrationNumber?: string;
    contactPerson: string;
    email: string;
    phone: string;
    address?: string;
    agreementStartDate: string;
    agreementExpiryDate: string;
    commissionRate: number;
    paymentTerms: string;
    notes?: string;
    accountName?: string;
    bankName?: string;
    accountNumber?: string;
    status: string;
}
export declare class CompaniesController {
    private companiesService;
    constructor(companiesService: CompaniesService);
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
    findOne(id: string): Promise<{
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
    create(dto: CreateCompanyDto): Promise<{
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
    update(id: string, dto: Partial<CreateCompanyDto>): Promise<{
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
    remove(id: string): Promise<{
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
export {};
