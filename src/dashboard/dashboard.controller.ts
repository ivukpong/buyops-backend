// src/dashboard/dashboard.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('overview')
    getOverview() {
        return this.dashboardService.getOverview();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('recent-transactions')
    getRecentTransactions() {
        return this.dashboardService.getRecentTransactions();
    }
}