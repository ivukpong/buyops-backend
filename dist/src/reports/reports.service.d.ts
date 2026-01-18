import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    private getDateFilter;
    private getPreviousPeriodFilter;
    getSalesReport(dateRange?: string): Promise<{
        summary: {
            totalRevenue: number;
            totalTransactions: number;
            avgDealSize: number;
            revenueChange: number;
            transactionChange: number;
            avgDealSizeChange: number;
        };
        salesByMonth: {
            month: string;
            revenue: number;
            transactions: number;
            avgValue: number;
            commission: number;
        }[];
        topAssets: {
            name: string;
            revenue: number;
            count: number;
            commission: number;
            type: string;
            location: string;
        }[];
        salesByType: {
            type: string;
            revenue: number;
            count: number;
            avgValue: number;
            commission: number;
        }[];
    }>;
    private processSalesByMonth;
    private getTopAssetsBySales;
    private processSalesByType;
    getAgentPerformance(dateRange?: string): Promise<{
        data: {
            name: string;
            email: string;
            cluster: string;
            closedDeals: number;
            revenue: any;
            totalCommission: any;
            leadCommission: any;
            closerCommission: any;
            conversionRate: string;
            avgDealSize: number;
        }[];
        summary: {
            totalAgents: number;
            totalRevenue: any;
            totalCommission: any;
            avgConversionRate: string;
        };
    }>;
    getClusterPerformance(dateRange?: string): Promise<{
        data: {
            name: string;
            agents: number;
            closedDeals: number;
            revenue: number;
            totalCommission: number;
            avgRevenuePerAgent: number;
            avgDealsPerAgent: number;
            avgCommissionPerAgent: number;
        }[];
        summary: {
            totalClusters: number;
            totalAgents: number;
            totalRevenue: number;
            totalCommission: number;
            totalClosedDeals: number;
            avgRevenuePerCluster: number;
            avgAgentsPerCluster: number;
        };
    }>;
    exportReport(type: 'sales' | 'agents' | 'clusters', dateRange?: string): Promise<Buffer>;
}
