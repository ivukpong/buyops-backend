import { PrismaService } from '../prisma/prisma.service';
export declare class InstallmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: {
        status?: string;
    }): Promise<({
        asset: {
            id: string;
            name: string;
            referenceCode: string;
        };
        leadAgent: {
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            totalCommission: number;
            id: string;
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
        closerAgent: {
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            totalCommission: number;
            id: string;
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
        company: {
            id: string;
            name: string;
        };
        installments: {
            amount: number;
            id: string;
            installmentPlanId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            paidAmount: number;
            dueDate: Date;
            paidDate: Date | null;
            paymentMethod: string | null;
        }[];
    } & {
        id: string;
        assetId: string;
        leadAgentId: string;
        closerAgentId: string | null;
        companyId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        buyerName: string;
        buyerEmail: string;
        buyerPhone: string;
        transactionId: string | null;
        totalAmount: number;
        downPayment: number;
        remainingBalance: number;
        paidAmount: number;
        numberOfInstallments: number;
        completedInstallments: number;
        installmentAmount: number;
        frequency: string;
        startDate: Date;
        nextDueDate: Date | null;
    })[]>;
    create(dto: any): Promise<{
        id: string;
        assetId: string;
        leadAgentId: string;
        closerAgentId: string | null;
        companyId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        buyerName: string;
        buyerEmail: string;
        buyerPhone: string;
        transactionId: string | null;
        totalAmount: number;
        downPayment: number;
        remainingBalance: number;
        paidAmount: number;
        numberOfInstallments: number;
        completedInstallments: number;
        installmentAmount: number;
        frequency: string;
        startDate: Date;
        nextDueDate: Date | null;
    }>;
    findById(id: string): Promise<{
        asset: {
            leadCommission: number;
            closerCommission: number;
            id: string;
            companyId: string;
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
        leadAgent: {
            user: {
                name: string;
                email: string;
            };
        } & {
            totalCommission: number;
            id: string;
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
        closerAgent: {
            user: {
                name: string;
                email: string;
            };
        } & {
            totalCommission: number;
            id: string;
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
        installments: {
            amount: number;
            id: string;
            installmentPlanId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            paidAmount: number;
            dueDate: Date;
            paidDate: Date | null;
            paymentMethod: string | null;
        }[];
    } & {
        id: string;
        assetId: string;
        leadAgentId: string;
        closerAgentId: string | null;
        companyId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        buyerName: string;
        buyerEmail: string;
        buyerPhone: string;
        transactionId: string | null;
        totalAmount: number;
        downPayment: number;
        remainingBalance: number;
        paidAmount: number;
        numberOfInstallments: number;
        completedInstallments: number;
        installmentAmount: number;
        frequency: string;
        startDate: Date;
        nextDueDate: Date | null;
    }>;
    getInstallmentSchedule(planId: string): Promise<{
        amount: number;
        id: string;
        installmentPlanId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        paidAmount: number;
        dueDate: Date;
        paidDate: Date | null;
        paymentMethod: string | null;
    }[]>;
    recordPayment(planId: string, installmentId: string, data: {
        amount: number;
        paymentMethod: string;
    }): Promise<{
        amount: number;
        id: string;
        installmentPlanId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        paidAmount: number;
        dueDate: Date;
        paidDate: Date | null;
        paymentMethod: string | null;
    }>;
    sendPaymentReminder(data: {
        installmentId: string;
        reminderDate: string;
        method: string;
    }): Promise<{
        message: string;
        installmentId: string;
        method: string;
        sentAt: Date;
    }>;
    getStats(): Promise<{
        activePlans: number;
        completedPlans: number;
        totalOutstanding: number;
        totalCollected: number;
        overduePayments: number;
    }>;
    updateInstallmentStatuses(): Promise<void>;
    private generateInstallmentSchedule;
    private calculateDueDate;
}
