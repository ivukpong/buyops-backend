// src/reports/reports.service.ts - CORRECTED VERSION
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    private getDateFilter(dateRange?: string): any {
        const where: any = {};
        const now = new Date();

        switch (dateRange) {
            case '7d':
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                where.date = { gte: weekAgo };
                break;
            case '30d':
                const monthAgo = new Date();
                monthAgo.setDate(monthAgo.getDate() - 30);
                where.date = { gte: monthAgo };
                break;
            case '90d':
                const quarterAgo = new Date();
                quarterAgo.setDate(quarterAgo.getDate() - 90);
                where.date = { gte: quarterAgo };
                break;
            case 'ytd':
                const yearStart = new Date(now.getFullYear(), 0, 1);
                where.date = { gte: yearStart };
                break;
            default:
                // Last 30 days as default
                const defaultAgo = new Date();
                defaultAgo.setDate(defaultAgo.getDate() - 30);
                where.date = { gte: defaultAgo };
                break;
        }

        return where;
    }

    private getPreviousPeriodFilter(dateRange?: string): any {
        const where: any = {};
        const now = new Date();

        switch (dateRange) {
            case '7d':
                const weekAgoStart = new Date();
                weekAgoStart.setDate(weekAgoStart.getDate() - 14);
                const weekAgoEnd = new Date();
                weekAgoEnd.setDate(weekAgoEnd.getDate() - 7);
                where.date = { gte: weekAgoStart, lt: weekAgoEnd };
                break;
            case '30d':
                const monthAgoStart = new Date();
                monthAgoStart.setDate(monthAgoStart.getDate() - 60);
                const monthAgoEnd = new Date();
                monthAgoEnd.setDate(monthAgoEnd.getDate() - 30);
                where.date = { gte: monthAgoStart, lt: monthAgoEnd };
                break;
            case '90d':
                const quarterAgoStart = new Date();
                quarterAgoStart.setDate(quarterAgoStart.getDate() - 180);
                const quarterAgoEnd = new Date();
                quarterAgoEnd.setDate(quarterAgoEnd.getDate() - 90);
                where.date = { gte: quarterAgoStart, lt: quarterAgoEnd };
                break;
            case 'ytd':
                const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
                const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31);
                where.date = { gte: lastYearStart, lt: lastYearEnd };
                break;
            default:
                return null;
        }

        return where;
    }

    async getSalesReport(dateRange?: string) {
        const dateFilter = this.getDateFilter(dateRange);
        const previousPeriodFilter = this.getPreviousPeriodFilter(dateRange);

        const [
            transactions,
            previousTransactions,
            totalRevenueAgg,
            totalTransactionsCount,
            previousRevenueAgg,
            previousTransactionsCount,
        ] = await Promise.all([
            this.prisma.transaction.findMany({
                where: {
                    status: 'completed',
                    ...dateFilter,
                },
                include: {
                    asset: {
                        select: {
                            name: true,
                            type: true,
                        }
                    }
                },
                orderBy: {
                    date: 'desc'
                }
            }),
            previousPeriodFilter ? this.prisma.transaction.findMany({
                where: {
                    status: 'completed',
                    ...previousPeriodFilter,
                },
            }) : [],
            this.prisma.transaction.aggregate({
                where: {
                    status: 'completed',
                    ...dateFilter,
                },
                _sum: { amount: true },
            }),
            this.prisma.transaction.count({
                where: {
                    status: 'completed',
                    ...dateFilter,
                },
            }),
            previousPeriodFilter ? this.prisma.transaction.aggregate({
                where: {
                    status: 'completed',
                    ...previousPeriodFilter,
                },
                _sum: { amount: true },
            }) : { _sum: { amount: 0 } },
            previousPeriodFilter ? this.prisma.transaction.count({
                where: {
                    status: 'completed',
                    ...previousPeriodFilter,
                },
            }) : 0,
        ]);

        const totalRevenue = totalRevenueAgg._sum.amount || 0;
        const totalTransactions = totalTransactionsCount;
        const avgDealSize = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

        const previousRevenue = previousRevenueAgg._sum.amount || 0;
        const previousTransactionsCountVal = previousTransactionsCount;
        const previousAvgDealSize = previousTransactionsCountVal > 0 ? previousRevenue / previousTransactionsCountVal : 0;

        // Calculate percentage changes
        const revenueChange = previousRevenue > 0
            ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
            : 0;

        const transactionChange = previousTransactionsCountVal > 0
            ? ((totalTransactions - previousTransactionsCountVal) / previousTransactionsCountVal) * 100
            : 0;

        const avgDealSizeChange = previousAvgDealSize > 0
            ? ((avgDealSize - previousAvgDealSize) / previousAvgDealSize) * 100
            : 0;

        // Process sales by month
        const salesByMonth = this.processSalesByMonth(transactions);

        // Get top assets
        const topAssets = await this.getTopAssetsBySales(dateFilter);

        // Get sales by type
        const salesByType = this.processSalesByType(transactions);

        return {
            summary: {
                totalRevenue,
                totalTransactions,
                avgDealSize,
                revenueChange,
                transactionChange,
                avgDealSizeChange,
            },
            salesByMonth,
            topAssets: topAssets.slice(0, 10),
            salesByType,
        };
    }

    private processSalesByMonth(transactions: any[]) {
        const monthlyData: Record<string, {
            revenue: number;
            transactions: number;
            commission: number;
        }> = {};

        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            if (!monthlyData[monthName]) {
                monthlyData[monthName] = { revenue: 0, transactions: 0, commission: 0 };
            }

            monthlyData[monthName].revenue += tx.amount;
            monthlyData[monthName].transactions += 1;
            monthlyData[monthName].commission += tx.totalCommission || 0;
        });

        return Object.entries(monthlyData).map(([month, data]) => ({
            month,
            revenue: data.revenue,
            transactions: data.transactions,
            avgValue: data.transactions > 0 ? data.revenue / data.transactions : 0,
            commission: data.commission,
        })).sort((a, b) => {
            const [aMonth, aYear] = a.month.split(' ');
            const [bMonth, bYear] = b.month.split(' ');
            return new Date(`${aMonth} 1, ${aYear}`).getTime() - new Date(`${bMonth} 1, ${bYear}`).getTime();
        });
    }

    private async getTopAssetsBySales(dateFilter: any) {
        const result = await this.prisma.transaction.groupBy({
            by: ['assetId'],
            where: {
                status: 'completed',
                ...dateFilter,
            },
            _sum: {
                amount: true,
                totalCommission: true
            },
            _count: true,
            orderBy: { _sum: { amount: 'desc' } },
            take: 10,
        });

        if (result.length === 0) {
            return [];
        }

        const assetIds = result.map(r => r.assetId);
        const assets = await this.prisma.asset.findMany({
            where: { id: { in: assetIds } },
            select: {
                id: true,
                name: true,
                type: true,
                location: true,
            },
        });

        const assetsMap = new Map(assets.map(a => [a.id, a]));

        return result.map(r => {
            const asset = assetsMap.get(r.assetId);
            return {
                name: asset?.name || 'Unknown Asset',
                revenue: r._sum.amount || 0,
                count: r._count,
                commission: r._sum.totalCommission || 0,
                type: asset?.type || 'Unknown',
                location: asset?.location || 'Unknown',
            };
        });
    }

    private processSalesByType(transactions: any[]) {
        const typeData: Record<string, { revenue: number; count: number; commission: number }> = {};

        transactions.forEach(tx => {
            const type = tx.paymentType || 'Unknown';

            if (!typeData[type]) {
                typeData[type] = { revenue: 0, count: 0, commission: 0 };
            }

            typeData[type].revenue += tx.amount;
            typeData[type].count += 1;
            typeData[type].commission += tx.totalCommission || 0;
        });

        return Object.entries(typeData).map(([type, data]) => ({
            type,
            revenue: data.revenue,
            count: data.count,
            avgValue: data.count > 0 ? data.revenue / data.count : 0,
            commission: data.commission,
        })).sort((a, b) => b.revenue - a.revenue);
    }

    async getAgentPerformance(dateRange?: string) {
        const dateFilter = this.getDateFilter(dateRange);

        // Get all agents with their transactions
        const agents = await this.prisma.agent.findMany({
            where: { status: 'active' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                // Include both lead and closer transactions
                leadsAsLead: {
                    where: {
                        status: 'completed',
                        ...dateFilter,
                    },
                    select: {
                        amount: true,
                        leadCommission: true,
                        closerCommission: true,
                        totalCommission: true,
                        date: true,
                        earnedLeadCommission: true,
                        earnedTotalCommission: true,
                    }
                },
                leadsAsCloser: {
                    where: {
                        status: 'completed',
                        ...dateFilter,
                    },
                    select: {
                        amount: true,
                        leadCommission: true,
                        closerCommission: true,
                        totalCommission: true,
                        date: true,
                        earnedCloserCommission: true,
                        earnedTotalCommission: true,
                    }
                },
                cluster: {
                    select: {
                        name: true,
                    }
                }
            }
        });

        // Calculate performance for each agent
        const agentPerformance = agents.map(agent => {
            const leadTransactions = agent.leadsAsLead || [];
            const closerTransactions = agent.leadsAsCloser || [];

            // Combine all transactions where agent was involved
            const allTransactions = [...leadTransactions, ...closerTransactions];
            const closedDeals = allTransactions.length;

            // Calculate revenue (use amount from any transaction)
            const revenue = allTransactions.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);

            // Calculate commissions - earned commissions
            const leadCommissionEarned = leadTransactions.reduce((sum: number, tx: any) =>
                sum + (tx.earnedLeadCommission || tx.leadCommission || 0), 0);
            const closerCommissionEarned = closerTransactions.reduce((sum: number, tx: any) =>
                sum + (tx.earnedCloserCommission || tx.closerCommission || 0), 0);
            const totalCommissionEarned = allTransactions.reduce((sum: number, tx: any) =>
                sum + (tx.earnedTotalCommission || tx.totalCommission || 0), 0);

            return {
                name: agent.user?.name || 'Unknown Agent',
                email: agent.user?.email || '',
                cluster: agent.cluster?.name || 'Unassigned',
                closedDeals,
                revenue,
                totalCommission: totalCommissionEarned,
                leadCommission: leadCommissionEarned,
                closerCommission: closerCommissionEarned,
                conversionRate: '0.0',
                avgDealSize: closedDeals > 0 ? revenue / closedDeals : 0,
            };
        }).sort((a, b) => b.revenue - a.revenue);

        return {
            data: agentPerformance,
            summary: {
                totalAgents: agentPerformance.length,
                totalRevenue: agentPerformance.reduce((sum, agent) => sum + agent.revenue, 0),
                totalCommission: agentPerformance.reduce((sum, agent) => sum + agent.totalCommission, 0),
                avgConversionRate: '0.0',
            }
        };
    }

    async getClusterPerformance(dateRange?: string) {
        const dateFilter = this.getDateFilter(dateRange);

        // Get all clusters with their agents
        const clusters = await this.prisma.cluster.findMany({
            where: { status: 'active' },
            include: {
                agents: {
                    where: { status: 'active' },
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            }
                        },
                        leadsAsLead: {
                            where: {
                                status: 'completed',
                                ...dateFilter,
                            },
                            select: {
                                amount: true,
                                leadCommission: true,
                                closerCommission: true,
                                totalCommission: true,
                                date: true,
                                earnedLeadCommission: true,
                                earnedTotalCommission: true,
                            }
                        },
                        leadsAsCloser: {
                            where: {
                                status: 'completed',
                                ...dateFilter,
                            },
                            select: {
                                amount: true,
                                leadCommission: true,
                                closerCommission: true,
                                totalCommission: true,
                                date: true,
                                earnedCloserCommission: true,
                                earnedTotalCommission: true,
                            }
                        }
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        // Calculate performance for each cluster
        const clusterPerformance = clusters.map(cluster => {
            let agentsCount = 0;
            let closedDeals = 0;
            let revenue = 0;
            let totalCommission = 0;

            // Calculate cluster totals from all agents
            cluster.agents.forEach((agent: any) => {
                const leadTransactions = agent.leadsAsLead || [];
                const closerTransactions = agent.leadsAsCloser || [];
                const allTransactions = [...leadTransactions, ...closerTransactions];
                const agentClosedDeals = allTransactions.length;

                if (agentClosedDeals > 0) {
                    agentsCount++;
                    closedDeals += agentClosedDeals;
                    revenue += allTransactions.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
                    totalCommission += allTransactions.reduce((sum: number, tx: any) =>
                        sum + (tx.earnedTotalCommission || tx.totalCommission || 0), 0);
                }
            });

            return {
                name: cluster.name,
                agents: agentsCount,
                closedDeals,
                revenue,
                totalCommission,
                avgRevenuePerAgent: agentsCount > 0 ? revenue / agentsCount : 0,
                avgDealsPerAgent: agentsCount > 0 ? closedDeals / agentsCount : 0,
                avgCommissionPerAgent: agentsCount > 0 ? totalCommission / agentsCount : 0,
            };
        }).sort((a, b) => b.revenue - a.revenue);

        // Calculate overall summary
        const totalClusters = clusterPerformance.length;
        const totalAgentsOverall = clusterPerformance.reduce(
            (sum: number, cluster: { agents: number }) => sum + cluster.agents, 0);
        const totalRevenueOverall = clusterPerformance.reduce(
            (sum: number, cluster: { revenue: number }) => sum + cluster.revenue, 0);
        const totalCommissionOverall = clusterPerformance.reduce(
            (sum: number, cluster: { totalCommission: number }) =>
                sum + cluster.totalCommission,
            0
        );

        const totalClosedDealsOverall = clusterPerformance.reduce(
            (sum: number, cluster: { closedDeals: number }) => sum + cluster.closedDeals, 0);

        return {
            data: clusterPerformance,
            summary: {
                totalClusters,
                totalAgents: totalAgentsOverall,
                totalRevenue: totalRevenueOverall,
                totalCommission: totalCommissionOverall,
                totalClosedDeals: totalClosedDealsOverall,
                avgRevenuePerCluster: totalClusters > 0 ? totalRevenueOverall / totalClusters : 0,
                avgAgentsPerCluster: totalClusters > 0 ? totalAgentsOverall / totalClusters : 0,
            }
        };
    }

    async exportReport(type: 'sales' | 'agents' | 'clusters', dateRange?: string): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(type.charAt(0).toUpperCase() + type.slice(1));

        if (type === 'sales') {
            const data = await this.getSalesReport(dateRange);

            // Header
            worksheet.addRow(['BuyOps - Sales Report']);
            worksheet.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            worksheet.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            worksheet.addRow([]);

            // Summary section
            worksheet.addRow(['SUMMARY']);
            worksheet.addRow([]);
            worksheet.addRow(['Metric', 'Value', 'Change vs Previous Period']);
            worksheet.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`, `${data.summary.revenueChange.toFixed(1)}%`]);
            worksheet.addRow(['Total Transactions', data.summary.totalTransactions, `${data.summary.transactionChange.toFixed(1)}%`]);
            worksheet.addRow(['Average Deal Size', `₦${data.summary.avgDealSize.toLocaleString()}`, `${data.summary.avgDealSizeChange.toFixed(1)}%`]);
            worksheet.addRow([]);

            // Sales by Month
            worksheet.addRow(['SALES BY MONTH']);
            worksheet.addRow([]);
            worksheet.addRow(['Month', 'Revenue', 'Transactions', 'Average Value', 'Commission']);
            data.salesByMonth.forEach(row => {
                worksheet.addRow([
                    row.month,
                    `₦${row.revenue.toLocaleString()}`,
                    row.transactions,
                    `₦${row.avgValue.toLocaleString()}`,
                    `₦${row.commission.toLocaleString()}`
                ]);
            });

            worksheet.addRow([]);

            // Top Assets
            worksheet.addRow(['TOP PERFORMING ASSETS']);
            worksheet.addRow([]);
            worksheet.addRow(['Asset Name', 'Revenue', 'Transactions', 'Commission', 'Type', 'Location']);
            data.topAssets.forEach(asset => {
                worksheet.addRow([
                    asset.name,
                    `₦${asset.revenue.toLocaleString()}`,
                    asset.count,
                    `₦${asset.commission.toLocaleString()}`,
                    asset.type,
                    asset.location
                ]);
            });

        } else if (type === 'agents') {
            const data = await this.getAgentPerformance(dateRange);

            worksheet.addRow(['BuyOps - Agent Performance Report']);
            worksheet.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            worksheet.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            worksheet.addRow([]);

            // Summary
            worksheet.addRow(['SUMMARY']);
            worksheet.addRow([]);
            worksheet.addRow(['Total Agents', data.summary.totalAgents]);
            worksheet.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`]);
            worksheet.addRow(['Total Commission', `₦${data.summary.totalCommission.toLocaleString()}`]);
            worksheet.addRow(['Average Conversion Rate', `${data.summary.avgConversionRate}%`]);
            worksheet.addRow([]);

            // Agent Details
            worksheet.addRow(['AGENT PERFORMANCE']);
            worksheet.addRow([]);
            worksheet.addRow(['Name', 'Cluster', 'Closed Deals', 'Revenue', 'Total Commission', 'Lead Commission', 'Closer Commission', 'Conversion Rate', 'Avg Deal Size']);

            data.data.forEach(agent => {
                worksheet.addRow([
                    agent.name,
                    agent.cluster,
                    agent.closedDeals,
                    `₦${agent.revenue.toLocaleString()}`,
                    `₦${agent.totalCommission.toLocaleString()}`,
                    `₦${agent.leadCommission.toLocaleString()}`,
                    `₦${agent.closerCommission.toLocaleString()}`,
                    `${agent.conversionRate}%`,
                    `₦${agent.avgDealSize.toLocaleString()}`
                ]);
            });

        } else if (type === 'clusters') {
            const data = await this.getClusterPerformance(dateRange);

            worksheet.addRow(['BuyOps - Cluster Performance Report']);
            worksheet.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            worksheet.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            worksheet.addRow([]);

            // Summary
            worksheet.addRow(['SUMMARY']);
            worksheet.addRow([]);
            worksheet.addRow(['Total Clusters', data.summary.totalClusters]);
            worksheet.addRow(['Total Agents', data.summary.totalAgents]);
            worksheet.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`]);
            worksheet.addRow(['Total Commission', `₦${data.summary.totalCommission.toLocaleString()}`]);
            worksheet.addRow(['Total Closed Deals', data.summary.totalClosedDeals]);
            worksheet.addRow(['Avg Revenue per Cluster', `₦${data.summary.avgRevenuePerCluster.toLocaleString()}`]);
            worksheet.addRow(['Avg Agents per Cluster', data.summary.avgAgentsPerCluster.toFixed(1)]);
            worksheet.addRow([]);

            // Cluster Details
            worksheet.addRow(['CLUSTER PERFORMANCE']);
            worksheet.addRow([]);
            worksheet.addRow(['Cluster Name', 'Agents', 'Closed Deals', 'Revenue', 'Total Commission', 'Avg Revenue/Agent', 'Avg Deals/Agent']);

            data.data.forEach(cluster => {
                worksheet.addRow([
                    cluster.name,
                    cluster.agents,
                    cluster.closedDeals,
                    `₦${cluster.revenue.toLocaleString()}`,
                    `₦${cluster.totalCommission.toLocaleString()}`,
                    `₦${cluster.avgRevenuePerAgent.toLocaleString()}`,
                    cluster.avgDealsPerAgent.toFixed(1),
                ]);
            });
        }

        // Apply styling
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.font = { bold: true, size: 16 };
                row.alignment = { horizontal: 'center' };
            } else if (rowNumber <= 4) {
                row.font = { italic: true };
            } else if (row.getCell(1).value &&
                typeof row.getCell(1).value === 'string' &&
                ['SUMMARY', 'SALES BY MONTH', 'TOP PERFORMING ASSETS',
                    'AGENT PERFORMANCE', 'CLUSTER PERFORMANCE'].includes(row.getCell(1).value as string)) {
                row.font = { bold: true, size: 12 };
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE0E0E0' }
                };
            } else if (rowNumber > 5 && row.getCell(1).value &&
                typeof row.getCell(1).value === 'string' &&
                !['Metric', 'Month', 'Name', 'Cluster Name'].includes(row.getCell(1).value as string)) {
                // Header rows
                row.font = { bold: true };
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF0F0F0' }
                };
            }
        });

        // Auto-fit columns
        worksheet.columns?.forEach(column => {
            if (column && column.eachCell) {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, cell => {
                    const cellLength = cell.value ? cell.value.toString().length : 0;
                    maxLength = Math.max(maxLength, cellLength);
                });
                column.width = Math.min(maxLength + 2, 40);
            }
        });

        const buffer = await (workbook.xlsx as any).writeBuffer();
        return Buffer.from(buffer);
    }
}