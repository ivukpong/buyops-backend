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
    @Roles('ADMIN', 'MANAGER')
    async getSalesReport(@Query('dateRange') dateRange?: string) {
        const report = await this.reportsService.getSalesReport(dateRange);
        return {
            success: true,
            data: report,
            message: 'Sales report fetched successfully'
        };
    }

    @Get('agents')
    @Roles('ADMIN', 'MANAGER')
    async getAgentPerformance(@Query('dateRange') dateRange?: string) {
        const report = await this.reportsService.getAgentPerformance(dateRange);
        return {
            success: true,
            data: report, // Changed from report.data to report
            summary: report.summary,
            message: 'Agent performance report fetched successfully'
        };
    }

    @Get('clusters')
    @Roles('ADMIN', 'MANAGER')
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
    @Roles('ADMIN', 'MANAGER')
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
}
