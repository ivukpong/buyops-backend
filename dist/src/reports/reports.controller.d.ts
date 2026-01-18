import { ReportsService } from './reports.service';
import { Response } from 'express';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    getSalesReport(dateRange?: string): Promise<{
        success: boolean;
        data: {
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
        };
        message: string;
    }>;
    getAgentPerformance(dateRange?: string): Promise<{
        success: boolean;
        data: {
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
        };
        summary: {
            totalAgents: number;
            totalRevenue: any;
            totalCommission: any;
            avgConversionRate: string;
        };
        message: string;
    }>;
    getClusterPerformance(dateRange?: string): Promise<{
        success: boolean;
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
        message: string;
    }>;
    exportReport(type: 'sales' | 'agents' | 'clusters', res: Response, dateRange?: string): Promise<Response<any, Record<string, any>>>;
}
