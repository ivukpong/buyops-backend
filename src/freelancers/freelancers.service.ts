import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class FreelancersService {
  constructor(private prisma: PrismaService) { }

  // FIX 24: orderBy createdAt now valid (field added to schema)
  async findAll() {
    const freelancers = await this.prisma.freelancer.findMany({
      include: {
        user: { select: { id: true, email: true, name: true } },
        cluster: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return freelancers.map(freelancer => ({
      id: freelancer.id,
      name: freelancer.user?.name ?? "",
      email: freelancer.user?.email ?? "",
      registeredBy: freelancer.registeredBy ?? "",
      registrarName: freelancer.registrarName ?? "",
      registrarType: freelancer.registrarType ?? "",
      cluster: freelancer.cluster?.name ?? "",
      clusterId: freelancer.cluster?.id ?? "",
      activeDeals: freelancer.activeDeals ?? 0,
      closedDeals: freelancer.closedDeals ?? 0,
      totalCommission: freelancer.totalCommission ?? 0,
      performance: freelancer.closedDeals > 0 ? Math.min(100, Math.round((freelancer.closedDeals / 10) * 100)) : 0, // Example logic
      status: freelancer.status?.toLowerCase() ?? "pending",
    }));
  }

  async findById(id: string) {
    const freelancer = await this.prisma.freelancer.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        cluster: true,
      },
    });

    if (!freelancer) throw new NotFoundException(`Freelancer with ID ${id} not found`);
    return freelancer;
  }

  // FIX 23: registeredBy/registrarName/registrarType now exist in schema
  async create(data: {
    name: string;
    email: string;
    phone?: string;
    registeredBy?: string;
    registrarName?: string;
    registrarType?: string;
    cluster?: string;
    status?: string;
  }) {
    let user = await this.prisma.user.findUnique({ where: { email: data.email } });

    if (user) {
      const existing = await this.prisma.freelancer.findUnique({ where: { userId: user.id } });
      if (existing) throw new ConflictException('User is already registered as a freelancer');
    } else {
      const hashedPassword = await bcrypt.hash('password123', 10);
      user = await this.prisma.user.create({
        data: { email: data.email, password: hashedPassword, name: data.name, role: 'FREELANCER' },
      });
    }

    return this.prisma.freelancer.create({
      data: {
        userId: user.id,
        clusterId: data.cluster || null,
        status: data.status ? (data.status.toUpperCase() as any) : 'PENDING',
        registeredBy: data.registeredBy || null,
        registrarName: data.registrarName || null,
        registrarType: data.registrarType || null,
        activeDeals: 0,
        closedDeals: 0,
        totalCommission: 0,
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
        cluster: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, data: any) {
    const freelancer = await this.findById(id);

    if (data.name || data.email) {
      await this.prisma.user.update({
        where: { id: freelancer.userId },
        data: {
          ...(data.name ? { name: data.name } : {}),
          ...(data.email ? { email: data.email } : {}),
        },
      });
    }

    const updateData: any = {};
    if (data.cluster) updateData.clusterId = data.cluster;
    if (data.status) updateData.status = data.status.toUpperCase();
    if (data.registeredBy !== undefined) updateData.registeredBy = data.registeredBy;
    if (data.registrarName !== undefined) updateData.registrarName = data.registrarName;
    if (data.registrarType !== undefined) updateData.registrarType = data.registrarType;

    return this.prisma.freelancer.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, email: true, name: true } },
        cluster: { select: { id: true, name: true } },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.freelancer.delete({ where: { id } });
    return { message: 'Freelancer deleted successfully', id };
  }

  async getStats() {
    const [total, active, agg] = await Promise.all([
      this.prisma.freelancer.count(),
      this.prisma.freelancer.count({ where: { status: 'ACTIVE' } }),
      this.prisma.freelancer.aggregate({
        _sum: { totalCommission: true, activeDeals: true, closedDeals: true },
      }),
    ]);

    return {
      totalFreelancers: total,
      activeFreelancers: active,
      totalActiveDeals: agg._sum.activeDeals || 0,
      totalClosedDeals: agg._sum.closedDeals || 0,
      totalCommission: agg._sum.totalCommission || 0,
    };
  }

  async getFreelancersByRegistrar(registrarId: string) {
    return this.prisma.freelancer.findMany({
      where: { registeredBy: registrarId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        cluster: { select: { id: true, name: true } },
      },
    });
  }
}
