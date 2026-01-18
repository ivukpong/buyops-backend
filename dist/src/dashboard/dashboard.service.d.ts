import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getOverview(): Promise<{
        totalAgents: number;
        activeClusters: number;
        totalRevenue: number;
        totalCommissions: number;
        activeAssets: number;
    }>;
    getRecentTransactions(): Promise<({
        asset: {
            name: string;
        };
        buyer: {
            name: string;
        };
        leadAgent: {
            user: {
                name: string;
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
    } & {
        amount: number;
        leadCommission: number;
        closerCommission: number | null;
        totalCommission: number;
        earnedLeadCommission: number | null;
        earnedCloserCommission: number | null;
        earnedTotalCommission: number | null;
        pendingLeadCommission: number | null;
        pendingCloserCommission: number | null;
        pendingTotalCommission: number | null;
        id: string;
        assetId: string;
        buyerId: string;
        leadAgentId: string;
        closerAgentId: string | null;
        installmentPlanId: string | null;
        companyId: string;
        paymentType: string;
        commissionPaymentStatus: string;
        status: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
