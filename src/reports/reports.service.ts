import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  private getDateFilter(dateRange?: string): any {
    const where: any = {};
    const now = new Date();
    switch (dateRange) {
      case '7d': {
        const d = new Date(); d.setDate(d.getDate() - 7);
        where.date = { gte: d }; break;
      }
      case '30d': {
        const d = new Date(); d.setDate(d.getDate() - 30);
        where.date = { gte: d }; break;
      }
      case '90d': {
        const d = new Date(); d.setDate(d.getDate() - 90);
        where.date = { gte: d }; break;
      }
      case 'ytd': {
        where.date = { gte: new Date(now.getFullYear(), 0, 1) }; break;
      }
      default: {
        const d = new Date(); d.setDate(d.getDate() - 30);
        where.date = { gte: d }; break;
      }
    }
    return where;
  }

  private getPreviousPeriodFilter(dateRange?: string): any | null {
    const now = new Date();
    switch (dateRange) {
      case '7d': {
        const s = new Date(); s.setDate(s.getDate() - 14);
        const e = new Date(); e.setDate(e.getDate() - 7);
        return { date: { gte: s, lt: e } };
      }
      case '30d': {
        const s = new Date(); s.setDate(s.getDate() - 60);
        const e = new Date(); e.setDate(e.getDate() - 30);
        return { date: { gte: s, lt: e } };
      }
      case '90d': {
        const s = new Date(); s.setDate(s.getDate() - 180);
        const e = new Date(); e.setDate(e.getDate() - 90);
        return { date: { gte: s, lt: e } };
      }
      case 'ytd': {
        return { date: { gte: new Date(now.getFullYear() - 1, 0, 1), lt: new Date(now.getFullYear() - 1, 11, 31) } };
      }
      default: return null;
    }
  }

  // FIX 29: all amount → totalAmount
  async getSalesReport(dateRange?: string) {
    const dateFilter = this.getDateFilter(dateRange);
    const prevFilter = this.getPreviousPeriodFilter(dateRange);

    const [transactions, totalRevenueAgg, totalCount, prevRevenueAgg, prevCount] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { status: 'COMPLETED', ...dateFilter },
        include: { asset: { select: { name: true, type: true } } },
        orderBy: { date: 'desc' },
      }),
      this.prisma.transaction.aggregate({ where: { status: 'COMPLETED', ...dateFilter }, _sum: { totalAmount: true } }),
      this.prisma.transaction.count({ where: { status: 'COMPLETED', ...dateFilter } }),
      prevFilter
        ? this.prisma.transaction.aggregate({ where: { status: 'COMPLETED', ...prevFilter }, _sum: { totalAmount: true } })
        : { _sum: { totalAmount: 0 } },
      prevFilter ? this.prisma.transaction.count({ where: { status: 'COMPLETED', ...prevFilter } }) : 0,
    ]);

    const totalRevenue = totalRevenueAgg._sum.totalAmount || 0;
    const prevRevenue = (prevRevenueAgg as any)._sum.totalAmount || 0;
    const avgDealSize = totalCount > 0 ? totalRevenue / totalCount : 0;
    const prevAvg = prevCount > 0 ? prevRevenue / prevCount : 0;

    return {
      summary: {
        totalRevenue,
        totalTransactions: totalCount,
        avgDealSize,
        revenueChange: prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0,
        transactionChange: prevCount > 0 ? ((totalCount - prevCount) / prevCount) * 100 : 0,
        avgDealSizeChange: prevAvg > 0 ? ((avgDealSize - prevAvg) / prevAvg) * 100 : 0,
      },
      salesByMonth: this.processSalesByMonth(transactions),
      topAssets: (await this.getTopAssetsBySales(dateFilter)).slice(0, 10),
      salesByType: this.processSalesByType(transactions),
    };
  }

  private processSalesByMonth(transactions: any[]) {
    const data: Record<string, { revenue: number; transactions: number; commission: number }> = {};
    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!data[key]) data[key] = { revenue: 0, transactions: 0, commission: 0 };
      // FIX 29: use totalAmount
      data[key].revenue += tx.totalAmount || 0;
      data[key].transactions += 1;
      data[key].commission += tx.totalCommission || 0;
    });
    return Object.entries(data).map(([month, d]) => ({
      month, revenue: d.revenue, transactions: d.transactions,
      avgValue: d.transactions > 0 ? d.revenue / d.transactions : 0, commission: d.commission,
    }));
  }

  private async getTopAssetsBySales(dateFilter: any) {
    const result = await this.prisma.transaction.groupBy({
      by: ['assetId'],
      where: { status: 'COMPLETED', ...dateFilter },
      _sum: { totalAmount: true, totalCommission: true },
      _count: true,
      orderBy: { _sum: { totalAmount: 'desc' } },
      take: 10,
    });
    if (!result.length) return [];

    const assets = await this.prisma.asset.findMany({
      where: { id: { in: result.map((r) => r.assetId) } },
      select: { id: true, name: true, type: true, location: true },
    });
    const map = new Map(assets.map((a) => [a.id, a]));

    return result.map((r) => {
      const a = map.get(r.assetId);
      return {
        name: a?.name || 'Unknown', revenue: r._sum.totalAmount || 0,
        count: r._count, commission: r._sum.totalCommission || 0,
        type: a?.type || 'Unknown', location: a?.location || 'Unknown',
      };
    });
  }

  private processSalesByType(transactions: any[]) {
    const data: Record<string, { revenue: number; count: number; commission: number }> = {};
    transactions.forEach((tx) => {
      const type = tx.paymentType || 'Standard';
      if (!data[type]) data[type] = { revenue: 0, count: 0, commission: 0 };
      data[type].revenue += tx.totalAmount || 0;
      data[type].count += 1;
      data[type].commission += tx.totalCommission || 0;
    });
    return Object.entries(data).map(([type, d]) => ({
      type, revenue: d.revenue, count: d.count,
      avgValue: d.count > 0 ? d.revenue / d.count : 0, commission: d.commission,
    })).sort((a, b) => b.revenue - a.revenue);
  }

  // FIX 30: use leadTransactions / closerTransactions; use earnedLeadCommission / earnedCloserCommission (now in schema)
  async getAgentPerformance(dateRange?: string) {
    const dateFilter = this.getDateFilter(dateRange);

    const agents = await this.prisma.agent.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: { select: { name: true, email: true } },
        leadTransactions: {
          where: { status: 'COMPLETED', ...dateFilter },
          select: { totalAmount: true, leadCommission: true, earnedLeadCommission: true, totalCommission: true, earnedTotalCommission: true, date: true },
        },
        closerTransactions: {
          where: { status: 'COMPLETED', ...dateFilter },
          select: { totalAmount: true, closerCommission: true, earnedCloserCommission: true, totalCommission: true, earnedTotalCommission: true, date: true },
        },
        cluster: { select: { name: true } },
      },
    });

    const agentPerformance = agents.map((agent) => {
      const leadTxs = agent.leadTransactions || [];
      const closerTxs = agent.closerTransactions || [];
      const all = [...leadTxs, ...closerTxs];

      const revenue = all.reduce((s: number, tx: any) => s + (tx.totalAmount || 0), 0);
      const leadComm = leadTxs.reduce((s: number, tx: any) => s + (tx.earnedLeadCommission || tx.leadCommission || 0), 0);
      const closerComm = closerTxs.reduce((s: number, tx: any) => s + (tx.earnedCloserCommission || tx.closerCommission || 0), 0);
      const totalComm = all.reduce((s: number, tx: any) => s + (tx.earnedTotalCommission || tx.totalCommission || 0), 0);

      return {
        name: agent.user?.name || 'Unknown',
        email: agent.user?.email || '',
        cluster: agent.cluster?.name || 'Unassigned',
        closedDeals: all.length,
        revenue, totalCommission: totalComm, leadCommission: leadComm, closerCommission: closerComm,
        conversionRate: '0.0',
        avgDealSize: all.length > 0 ? revenue / all.length : 0,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    return {
      data: agentPerformance,
      summary: {
        totalAgents: agentPerformance.length,
        totalRevenue: agentPerformance.reduce((s, a) => s + a.revenue, 0),
        totalCommission: agentPerformance.reduce((s, a) => s + a.totalCommission, 0),
        avgConversionRate: '0.0',
      },
    };
  }

  // FIX 31: Cluster now has status field in schema; use leadTransactions/closerTransactions on agents
  async getClusterPerformance(dateRange?: string) {
    const dateFilter = this.getDateFilter(dateRange);

    const clusters = await this.prisma.cluster.findMany({
      where: { status: 'active' },
      include: {
        agents: {
          where: { status: 'ACTIVE' },
          include: {
            user: { select: { name: true, email: true } },
            leadTransactions: {
              where: { status: 'COMPLETED', ...dateFilter },
              select: { totalAmount: true, earnedLeadCommission: true, earnedTotalCommission: true, totalCommission: true },
            },
            closerTransactions: {
              where: { status: 'COMPLETED', ...dateFilter },
              select: { totalAmount: true, earnedCloserCommission: true, earnedTotalCommission: true, totalCommission: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const clusterPerformance = clusters.map((cluster) => {
      let agentsCount = 0, closedDeals = 0, revenue = 0, totalCommission = 0;
      cluster.agents.forEach((agent: any) => {
        const all = [...(agent.leadTransactions || []), ...(agent.closerTransactions || [])];
        if (all.length > 0) {
          agentsCount++;
          closedDeals += all.length;
          revenue += all.reduce((s: number, tx: any) => s + (tx.totalAmount || 0), 0);
          totalCommission += all.reduce((s: number, tx: any) => s + (tx.earnedTotalCommission || tx.totalCommission || 0), 0);
        }
      });
      return {
        name: cluster.name, agents: agentsCount, closedDeals, revenue, totalCommission,
        avgRevenuePerAgent: agentsCount > 0 ? revenue / agentsCount : 0,
        avgDealsPerAgent: agentsCount > 0 ? closedDeals / agentsCount : 0,
        avgCommissionPerAgent: agentsCount > 0 ? totalCommission / agentsCount : 0,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    const totals = clusterPerformance.reduce((acc, c) => ({
      agents: acc.agents + c.agents, revenue: acc.revenue + c.revenue,
      commission: acc.commission + c.totalCommission, deals: acc.deals + c.closedDeals,
    }), { agents: 0, revenue: 0, commission: 0, deals: 0 });

    return {
      data: clusterPerformance,
      summary: {
        totalClusters: clusterPerformance.length,
        totalAgents: totals.agents, totalRevenue: totals.revenue,
        totalCommission: totals.commission, totalClosedDeals: totals.deals,
        avgRevenuePerCluster: clusterPerformance.length > 0 ? totals.revenue / clusterPerformance.length : 0,
        avgAgentsPerCluster: clusterPerformance.length > 0 ? totals.agents / clusterPerformance.length : 0,
      },
    };
  }

  async exportReport(type: 'sales' | 'agents' | 'clusters', dateRange?: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet(type.charAt(0).toUpperCase() + type.slice(1));

    if (type === 'sales') {
      const data = await this.getSalesReport(dateRange);
      ws.addRow(['BuyOps - Sales Report']);
      ws.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
      ws.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
      ws.addRow([]);
      ws.addRow(['SUMMARY']);
      ws.addRow([]);
      ws.addRow(['Metric', 'Value', 'Change vs Previous Period']);
      ws.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`, `${data.summary.revenueChange.toFixed(1)}%`]);
      ws.addRow(['Total Transactions', data.summary.totalTransactions, `${data.summary.transactionChange.toFixed(1)}%`]);
      ws.addRow(['Average Deal Size', `₦${data.summary.avgDealSize.toLocaleString()}`, `${data.summary.avgDealSizeChange.toFixed(1)}%`]);
      ws.addRow([]);
      ws.addRow(['SALES BY MONTH']);
      ws.addRow([]);
      ws.addRow(['Month', 'Revenue', 'Transactions', 'Average Value', 'Commission']);
      data.salesByMonth.forEach((r) => ws.addRow([r.month, `₦${r.revenue.toLocaleString()}`, r.transactions, `₦${r.avgValue.toLocaleString()}`, `₦${r.commission.toLocaleString()}`]));
      ws.addRow([]);
      ws.addRow(['TOP PERFORMING ASSETS']);
      ws.addRow([]);
      ws.addRow(['Asset Name', 'Revenue', 'Transactions', 'Commission', 'Type', 'Location']);
      data.topAssets.forEach((a) => ws.addRow([a.name, `₦${a.revenue.toLocaleString()}`, a.count, `₦${a.commission.toLocaleString()}`, a.type, a.location]));
    } else if (type === 'agents') {
      const data = await this.getAgentPerformance(dateRange);
      ws.addRow(['BuyOps - Agent Performance Report']);
      ws.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
      ws.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
      ws.addRow([]);
      ws.addRow(['SUMMARY']);
      ws.addRow([]);
      ws.addRow(['Total Agents', data.summary.totalAgents]);
      ws.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`]);
      ws.addRow(['Total Commission', `₦${data.summary.totalCommission.toLocaleString()}`]);
      ws.addRow([]);
      ws.addRow(['AGENT PERFORMANCE']);
      ws.addRow([]);
      ws.addRow(['Name', 'Cluster', 'Closed Deals', 'Revenue', 'Total Commission', 'Lead Commission', 'Closer Commission', 'Avg Deal Size']);
      data.data.forEach((a) => ws.addRow([a.name, a.cluster, a.closedDeals, `₦${a.revenue.toLocaleString()}`, `₦${a.totalCommission.toLocaleString()}`, `₦${a.leadCommission.toLocaleString()}`, `₦${a.closerCommission.toLocaleString()}`, `₦${a.avgDealSize.toLocaleString()}`]));
    } else {
      const data = await this.getClusterPerformance(dateRange);
      ws.addRow(['BuyOps - Cluster Performance Report']);
      ws.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
      ws.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
      ws.addRow([]);
      ws.addRow(['SUMMARY']);
      ws.addRow([]);
      ws.addRow(['Total Clusters', data.summary.totalClusters]);
      ws.addRow(['Total Agents', data.summary.totalAgents]);
      ws.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`]);
      ws.addRow([]);
      ws.addRow(['CLUSTER PERFORMANCE']);
      ws.addRow([]);
      ws.addRow(['Cluster Name', 'Agents', 'Closed Deals', 'Revenue', 'Total Commission', 'Avg Revenue/Agent', 'Avg Deals/Agent']);
      data.data.forEach((c) => ws.addRow([c.name, c.agents, c.closedDeals, `₦${c.revenue.toLocaleString()}`, `₦${c.totalCommission.toLocaleString()}`, `₦${c.avgRevenuePerAgent.toLocaleString()}`, c.avgDealsPerAgent.toFixed(1)]));
    }

    // Styling
    ws.getRow(1).font = { bold: true, size: 16 };
    ws.eachRow((row, i) => {
      if (i > 4) {
        const val = row.getCell(1).value;
        if (typeof val === 'string' && ['SUMMARY','SALES BY MONTH','TOP PERFORMING ASSETS','AGENT PERFORMANCE','CLUSTER PERFORMANCE'].includes(val)) {
          row.font = { bold: true, size: 12 };
          row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
        }
      }
    });
    ws.columns?.forEach((col) => {
      if (col && col.eachCell) {
        let max = 10;
        col.eachCell({ includeEmpty: true }, (cell) => { max = Math.max(max, (cell.value?.toString().length || 0) + 2); });
        col.width = Math.min(max, 40);
      }
    });

    const buffer = await (workbook.xlsx as any).writeBuffer();
    return Buffer.from(buffer);
  }

  async getAssetPerformance(dateRange?: string) {
    // Example: status distribution
    const statusAgg = await this.prisma.asset.groupBy({
      by: ['status'],
      _count: { status: true },
    });
    const colors = ["#4c51bf", "#10b981", "#f59e42", "#e53e3e", "#6b7280"];
    const assetPerformanceData = statusAgg.map((s, i) => ({
      name: s.status,
      value: s._count.status,
      color: colors[i % colors.length],
    }));

    // Type breakdown
    const typeAgg = await this.prisma.asset.groupBy({
      by: ['type'],
      _count: { type: true },
      _sum: { basePrice: true },
    });
    const assetTypeBreakdown = typeAgg.map(t => ({
      type: t.type,
      count: t._count.type,
      totalValue: t._sum.basePrice || 0,
    }));

    return { assetPerformanceData, assetTypeBreakdown };
  }

  async getInvestmentTrends(dateRange?: string) {
    // Example: group transactions by month and ownershipType
    const txs = await this.prisma.transaction.findMany({
      where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) },
      select: { date: true, ownershipType: true, totalAmount: true }
    });
    const trends: Record<string, { fractional: number; full: number }> = {};
    txs.forEach(tx => {
      const d = new Date(tx.date);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!trends[key]) trends[key] = { fractional: 0, full: 0 };
      if (tx.ownershipType === 'Fractional') trends[key].fractional += tx.totalAmount;
      else trends[key].full += tx.totalAmount;
    });
    return Object.entries(trends).map(([month, v]) => ({ month, ...v }));
  }

  async getInvestorCategories(dateRange?: string) {
    // Example: group by investor type
    const investors = await this.prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });
    // Aggregate total invested per category
    const txs = await this.prisma.transaction.findMany({
      where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) },
      select: { buyerId: true, totalAmount: true }
    });
    const invested: Record<string, number> = {};
    txs.forEach(tx => {
      invested[tx.buyerId] = (invested[tx.buyerId] || 0) + tx.totalAmount;
    });
    return investors.map(i => ({
      category: i.role,
      count: i._count.role,
      totalInvested: Object.values(invested).reduce((sum, v) => sum + v, 0),
    }));
  }

  async getCommissionTrends(dateRange?: string) {
    const txs = await this.prisma.transaction.findMany({
      where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) },
      select: { date: true, leadCommission: true, closerCommission: true }
    });
    const data: Record<string, { agentComm: number; companyComm: number }> = {};
    txs.forEach(tx => {
      const d = new Date(tx.date);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!data[key]) data[key] = { agentComm: 0, companyComm: 0 };
      data[key].agentComm += (tx.leadCommission || 0) + (tx.closerCommission || 0);
      // companyComm logic here if needed
    });
    return Object.entries(data).map(([month, v]) => ({ month, ...v }));
  }

  async getTopAgents(dateRange?: string) {
    const agents = await this.prisma.agent.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: { select: { name: true } },
        leadTransactions: { where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) } },
        closerTransactions: { where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) } },
      },
    });
    return agents.map(a => ({
      name: a.user?.name ?? '',
      deals: (a.leadTransactions?.length ?? 0) + (a.closerTransactions?.length ?? 0),
      commission: (a.leadTransactions?.reduce((s, tx) => s + (tx.leadCommission || 0), 0) ?? 0) +
                (a.closerTransactions?.reduce((s, tx) => s + (tx.closerCommission || 0), 0) ?? 0),
      conversion: 'N/A', // Add conversion logic if available
    }));
  }

  async getConversionMetrics(dateRange?: string) {
    // Example: group leads by status
    const leads = await this.prisma.lead.groupBy({
      by: ['status'],
      _count: { status: true },
    });
    return leads.map(l => ({
      stage: l.status,
      count: l._count.status,
    }));
  }

  async getCommissionReports(dateRange?: string) {
    const dateFilter = this.getDateFilter(dateRange);

    // Fetch all completed transactions in the date range
    const transactions = await this.prisma.transaction.findMany({
      where: { status: 'COMPLETED', ...dateFilter },
      select: {
        date: true,
        leadCommission: true,
        closerCommission: true,
        totalCommission: true,
        commissionPaymentStatus: true,
        paymentType: true,
      },
      orderBy: { date: 'desc' },
    });

    // Calculate summary values
    let thisMonthTotal = 0;
    let totalEarned = 0;
    let pendingTotal = 0;
    let leadCommissionTotal = 0;
    let closerCommissionTotal = 0;
    let teamLeadBonus = 0;
    let teamTotalCommission = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        thisMonthTotal += tx.totalCommission || 0;
      }
      totalEarned += (tx.commissionPaymentStatus === 'PAID' ? tx.totalCommission || 0 : 0);
      pendingTotal += (tx.commissionPaymentStatus === 'PENDING' ? tx.totalCommission || 0 : 0);
      leadCommissionTotal += tx.leadCommission || 0;
      closerCommissionTotal += tx.closerCommission || 0;
      // Example: team lead bonus logic (customize as needed)
      if (tx.paymentType === 'installment') {
        teamLeadBonus += (tx.totalCommission || 0) * 0.05;
      }
      teamTotalCommission += tx.totalCommission || 0;
    });

    // Conversion rate calculation (example: paid/total)
    const conversionRate = transactions.length > 0
      ? Math.round((totalEarned / teamTotalCommission) * 100)
      : 0;

    // Monthly commission trend
    const monthlyMap: Record<string, number> = {};
    transactions.forEach(tx => {
      const d = new Date(tx.date);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyMap[key] = (monthlyMap[key] || 0) + (tx.totalCommission || 0);
    });
    const monthlyData = Object.entries(monthlyMap).map(([month, amount]) => ({
      month,
      amount,
    }));

    // Breakdown for chart
    const breakdown = [
      { name: "Lead", value: leadCommissionTotal, color: "#6366f1" },
      { name: "Closer", value: closerCommissionTotal, color: "#06b6d4" },
    ];

    return {
      summary: {
        thisMonth: `₦${thisMonthTotal.toLocaleString()}`,
        totalEarned: `₦${totalEarned.toLocaleString()}`,
        pending: `₦${pendingTotal.toLocaleString()}`,
        leadCommission: `₦${leadCommissionTotal.toLocaleString()}`,
        closerCommission: `₦${closerCommissionTotal.toLocaleString()}`,
        conversionRate: `${conversionRate}%`,
        teamLeadBonus: `₦${teamLeadBonus.toLocaleString()}`,
        teamTotalCommission: `₦${teamTotalCommission.toLocaleString()}`,
      },
      monthly: monthlyData,
      breakdown,
    };
  }
}
