// src/reports/reports.controller.ts
import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportsController {
    constructor(private reportsService: ReportsService) { }

    @Get('sales')
    async getSalesReport(@Query('dateRange') dateRange?: string) {
        const report = await this.reportsService.getSalesReport(dateRange);
        return {
            success: true,
            salesData: report.salesByMonth,
            topSalesByAsset: report.topAssets.map(a => ({
                asset: a.name,
                sales: a.count,
                revenue: a.revenue,
                location: a.location,
            })),
            assetTypeBreakdown: report.salesByType.map(t => ({
                type: t.type,
                count: t.count,
                totalValue: t.revenue,
            })),
            summary: report.summary,
            message: 'Sales report fetched successfully'
        };
    }

    @Get('assets')
// @Roles('ADMIN', 'MANAGER')
async getAssetPerformance(@Query('dateRange') dateRange?: string) {
    const data = await this.reportsService.getAssetPerformance(dateRange);
    return { success: true, ...data };
}
    @Get('agents')
    async getAgentPerformance(@Query('dateRange') dateRange?: string) {
        const report = await this.reportsService.getAgentPerformance(dateRange);
        return {
            success: true,
            data: report.data, // Changed from report.data to report
            summary: report.summary,
            message: 'Agent performance report fetched successfully'
        };
    }

    @Get('clusters')
    async getClusterPerformance(@Query('dateRange') dateRange?: string) {
        const report = await this.reportsService.getClusterPerformance(dateRange);
        return {
            success: true,
            data: report.data, // Keep as report.data
            summary: report.summary,
            message: 'Cluster performance report fetched successfully'
        };
    }

    @Get('export')
    async exportReport(
        @Query('type') type: 'sales' | 'agents' | 'clusters',
        @Res() res: Response,
        @Query('dateRange') dateRange?: string,
    ) {
        const buffer = await this.reportsService.exportReport(type, dateRange);

        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.header('Content-Disposition', `attachment; filename=buyops-${type}-report-${dateRange || 'recent'}.xlsx`);

        return res.send(buffer);
    }

    @Get('investments')
    async getInvestmentReports(@Query('dateRange') dateRange?: string) {
        const trends = await this.reportsService.getInvestmentTrends(dateRange);
        // TODO: implement getInvestorCategories in service
        const categories = await this.reportsService.getInvestorCategories(dateRange);
        return {
            success: true,
            investmentTrends: trends,
            investorCategories: categories,
            message: 'Investment report fetched successfully'
        };
    }

    @Get('commissions')
    async getCommissionReports(@Query('dateRange') dateRange?: string) {
        const trends = await this.reportsService.getCommissionTrends(dateRange);
        const agents = await this.reportsService.getTopAgents(dateRange);
        return {
            success: true,
            commissionTrends: trends,
            topAgents: agents,
            message: 'Commission report fetched successfully'
        };
    }

    @Get('performance')
    async getPerformanceReports(@Query('dateRange') dateRange?: string) {
        const metrics = await this.reportsService.getConversionMetrics(dateRange);
        const clusters = await this.reportsService.getClusterPerformance(dateRange);
        return {
            success: true,
            conversionMetrics: metrics,
            clusterPerformance: clusters.data.map(c => ({
              cluster: c.name,
              target: 100, // Example, replace with real target
              achieved: c.closedDeals,
              performance: ((c.closedDeals / 100) * 100).toFixed(0), // Example
            })),
            message: 'Performance report fetched successfully'
        };
    }
}
