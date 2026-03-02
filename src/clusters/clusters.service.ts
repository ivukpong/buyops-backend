import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateSerialId } from '../common/serial-id.helper';

@Injectable()
export class ClustersService {
  constructor(private prisma: PrismaService) { }

  private normalizeClusterStatus(status?: string): string {
    const normalized = (status || 'ACTIVE').toString().trim().toUpperCase();
    if (!['ACTIVE', 'INACTIVE', 'PENDING'].includes(normalized)) {
      throw new BadRequestException('Cluster status must be one of: ACTIVE, INACTIVE, PENDING');
    }
    return normalized.toLowerCase();
  }

  private async resolveManagerId(teamLead?: string): Promise<string | null> {
    if (!teamLead) return null;

    // Accept a User ID directly
    const user = await this.prisma.user.findUnique({
      where: { id: teamLead },
      select: { id: true },
    });
    if (user) return user.id;

    // Or accept an Agent ID and map to its userId
    const agent = await this.prisma.agent.findUnique({
      where: { id: teamLead },
      select: { userId: true },
    });
    if (agent?.userId) return agent.userId;

    throw new BadRequestException('Invalid teamLead: must be a valid User ID or Agent ID');
  }

  async findAll() {
    const clusters = await this.prisma.cluster.findMany({
      include: {
        manager: { select: { id: true, name: true, email: true } },
        agents: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
        freelancers: {
          include: { user: { select: { id: true, name: true } } },
        },
        _count: { select: { agents: true, freelancers: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map to frontend shape
    return await Promise.all(clusters.map(async (cluster) => {
      // Team lead is manager name
      const teamLead = cluster.manager?.name ?? "";
      // Agents count
      const agents = cluster._count.agents;
      // Active assets - count unique assets from transactions where agents from this cluster are involved
      const agentIds = cluster.agents.map(a => a.id);

      // Get unique asset IDs from transactions where cluster agents are lead or closer
      const transactions = await this.prisma.transaction.findMany({
        where: {
          OR: [
            { leadAgentId: { in: agentIds } },
            { closerAgentId: { in: agentIds } },
          ],
        },
        select: { assetId: true },
        distinct: ['assetId'],
      });

      const activeAssets = transactions.length;

      // Total commission (sum for all agents in cluster)
      const totalCommission = await this.prisma.agent.aggregate({
        where: { clusterId: cluster.id },
        _sum: { totalCommission: true },
      });

      return {
        id: cluster.id,
        serialId: cluster.serialId ?? "",
        name: cluster.name,
        teamLead,
        managerId: cluster.managerId,
        agents,
        activeAssets,
        totalCommission: totalCommission._sum.totalCommission || 0,
        status: cluster.status,
        location: cluster.location,
        code: cluster.code,
        commissionType: (cluster as any).commissionType ?? 'AGENT',
      };
    }));
  }

  async findById(id: string) {
    const cluster = await this.prisma.cluster.findUnique({
      where: { id },
      include: {
        manager: { select: { id: true, name: true, email: true } },
        agents: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            assignedLeads: true,
            leadTransactions: true,
            closerTransactions: true,
          },
        },
        freelancers: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    if (!cluster) throw new NotFoundException(`Cluster with ID ${id} not found`);
    return cluster;
  }

  async create(data: any) {
    if (!data.name) throw new BadRequestException('Cluster name is required');
    // Duplicate name check
    const existingByName = await this.prisma.cluster.findFirst({ where: { name: { equals: data.name.trim(), mode: 'insensitive' } } });
    if (existingByName) throw new ConflictException('A cluster with this name already exists');
    const managerId = await this.resolveManagerId(data.teamLead);
    const status = this.normalizeClusterStatus(data.status);
    const serialId = await generateSerialId(this.prisma, 'CLT');
    return this.prisma.cluster.create({
      data: {
        serialId,
        name: data.name,
        code: data.code || null,
        status,
        location: data.location || null,
        managerId,
        commissionType: data.commissionType || 'AGENT',
      },
      include: {
        manager: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, data: any) {
    await this.findById(id);
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.status !== undefined) updateData.status = this.normalizeClusterStatus(data.status);
    if (data.location !== undefined) updateData.location = data.location;
    if (data.teamLead !== undefined) updateData.managerId = await this.resolveManagerId(data.teamLead);
    if (data.commissionType !== undefined) updateData.commissionType = data.commissionType;
    return this.prisma.cluster.update({
      where: { id },
      data: updateData,
      include: { manager: { select: { id: true, name: true } } },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.cluster.delete({ where: { id } });
    return { message: 'Cluster deleted successfully', id };
  }

  async getStats() {
    const [total, active, agents, freelancers] = await Promise.all([
      this.prisma.cluster.count(),
      this.prisma.cluster.count({ where: { status: 'active' } }),
      this.prisma.user.count({ where: { role: 'AGENT' } }),
      this.prisma.freelancer.count(),
    ]);

    return { totalClusters: total, activeClusters: active, totalAgents: agents, totalFreelancers: freelancers };
  }
}
