import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// FIX 25: No Sale/Product models — repurpose Sales as a Transaction view for sales roles
@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  // "My sales" = transactions where this user is the buyer
  async findByUser(userId: string) {
    return this.prisma.transaction.findMany({
      where: { buyerId: userId },
      include: {
        asset: { select: { id: true, name: true, type: true, finalPrice: true } },
        leadAgent: { include: { user: { select: { id: true, name: true } } } },
        closerAgent: { include: { user: { select: { id: true, name: true } } } },
        installments: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  // All completed transactions (admin view)
  async findAll() {
    return this.prisma.transaction.findMany({
      where: { status: 'COMPLETED' },
      include: {
        asset: { select: { id: true, name: true, type: true } },
        buyer: { select: { id: true, name: true, email: true } },
        company: { select: { id: true, name: true } },
        leadAgent: { include: { user: { select: { id: true, name: true } } } },
        closerAgent: { include: { user: { select: { id: true, name: true } } } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getSalesSummary() {
    const agg = await this.prisma.transaction.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { totalAmount: true, totalCommission: true },
      _count: true,
    });

    return {
      totalSales: agg._count,
      totalRevenue: agg._sum.totalAmount || 0,
      totalCommission: agg._sum.totalCommission || 0,
      avgDealSize: agg._count > 0 ? (agg._sum.totalAmount || 0) / agg._count : 0,
    };
  }
}
