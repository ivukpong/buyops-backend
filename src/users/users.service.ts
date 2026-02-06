import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll({ role, status, search }: { role?: string; status?: string; search?: string } = {}) {
    // Only filter by role if it's a valid UserRole
    let where: any = {};
    if (role && Object.values(UserRole).includes(role as UserRole)) {
      where.role = role as UserRole;
    }
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    return this.prisma.user.findMany({
      where,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  // FIX 10: use assignedLeads / closerTransactions / leadTransactions (not leadsAsLead/leadsAsCloser)
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        agentProfile: {
          include: {
            cluster: true,
            assignedLeads: true,
            leadTransactions: true,
            closerTransactions: true,
          },
        },
        freelancerProfile: {
          include: { cluster: true },
        },
        notifications: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // FIX 11: removed asset.referenceCode from select (it now exists in schema, so this is fine; but keep it safe)
  async getUserTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: { buyerId: userId },
      include: {
        asset: {
          select: { id: true, name: true, type: true, location: true },
        },
        leadAgent: { include: { user: { select: { id: true, name: true } } } },
        closerAgent: { include: { user: { select: { id: true, name: true } } } },
        installments: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  // FIX 12: use totalAmount (not amount) for _sum aggregation
  async getUserStats(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === 'AGENT') {
      const agent = await this.prisma.agent.findUnique({ where: { userId } });
      if (!agent) return { closedDeals: 0, totalCommission: 0, assignedLeads: 0 };

      const [leadCount, leadTxCount, closerTxCount] = await Promise.all([
        this.prisma.lead.count({ where: { assignedToId: agent.id } }),
        this.prisma.transaction.count({ where: { leadAgentId: agent.id, status: 'COMPLETED' } }),
        this.prisma.transaction.count({ where: { closerAgentId: agent.id, status: 'COMPLETED' } }),
      ]);

      return {
        assignedLeads: leadCount,
        closedDeals: leadTxCount + closerTxCount,
        totalCommission: agent.totalCommission,
      };
    }

    if (user.role === 'INVESTOR') {
      const stats = await this.prisma.transaction.aggregate({
        where: { buyerId: userId },
        _sum: { totalAmount: true },
        _count: true,
      });

      return {
        totalInvested: stats._sum.totalAmount || 0,
        totalTransactions: stats._count,
      };
    }

    // Default / ADMIN
    const [totalUsers, totalTransactions, revenueAgg] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.transaction.count({ where: { status: 'COMPLETED' } }),
      this.prisma.transaction.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      totalUsers,
      totalTransactions,
      totalRevenue: revenueAgg._sum.totalAmount || 0,
    };
  }

  async updateUser(id: string, dto: any) {
    // Update user profile
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getUserActivity(id: string, limit: number) {
    // Return last N notifications as user activity
    return this.prisma.notification.findMany({ where: { userId: id }, take: limit, orderBy: { createdAt: 'desc' } });
  }

  async getUserLeads(id: string) {
    // Example: return leads assigned to user
    return this.prisma.lead.findMany({ where: { assignedToId: id } });
  }

  async createUser(dto: any) {
    // Create new user
    // Ensure status is present and valid
    if (!dto.status || !['ACTIVE', 'INACTIVE', 'PENDING'].includes(dto.status.toUpperCase())) {
      throw new Error('User status is required and must be one of: ACTIVE, INACTIVE, PENDING');
    }
    return this.prisma.user.create({ data: { ...dto, status: dto.status.toUpperCase() } });
  }

  async updateUserRole(id: string, role: string) {
    // Only update if role is valid
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new Error('Invalid role');
    }
    return this.prisma.user.update({ where: { id }, data: { role: role as UserRole } });
  }

  async updateUserPassword(id: string, newPassword: string) {
    // Example: update password field
    return this.prisma.user.update({ where: { id }, data: { password: newPassword } });
  }

  async deactivateUser(id: string) {
    // No status field on User, consider soft delete or throw error
    throw new Error('User model does not have a status field');
  }

  async reactivateUser(id: string) {
    // No status field on User, consider soft delete or throw error
    throw new Error('User model does not have a status field');
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async getUsersByRole(role: string) {
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new Error('Invalid role');
    }
    return this.prisma.user.findMany({ where: { role: role as UserRole } });
  }

  async getUserDashboard(id: string) {
    // Example: return dashboard data for user
    return { userId: id, dashboard: 'stub' };
  }

  async getAllAgents() {
    return this.prisma.user.findMany({ where: { role: UserRole.AGENT } });
  }

  async getAllInvestors() {
    return this.prisma.user.findMany({ where: { role: UserRole.INVESTOR } });
  }

  async searchUsers(query: string, role?: string) {
    let where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    };
    if (role && Object.values(UserRole).includes(role as UserRole)) {
      where.role = role as UserRole;
    }
    return this.prisma.user.findMany({ where });
  }

  async getUserCountByRole() {
    // Example: group by role and count
    return this.prisma.user.groupBy({ by: ['role'], _count: { role: true } });
  }

  async bulkCreateUsers(users: any[]) {
    // Example: bulk create users
    return this.prisma.user.createMany({ data: users });
  }

  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
