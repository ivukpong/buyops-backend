import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// FIX 26: No Investment model — repurpose as a view of transactions for investors
@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.transaction.findMany({
      where: { buyerId: userId },
      include: {
        asset: { select: { id: true, name: true, type: true, finalPrice: true, location: true } },
        company: { select: { id: true, name: true } },
        installments: { orderBy: { dueDate: 'asc' } },
        installmentPlans: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.transaction.findMany({
      include: {
        asset: { select: { id: true, name: true, type: true } },
        buyer: { select: { id: true, name: true, email: true } },
        company: { select: { id: true, name: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getInvestmentSummary(userId: string) {
    const agg = await this.prisma.transaction.aggregate({
      where: { buyerId: userId },
      _sum: { totalAmount: true },
      _count: true,
    });

    return {
      totalInvestments: agg._count,
      totalInvested: agg._sum.totalAmount || 0,
    };
  }
}
