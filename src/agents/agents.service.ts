import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  // FIX 22: use assignedLeads / leadTransactions / closerTransactions (not leadsAsLead/leadsAsCloser)
  async findAll() {
    const agents = await this.prisma.agent.findMany({
      include: {
        user: { select: { id: true, email: true, name: true, phone: true, role: true } },
        cluster: { select: { id: true, name: true } },
        _count: { select: { leadTransactions: true } },
      },
      orderBy: { status: 'asc' },
    });

    // Map to frontend shape
    return agents.map(agent => ({
      id: agent.id,
      name: agent.user?.name ?? "",
      email: agent.user?.email ?? "",
      phone: agent.user?.phone ?? "",
      cluster: agent.cluster?.name ?? "",
      clusterId: agent.cluster?.id ?? "",
      role: agent.user?.role ?? "AGENT",
      status: agent.status?.toLowerCase() ?? "pending",
      activeDeals: agent._count.leadTransactions,
      closedDeals: agent.closedDeals,
      totalCommission: agent.totalCommission,
      performance: agent.closedDeals > 0 ? Math.min(100, Math.round((agent.closedDeals / 10) * 100)) : 0, // Example logic
    }));
  }

  async findById(id: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        cluster: true,
        assignedLeads: { orderBy: { createdAt: 'desc' }, take: 10 },
        leadTransactions: { orderBy: { date: 'desc' }, take: 10 },
        closerTransactions: { orderBy: { date: 'desc' }, take: 10 },
        commissions: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!agent) throw new NotFoundException(`Agent with ID ${id} not found`);
    return agent;
  }

  // FIX 21: only pass fields that exist on Agent model
  async create(data: { name: string; email: string; phone?: string; cluster?: string; role?: string; status?: string }) {
    if (!data.name) throw new BadRequestException('Name is required');
    if (!data.email) throw new BadRequestException('Email is required');

    // Check if user exists
    let user = await this.prisma.user.findUnique({ where: { email: data.email } });

    if (user) {
      // Verify not already an agent
      const existing = await this.prisma.agent.findUnique({ where: { userId: user.id } });
      if (existing) throw new ConflictException('User is already registered as an agent');
      // Update user info if needed
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: data.name,
          phone: data.phone,
          role: (data.role ? UserRole[data.role.toUpperCase() as keyof typeof UserRole] : UserRole.AGENT),
        },
      });
    } else {
      // Create user with default password
      const hashedPassword = await bcrypt.hash('password123', 10);
      user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phone: data.phone,
          role: (data.role ? UserRole[data.role.toUpperCase() as keyof typeof UserRole] : UserRole.AGENT),
        },
      });
    }

    return this.prisma.agent.create({
      data: {
        userId: user.id,
        clusterId: data.cluster || null,
        status: (data.status as any) || 'PENDING',
        closedDeals: 0,
        totalCommission: 0,
      },
      include: {
        user: { select: { id: true, email: true, name: true, phone: true, role: true } },
        cluster: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, data: any) {
    const agent = await this.findById(id);

    // Update user info if provided
    if (data.name || data.email || data.phone || data.role) {
      await this.prisma.user.update({
        where: { id: agent.userId },
        data: {
          ...(data.name ? { name: data.name } : {}),
          ...(data.email ? { email: data.email } : {}),
          ...(data.phone ? { phone: data.phone } : {}),
          ...(data.role ? { role: data.role.toUpperCase() } : {}),
        },
      });
    }

    const updateData: any = {};
    if (data.cluster !== undefined) updateData.clusterId = data.cluster;
    if (data.status !== undefined) updateData.status = data.status;

    return this.prisma.agent.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, email: true, name: true, phone: true, role: true } },
        cluster: { select: { id: true, name: true } },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.agent.delete({ where: { id } });
    return { message: 'Agent deleted successfully', id };
  }

  async getStats() {
    const [total, active, pending] = await Promise.all([
      this.prisma.agent.count(),
      this.prisma.agent.count({ where: { status: 'ACTIVE' } }),
      this.prisma.agent.count({ where: { status: 'PENDING' } }),
    ]);

    const commissionAgg = await this.prisma.agent.aggregate({ _sum: { totalCommission: true, closedDeals: true } });

    return {
      totalAgents: total,
      activeAgents: active,
      pendingAgents: pending,
      totalClosedDeals: commissionAgg._sum.closedDeals || 0,
      totalCommission: commissionAgg._sum.totalCommission || 0,
    };
  }
}
