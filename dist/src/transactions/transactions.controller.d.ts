import { TransactionsService } from "./transactions.service";
declare class CreateTransactionDto {
    assetId: string;
    buyerId: string;
    leadAgentId: string;
    closerAgentId: string;
    companyId: string;
    amount: number;
    paymentType: string;
    leadCommission: number;
    closerCommission: number;
    totalCommission: number;
    status: string;
}
declare class SendCommissionsDto {
    transactionIds: string[];
}
export declare class TransactionsController {
    private transactionsService;
    constructor(transactionsService: TransactionsService);
    findAll(month?: string): Promise<({
        asset: {
            id: string;
            name: string;
            referenceCode: string;
        };
        buyer: {
            id: string;
            name: string | null;
            email: string;
        };
        leadAgent: {
            id: string;
            user: {
                name: string | null;
                email: string;
            };
        };
        closerAgent: {
            id: string;
            user: {
                name: string | null;
                email: string;
            };
        } | null;
        company: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        assetId: string;
        buyerId: string;
        leadAgentId: string;
        closerAgentId: string | null;
        installmentPlanId: string | null;
        companyId: string;
        amount: number;
        paymentType: string;
        leadCommission: number;
        closerCommission: number | null;
        totalCommission: number;
        earnedLeadCommission: number | null;
        earnedCloserCommission: number | null;
        earnedTotalCommission: number | null;
        pendingLeadCommission: number | null;
        pendingCloserCommission: number | null;
        pendingTotalCommission: number | null;
        commissionPaymentStatus: string;
        status: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getStats(): Promise<{
        totalTransactions: number;
        completedTransactions: number;
        pendingTransactions: number;
        totalRevenue: number;
        totalCommission: number;
        earnedCommission: number;
        averageTransactionValue: number;
    }>;
    getUnpaidCommissions(month?: string): Promise<({
        asset: {
            name: string;
        };
        leadAgent: {
            user: {
                name: string | null;
            };
        } & {
            id: string;
            totalCommission: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            role: string;
            userId: string;
            clusterId: string;
            activeDeals: number;
            closedDeals: number;
            performance: number;
        };
        closerAgent: ({
            user: {
                name: string | null;
            };
        } & {
            id: string;
            totalCommission: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            role: string;
            userId: string;
            clusterId: string;
            activeDeals: number;
            closedDeals: number;
            performance: number;
        }) | null;
    } & {
        id: string;
        assetId: string;
        buyerId: string;
        leadAgentId: string;
        closerAgentId: string | null;
        installmentPlanId: string | null;
        companyId: string;
        amount: number;
        paymentType: string;
        leadCommission: number;
        closerCommission: number | null;
        totalCommission: number;
        earnedLeadCommission: number | null;
        earnedCloserCommission: number | null;
        earnedTotalCommission: number | null;
        pendingLeadCommission: number | null;
        pendingCloserCommission: number | null;
        pendingTotalCommission: number | null;
        commissionPaymentStatus: string;
        status: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getPaidCommissions(month?: string): Promise<({
        asset: {
            name: string;
        };
        leadAgent: {
            user: {
                name: string | null;
            };
        } & {
            id: string;
            totalCommission: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            role: string;
            userId: string;
            clusterId: string;
            activeDeals: number;
            closedDeals: number;
            performance: number;
        };
        closerAgent: ({
            user: {
                name: string | null;
            };
        } & {
            id: string;
            totalCommission: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            role: string;
            userId: string;
            clusterId: string;
            activeDeals: number;
            closedDeals: number;
            performance: number;
        }) | null;
    } & {
        id: string;
        assetId: string;
        buyerId: string;
        leadAgentId: string;
        closerAgentId: string | null;
        installmentPlanId: string | null;
        companyId: string;
        amount: number;
        paymentType: string;
        leadCommission: number;
        closerCommission: number | null;
        totalCommission: number;
        earnedLeadCommission: number | null;
        earnedCloserCommission: number | null;
        earnedTotalCommission: number | null;
        pendingLeadCommission: number | null;
        pendingCloserCommission: number | null;
        pendingTotalCommission: number | null;
        commissionPaymentStatus: string;
        status: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        asset: {
            id: string;
            companyId: string;
            leadCommission: number;
            closerCommission: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            referenceCode: string;
            type: string;
            projectStatus: string;
            location: string;
            address: string | null;
            landSize: string | null;
            builtSize: string | null;
            constructionStart: Date | null;
            constructionEnd: Date | null;
            propertyCategory: string;
            totalUnits: number;
            availableUnits: number;
            unitConfiguration: string | null;
            furnishingStatus: string | null;
            sharedFacilities: string[];
            facilityManagement: boolean;
            ownershipType: string;
            fractionTotal: number | null;
            costPerFraction: number | null;
            basePrice: number;
            markup: number;
            finalPrice: number;
            paymentOptions: string[];
            installmentPeriods: string[];
            downPaymentAmount: number | null;
            offPlanDiscount: number | null;
            stageBasedDiscount: number | null;
            projectedRentalIncome: number | null;
            rentalFrequency: string | null;
            operatingCost: number | null;
            capitalAppreciation: number | null;
            firstPayoutDate: Date | null;
            constructionStage: string | null;
            riskLevel: string;
            offPlanSecurity: string | null;
            exitLiquidity: string;
            managementMode: string;
            featured: boolean;
            totalAnnualReturn: number | null;
        };
        buyer: {
            id: string;
            name: string | null;
            email: string;
        };
        leadAgent: {
            user: {
                name: string | null;
                email: string;
            };
        } & {
            id: string;
            totalCommission: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            role: string;
            userId: string;
            clusterId: string;
            activeDeals: number;
            closedDeals: number;
            performance: number;
        };
        closerAgent: ({
            user: {
                name: string | null;
                email: string;
            };
        } & {
            id: string;
            totalCommission: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            role: string;
            userId: string;
            clusterId: string;
            activeDeals: number;
            closedDeals: number;
            performance: number;
        }) | null;
        company: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            type: string;
            address: string | null;
            email: string;
            phone: string;
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
            activeAssets: number;
            totalTransactions: number;
        };
    } & {
        id: string;
        assetId: string;
        buyerId: string;
        leadAgentId: string;
        closerAgentId: string | null;
        installmentPlanId: string | null;
        companyId: string;
        amount: number;
        paymentType: string;
        leadCommission: number;
        closerCommission: number | null;
        totalCommission: number;
        earnedLeadCommission: number | null;
        earnedCloserCommission: number | null;
        earnedTotalCommission: number | null;
        pendingLeadCommission: number | null;
        pendingCloserCommission: number | null;
        pendingTotalCommission: number | null;
        commissionPaymentStatus: string;
        status: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateTransactionDto): Promise<{
        asset: {
            id: string;
            companyId: string;
            leadCommission: number;
            closerCommission: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            referenceCode: string;
            type: string;
            projectStatus: string;
            location: string;
            address: string | null;
            landSize: string | null;
            builtSize: string | null;
            constructionStart: Date | null;
            constructionEnd: Date | null;
            propertyCategory: string;
            totalUnits: number;
            availableUnits: number;
            unitConfiguration: string | null;
            furnishingStatus: string | null;
            sharedFacilities: string[];
            facilityManagement: boolean;
            ownershipType: string;
            fractionTotal: number | null;
            costPerFraction: number | null;
            basePrice: number;
            markup: number;
            finalPrice: number;
            paymentOptions: string[];
            installmentPeriods: string[];
            downPaymentAmount: number | null;
            offPlanDiscount: number | null;
            stageBasedDiscount: number | null;
            projectedRentalIncome: number | null;
            rentalFrequency: string | null;
            operatingCost: number | null;
            capitalAppreciation: number | null;
            firstPayoutDate: Date | null;
            constructionStage: string | null;
            riskLevel: string;
            offPlanSecurity: string | null;
            exitLiquidity: string;
            managementMode: string;
            featured: boolean;
            totalAnnualReturn: number | null;
        };
        buyer: {
            name: string | null;
            email: string;
        };
        leadAgent: {
            user: {
                name: string | null;
            };
        } & {
            id: string;
            totalCommission: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            role: string;
            userId: string;
            clusterId: string;
            activeDeals: number;
            closedDeals: number;
            performance: number;
        };
        closerAgent: ({
            user: {
                name: string | null;
            };
        } & {
            id: string;
            totalCommission: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            role: string;
            userId: string;
            clusterId: string;
            activeDeals: number;
            closedDeals: number;
            performance: number;
        }) | null;
        company: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            type: string;
            address: string | null;
            email: string;
            phone: string;
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
            activeAssets: number;
            totalTransactions: number;
        };
    } & {
        id: string;
        assetId: string;
        buyerId: string;
        leadAgentId: string;
        closerAgentId: string | null;
        installmentPlanId: string | null;
        companyId: string;
        amount: number;
        paymentType: string;
        leadCommission: number;
        closerCommission: number | null;
        totalCommission: number;
        earnedLeadCommission: number | null;
        earnedCloserCommission: number | null;
        earnedTotalCommission: number | null;
        pendingLeadCommission: number | null;
        pendingCloserCommission: number | null;
        pendingTotalCommission: number | null;
        commissionPaymentStatus: string;
        status: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    sendCommissions(dto: SendCommissionsDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    uploadPaymentProof(file: Express.Multer.File): Promise<{
        message: string;
        count: number;
    }>;
    update(id: string, dto: Partial<CreateTransactionDto>): Promise<{
        asset: {
            id: string;
            companyId: string;
            leadCommission: number;
            closerCommission: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            referenceCode: string;
            type: string;
            projectStatus: string;
            location: string;
            address: string | null;
            landSize: string | null;
            builtSize: string | null;
            constructionStart: Date | null;
            constructionEnd: Date | null;
            propertyCategory: string;
            totalUnits: number;
            availableUnits: number;
            unitConfiguration: string | null;
            furnishingStatus: string | null;
            sharedFacilities: string[];
            facilityManagement: boolean;
            ownershipType: string;
            fractionTotal: number | null;
            costPerFraction: number | null;
            basePrice: number;
            markup: number;
            finalPrice: number;
            paymentOptions: string[];
            installmentPeriods: string[];
            downPaymentAmount: number | null;
            offPlanDiscount: number | null;
            stageBasedDiscount: number | null;
            projectedRentalIncome: number | null;
            rentalFrequency: string | null;
            operatingCost: number | null;
            capitalAppreciation: number | null;
            firstPayoutDate: Date | null;
            constructionStage: string | null;
            riskLevel: string;
            offPlanSecurity: string | null;
            exitLiquidity: string;
            managementMode: string;
            featured: boolean;
            totalAnnualReturn: number | null;
        };
        buyer: {
            name: string | null;
            email: string;
        };
        leadAgent: {
            user: {
                name: string | null;
            };
        } & {
            id: string;
            totalCommission: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            role: string;
            userId: string;
            clusterId: string;
            activeDeals: number;
            closedDeals: number;
            performance: number;
        };
        closerAgent: ({
            user: {
                name: string | null;
            };
        } & {
            id: string;
            totalCommission: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            role: string;
            userId: string;
            clusterId: string;
            activeDeals: number;
            closedDeals: number;
            performance: number;
        }) | null;
        company: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            type: string;
            address: string | null;
            email: string;
            phone: string;
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
            activeAssets: number;
            totalTransactions: number;
        };
    } & {
        id: string;
        assetId: string;
        buyerId: string;
        leadAgentId: string;
        closerAgentId: string | null;
        installmentPlanId: string | null;
        companyId: string;
        amount: number;
        paymentType: string;
        leadCommission: number;
        closerCommission: number | null;
        totalCommission: number;
        earnedLeadCommission: number | null;
        earnedCloserCommission: number | null;
        earnedTotalCommission: number | null;
        pendingLeadCommission: number | null;
        pendingCloserCommission: number | null;
        pendingTotalCommission: number | null;
        commissionPaymentStatus: string;
        status: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
