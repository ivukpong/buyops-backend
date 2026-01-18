import { InstallmentsService } from "./installments.service";
declare class CreateInstallmentPlanDto {
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    assetId: string;
    totalAmount: number;
    downPayment: number;
    numberOfInstallments: number;
    frequency: string;
    startDate: string;
    leadAgentId: string;
    closerAgentId: string;
    companyId: string;
}
declare class SendReminderDto {
    installmentId: string;
    reminderDate: string;
    method: string;
}
export declare class InstallmentsController {
    private installmentsService;
    constructor(installmentsService: InstallmentsService);
    findAll(status?: string): Promise<({
        company: {
            id: string;
            name: string;
        };
        asset: {
            id: string;
            name: string;
            referenceCode: string;
        };
        leadAgent: {
            user: {
                id: string;
                email: string;
                name: string | null;
            };
        } & {
            id: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            totalCommission: number;
            activeDeals: number;
            closedDeals: number;
            performance: number;
            userId: string;
            clusterId: string;
        };
        closerAgent: ({
            user: {
                id: string;
                email: string;
                name: string | null;
            };
        } & {
            id: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            totalCommission: number;
            activeDeals: number;
            closedDeals: number;
            performance: number;
            userId: string;
            clusterId: string;
        }) | null;
        installments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            installmentPlanId: string;
            amount: number;
            paidAmount: number;
            dueDate: Date;
            paidDate: Date | null;
            paymentMethod: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        companyId: string;
        assetId: string;
        leadAgentId: string;
        closerAgentId: string | null;
        buyerName: string;
        buyerEmail: string;
        buyerPhone: string;
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
        transactionId: string | null;
    })[]>;
    getStats(): Promise<{
        activePlans: number;
        completedPlans: number;
        totalOutstanding: number;
        totalCollected: number;
        overduePayments: number;
    }>;
    findOne(id: string): Promise<{
        asset: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            address: string | null;
            status: string;
            location: string;
            referenceCode: string;
            projectStatus: string;
            companyId: string;
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
            leadCommission: number;
            closerCommission: number;
            featured: boolean;
            totalAnnualReturn: number | null;
        };
        leadAgent: {
            user: {
                email: string;
                name: string | null;
            };
        } & {
            id: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            totalCommission: number;
            activeDeals: number;
            closedDeals: number;
            performance: number;
            userId: string;
            clusterId: string;
        };
        closerAgent: ({
            user: {
                email: string;
                name: string | null;
            };
        } & {
            id: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            totalCommission: number;
            activeDeals: number;
            closedDeals: number;
            performance: number;
            userId: string;
            clusterId: string;
        }) | null;
        installments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            installmentPlanId: string;
            amount: number;
            paidAmount: number;
            dueDate: Date;
            paidDate: Date | null;
            paymentMethod: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        companyId: string;
        assetId: string;
        leadAgentId: string;
        closerAgentId: string | null;
        buyerName: string;
        buyerEmail: string;
        buyerPhone: string;
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
        transactionId: string | null;
    }>;
    getSchedule(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        installmentPlanId: string;
        amount: number;
        paidAmount: number;
        dueDate: Date;
        paidDate: Date | null;
        paymentMethod: string | null;
    }[]>;
    create(dto: CreateInstallmentPlanDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        companyId: string;
        assetId: string;
        leadAgentId: string;
        closerAgentId: string | null;
        buyerName: string;
        buyerEmail: string;
        buyerPhone: string;
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
        transactionId: string | null;
    }>;
    sendReminder(dto: SendReminderDto): Promise<{
        message: string;
        installmentId: string;
        method: string;
        sentAt: Date;
    }>;
    recordPayment(id: string, installmentId: string, body: {
        amount: number;
        paymentMethod: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        installmentPlanId: string;
        amount: number;
        paidAmount: number;
        dueDate: Date;
        paidDate: Date | null;
        paymentMethod: string | null;
    }>;
}
export {};
