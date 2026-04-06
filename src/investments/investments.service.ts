import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateSerialId } from '../common/serial-id.helper';

// FIX 26: No Investment model — repurpose as a view of transactions for investors
@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) { }

  async findByUser(userId: string) {
    try {
      return this.prisma.transaction.findMany({
        where: { buyerId: userId },
        include: {
          asset: { select: { id: true, name: true, type: true, location: true, images: true } },
          company: { select: { id: true, name: true } },
          installments: { orderBy: { dueDate: 'asc' } },
          installmentPlans: true,
        },
        orderBy: { date: 'desc' },
      });
    } catch (error) {
      return this.prisma.transaction.findMany({
        where: { buyerId: userId },
        include: {
          asset: { select: { id: true, name: true, type: true, location: true, images: true } },
          company: { select: { id: true, name: true } },
        },
        orderBy: { date: 'desc' },
      });
    }
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

  /**
   * Called by the investor mobile app after a successful payment is verified.
   * Creates a minimal self-service transaction record. Commission fields are
   * zeroed out because investor purchases originate directly (no agent involved).
   */
  async createInvestorPurchase(
    userId: string,
    data: { amount: number; note?: string; assetId?: string },
  ) {
    if (!data.amount || data.amount <= 0) {
      throw new BadRequestException('Amount must be a positive number.');
    }
    if (!data.assetId) {
      throw new BadRequestException('assetId is required to record an investment.');
    }

    const serialId = await generateSerialId(this.prisma, 'TRN');

    const transaction = await this.prisma.transaction.create({
      data: {
        serialId,
        buyerId: userId,
        assetId: data.assetId,
        totalAmount: data.amount,
        paymentType: 'OUTRIGHT',
        leadCommission: 0,
        closerCommission: 0,
        totalCommission: 0,
        ownershipType: 'Full',
      },
      include: {
        asset: { select: { id: true, name: true, type: true, location: true } },
      },
    });

    // Decrement available units and mark as sold if none remain
    const asset = await this.prisma.asset.findUnique({
      where: { id: data.assetId },
      select: { availableUnits: true },
    });
    if (asset?.availableUnits != null && asset.availableUnits > 0) {
      const newUnits = asset.availableUnits - 1;
      await this.prisma.asset.update({
        where: { id: data.assetId },
        data: {
          availableUnits: newUnits,
          ...(newUnits === 0 && { status: 'sold' }),
        },
      });
    }

    return transaction;
  }
}
