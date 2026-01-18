import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
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
            name: string | null;
        };
        leadAgent: {
            user: {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        totalCommission: number;
        companyId: string;
        leadCommission: number;
        closerCommission: number | null;
        installmentPlanId: string | null;
        amount: number;
        paymentType: string;
        earnedLeadCommission: number | null;
        earnedCloserCommission: number | null;
        earnedTotalCommission: number | null;
        pendingLeadCommission: number | null;
        pendingCloserCommission: number | null;
        pendingTotalCommission: number | null;
        commissionPaymentStatus: string;
        date: Date;
        assetId: string;
        buyerId: string;
        leadAgentId: string;
        closerAgentId: string | null;
    })[]>;
}
