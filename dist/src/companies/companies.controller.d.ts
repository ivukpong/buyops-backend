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
    findOne(id: string): Promise<{
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
    create(dto: CreateCompanyDto): Promise<{
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
    update(id: string, dto: Partial<CreateCompanyDto>): Promise<{
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
    remove(id: string): Promise<{
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
export {};
