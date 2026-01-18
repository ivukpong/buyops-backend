// src/sales/sales.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, data: { productId: string; quantity: number; total: number }) {
    return this.prisma.sale.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        total: data.total,
        userId,
      },
    });
  }

  // src/sales/sales.service.ts
  async findByUser(userId: string) {
    return this.prisma.sale.findMany({
      where: { userId },
      include: { product: true },     // ← must exist in schema
    });
  }

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        product: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });
  }
}