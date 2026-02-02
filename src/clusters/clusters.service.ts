import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClustersService {
  constructor(private prisma: PrismaService) {}

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
      // Active assets (sum of assets for all agents in cluster)
      const agentIds = cluster.agents.map(a => a.id);
      const activeAssets = await this.prisma.asset.count({
        where: {
          status: { in: ['published', 'active'] },
          companyId: cluster.companyId, // or use the correct companyId
        },
      });
      // Total commission (sum for all agents in cluster)
      const totalCommission = await this.prisma.agent.aggregate({
        where: { clusterId: cluster.id },
        _sum: { totalCommission: true },
      });

      return {
        id: cluster.id,
        name: cluster.name,
        teamLead,
        agents,
        activeAssets,
        totalCommission: totalCommission._sum.totalCommission || 0,
        status: cluster.status,
        location: cluster.location,
        code: cluster.code,
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
    return this.prisma.cluster.create({
      data: {
        name: data.name,
        code: data.code || null,
        status: data.status || 'active',
        location: data.location || null,
        managerId: data.teamLead || null, // teamLead is managerId
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
    if (data.status !== undefined) updateData.status = data.status;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.teamLead !== undefined) updateData.managerId = data.teamLead;
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
      this.prisma.agent.count(),
      this.prisma.freelancer.count(),
    ]);

    return { totalClusters: total, activeClusters: active, totalAgents: agents, totalFreelancers: freelancers };
  }
}

