import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommissionPaymentStatus } from '@prisma/client';

export interface TransactionFilter {
  status?: string;
  agentId?: string;
  companyId?: string;
  month?: string; // Add this line
}

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) { }

  // Update or create a filter type/interface

  // Get all unpaid commissions, optionally filtered by month
  async getUnpaidCommissions({ month }: { month?: string }) {
    return this.findAll({
      status: undefined,
      month,
    }).then(transactions =>
      transactions.filter(
        t => t.status === 'unpaid' || t.status === 'sent'
      )
    );
  }

  // Get all paid commissions, optionally filtered by month
  async getPaidCommissions({ month }: { month?: string }) {
    return this.findAll({
      status: undefined,
      month,
    }).then(transactions =>
      transactions.filter(
        t => t.status === 'paid'
      )
    );
  }

  // Mark commissions as sent for payment
  async sendCommissionsForPayment(transactionIds: string[]) {
    await this.prisma.transaction.updateMany({
      where: { id: { in: transactionIds } },
      data: { commissionPaymentStatus: 'SENT' },
    });
    return { message: 'Commissions marked as sent', transactionIds };
  }

  // Upload payment proof for a transaction
  async uploadPaymentProof(file: Express.Multer.File) {
    // Mark all 'sent' commissions as 'PAID'
    await this.prisma.transaction.updateMany({
      where: { commissionPaymentStatus: 'SENT' },
      data: { commissionPaymentStatus: 'PAID' },
    });
    // Optionally, store file info in DB
    return { message: 'Payment proof uploaded and commissions marked as paid', fileName: file?.originalname };
  }

  async findAll(filters?: { status?: string; agentId?: string; companyId?: string; month?: string }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.agentId) {
      where.OR = [{ leadAgentId: filters.agentId }, { closerAgentId: filters.agentId }];
    }
    if (filters?.companyId) where.companyId = filters.companyId;
    if (filters?.month) {
      // Filter by month (YYYY-MM)
      const [year, month] = filters.month.split('-');
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 1);
      where.date = { gte: start, lt: end };
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      include: {
        asset: { select: { name: true } },
        buyer: { select: { name: true } },
        company: { select: { name: true } },
        leadAgent: { include: { user: { select: { name: true } } } },
        closerAgent: { include: { user: { select: { name: true } } } },
        installments: true,
      },
      orderBy: { date: 'desc' },
    });

    // Map to frontend shape
    return transactions.map(formatDeal);
  }

  async findById(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        asset: true,
        buyer: { select: { id: true, name: true, email: true } },
        company: true,
        leadAgent: { include: { user: { select: { id: true, name: true } } } },
        closerAgent: { include: { user: { select: { id: true, name: true } } } },
        installments: { orderBy: { dueDate: 'asc' } },
        installmentPlans: true,
        commissions: { include: { agent: { include: { user: { select: { id: true, name: true } } } } } },
      },
    });

    if (!transaction) throw new NotFoundException(`Transaction with ID ${id} not found`);
    return transaction;
  }

  // FIX 15: use totalAmount, companyId, paymentType (all now in schema)
  async create(data: any) {
    if (!data.assetId) throw new BadRequestException('Asset ID is required');
    if (!data.buyerId) throw new BadRequestException('Buyer ID is required');
    if (!data.totalAmount) throw new BadRequestException('Total amount is required');

    const asset = await this.prisma.asset.findUnique({ where: { id: data.assetId } });
    if (!asset) throw new NotFoundException('Asset not found');

    const buyer = await this.prisma.user.findUnique({ where: { id: data.buyerId } });
    if (!buyer) throw new NotFoundException('Buyer not found');

    return this.prisma.transaction.create({
      data: {
        assetId: data.assetId,
        buyerId: data.buyerId,
        totalAmount: parseFloat(data.totalAmount),
        companyId: data.companyId || asset.companyId || null,
        paymentType: data.paymentType || null,
        leadAgentId: data.leadAgentId || null,
        closerAgentId: data.closerAgentId || null,
        leadCommission: data.leadCommission ? parseFloat(data.leadCommission) : 0,
        closerCommission: data.closerCommission ? parseFloat(data.closerCommission) : 0,
        totalCommission: data.totalCommission ? parseFloat(data.totalCommission) : 0,
        commission: data.commission ? parseFloat(data.commission) : 0,
        status: data.status || CommissionPaymentStatus.UNPAID,
        commissionPaymentStatus: data.commissionPaymentStatus || CommissionPaymentStatus.UNPAID,
        installmentDuration: data.installmentDuration ? parseInt(data.installmentDuration) : null,
      },
      include: {
        asset: { select: { id: true, name: true } },
        buyer: { select: { id: true, name: true } },
        company: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, data: any) {
    await this.findById(id);

    const updateData: any = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.commissionPaymentStatus !== undefined) updateData.commissionPaymentStatus = data.commissionPaymentStatus;
    if (data.leadAgentId !== undefined) updateData.leadAgentId = data.leadAgentId;
    if (data.closerAgentId !== undefined) updateData.closerAgentId = data.closerAgentId;
    if (data.totalAmount !== undefined) updateData.totalAmount = parseFloat(data.totalAmount);
    if (data.paymentType !== undefined) updateData.paymentType = data.paymentType;
    if (data.companyId !== undefined) updateData.companyId = data.companyId;

    return this.prisma.transaction.update({
      where: { id },
      data: updateData,
      include: {
        asset: { select: { id: true, name: true } },
        company: { select: { id: true, name: true } },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.transaction.delete({ where: { id } });
    return { message: 'Transaction deleted successfully', id };
  }

  // FIX 17: use totalAmount (not amount)
  async getStats(filters?: { startDate?: string; endDate?: string }) {
    const where: any = { status: 'COMPLETED' };
    if (filters?.startDate) where.date = { ...where.date, gte: new Date(filters.startDate) };
    if (filters?.endDate) where.date = { ...where.date, lte: new Date(filters.endDate) };

    const [total, revenue, commissions] = await Promise.all([
      this.prisma.transaction.count({ where }),
      this.prisma.transaction.aggregate({ where, _sum: { totalAmount: true } }),
      this.prisma.transaction.aggregate({ where, _sum: { totalCommission: true } }),
    ]);

    return {
      totalTransactions: total,
      totalRevenue: revenue._sum.totalAmount || 0,
      totalCommissions: commissions._sum.totalCommission || 0,
      avgDealSize: total > 0 ? (revenue._sum.totalAmount || 0) / total : 0,
    };
  }
}

function formatDeal(tx: any) {
  return {
    id: tx.id,
    leadName: tx.buyer?.name ?? tx.leadAgent?.user?.name ?? "",
    buyer: tx.buyer?.name ?? "",
    leadAgent: tx.leadAgent?.user?.name ?? "",
    closerAgent: tx.closerAgent?.user?.name ?? "",
    company: tx.company?.name ?? "",
    asset: tx.asset?.name ?? "",
    propertyValue: tx.totalAmount ? `₦${tx.totalAmount.toLocaleString()}` : "",
    amount: tx.totalAmount ?? 0,
    commission: tx.commission,
    totalCommission: tx.totalCommission ? `₦${tx.totalCommission.toLocaleString()}` : "",
    leadCommission: tx.leadCommission ? `₦${tx.leadCommission.toLocaleString()}` : "",
    closerCommission: tx.closerCommission ? `₦${tx.closerCommission.toLocaleString()}` : "",
    commissionType: tx.leadAgentId && tx.closerAgentId
      ? (tx.leadAgentId === tx.closerAgentId ? "split" : "lead")
      : "lead",
    status: tx.commissionPaymentStatus?.toLowerCase() ?? "unpaid",
    eligibility: tx.commissionPaymentStatus === "PAID" ? "Eligible" : "Not Eligible",
    payoutDate: tx.updatedAt?.toISOString().split("T")[0],
    date: tx.date?.toISOString().split("T")[0] ?? tx.updatedAt?.toISOString().split("T")[0],
    paymentType: tx.paymentType === "installment" ? "installment" : "full",
    paymentPlan: tx.paymentType === "installment"
      ? {
        type: "installment",
        numberOfInstallments: tx.installments?.length ?? 0,
      }
      : null,
    commissionBreakdown: (tx.installments ?? []).map((inst, idx) => ({
      installmentId: inst.id,
      installmentNumber: inst.installmentNumber ?? idx + 1,
      leadCommission: inst.leadCommission ?? 0,
      closerCommission: inst.closerCommission ?? 0,
      totalCommission: (inst.leadCommission ?? 0) + (inst.closerCommission ?? 0),
      status: inst.status === "PAID" ? "earned" : (inst.status === "PENDING" ? "pending" : "scheduled"),
      earnedDate: inst.paidDate ?? null,
    })),
  };
}
