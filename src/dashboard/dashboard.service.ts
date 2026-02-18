import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) { }

  // FIX 28: use totalAmount (not amount); remove cluster.status filter (now exists in schema)
  async getOverview() {
    const [
      totalAgents,
      activeClusters,
      totalRevenue,
      totalCommissions,
      activeAssets,
      assetTypeCounts,
      salesVolume,
    ] = await Promise.all([
      this.prisma.agent.count({ where: { status: 'ACTIVE' } }),
      this.prisma.cluster.count({ where: { status: 'active' } }),
      this.prisma.transaction.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalCommission: true },
      }),
      this.prisma.asset.count({ where: { status: 'published' } }),
      // Asset distribution by type (all assets, not just published)
      this.prisma.asset.groupBy({
        by: ['type'],
        _count: { type: true },
        where: { type: { not: null } },
      }),
      // Sales volume and revenue by month (last 12 months)
      this.prisma.$queryRawUnsafe(`
        SELECT 
          TO_CHAR("createdAt", 'YYYY-MM') AS month,
          COUNT(*) AS sales,
          SUM("totalAmount") AS revenue
        FROM "Transaction"
        WHERE status = 'COMPLETED'
        GROUP BY month
        ORDER BY month
        LIMIT 12
      `),
    ]);

    // KPIs
    // Calculate percentage change for KPIs
    function calcChange(current: number, previous: number): string {
      if (previous === undefined || previous === null) return 'N/A';
      if (previous === 0) return current > 0 ? '+100.0%' : '0.0%';
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    }

    // Example: fetch previous period values (replace with real queries)
    const prevAgents = 0; // TODO: query previous period
    const prevClusters = 0; // TODO: query previous period
    const prevRevenue = 0; // TODO: query previous period
    const prevCommissions = 0; // TODO: query previous period

    const kpis = [
      {
        title: "Total Agents",
        value: totalAgents,
        icon: "building",
        trend: "up",
        change: calcChange(totalAgents, prevAgents),
      },
      {
        title: "Active Clusters",
        value: activeClusters,
        icon: "trendingUp",
        trend: "up",
        change: calcChange(activeClusters, prevClusters),
      },
      {
        title: "Total Revenue",
        value: `₦${(totalRevenue._sum.totalAmount || 0).toLocaleString()}`,
        icon: "dollarSign",
        trend: "up",
        change: calcChange(Number(totalRevenue._sum.totalAmount || 0), prevRevenue),
      },
      {
        title: "Total Commissions",
        value: `₦${(totalCommissions._sum.totalCommission || 0).toLocaleString()}`,
        icon: "receipt",
        trend: "up",
        change: calcChange(Number(totalCommissions._sum.totalCommission || 0), prevCommissions),
      },
    ];

    // Asset Distribution
    const colors = ["#4c51bf", "#10b981", "#f59e42", "#e53e3e", "#6b7280"];
    const assetDistribution = assetTypeCounts.map((item, idx) => ({
      name: item.type || "Other",
      value: item._count.type,
      color: colors[idx % colors.length],
    }));

    // Sales Volume
    const salesVolumeData = (salesVolume as any[]).map((row) => ({
      month: row.month,
      sales: Number(row.sales),
      revenue: Number(row.revenue) / 1000, // for chart scaling
    }));

    return {
      kpis,
      assetDistribution,
      salesVolume: salesVolumeData,
    };
  }

  async getRecentTransactions() {
    return this.prisma.transaction.findMany({
      take: 10,
      orderBy: { date: 'desc' },
      include: {
        asset: { select: { id: true, name: true, type: true } },
        buyer: { select: { id: true, name: true } },
        company: { select: { id: true, name: true } },
        leadAgent: { include: { user: { select: { id: true, name: true } } } },
        closerAgent: { include: { user: { select: { id: true, name: true } } } },
      },
    });
  }
}
