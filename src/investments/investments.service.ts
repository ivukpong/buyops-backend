// src/investments/investments.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, data: { amount: number; note?: string }) {
    return this.prisma.investment.create({
      data: {
        amount: data.amount,
        note: data.note,
        userId,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.investment.findMany({ where: { userId } });
  }

  async findAll() {
    return this.prisma.investment.findMany();
  }
}