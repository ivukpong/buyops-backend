// src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getOverview() {
        const [
            totalAgents,
            activeClusters,
            totalRevenue,
            totalCommissions,
            activeAssets,
        ] = await Promise.all([
            this.prisma.agent.count(),
            this.prisma.cluster.count({ where: { status: 'active' } }),
            this.prisma.transaction.aggregate({
                where: { status: 'completed' },
                _sum: { amount: true },
            }),
            this.prisma.transaction.aggregate({
                where: { status: 'completed' },
                _sum: { totalCommission: true },
            }),
            this.prisma.asset.count({ where: { status: 'published' } }),
        ]);

        return {
            totalAgents,
            activeClusters,
            totalRevenue: totalRevenue._sum.amount || 0,
            totalCommissions: totalCommissions._sum.totalCommission || 0,
            activeAssets,
            // Add change percentages later with date comparison
        };
    }

    async getRecentTransactions() {
        return this.prisma.transaction.findMany({
            take: 10,
            orderBy: { date: 'desc' },
            include: {
                asset: { select: { name: true } },
                buyer: { select: { name: true } },
                leadAgent: { include: { user: { select: { name: true } } } },
                closerAgent: { include: { user: { select: { name: true } } } },
            },
        });
    }
}