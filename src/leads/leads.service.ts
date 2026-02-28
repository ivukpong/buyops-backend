import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { generateSerialId } from '../common/serial-id.helper';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) { }

  // Assign leads to a cluster or all
  async assignLeads(dto: { leadIds: string[]; assignmentType: 'cluster' | 'all'; clusterId?: string }) {
    if (dto.assignmentType === 'all') {
      // Make leads available to all clusters
      await this.prisma.lead.updateMany({
        where: { id: { in: dto.leadIds } },
        data: { status: 'available', assignedCluster: null, assignedToId: null },
      });

      await this.notificationService.notifyLeadAvailableToAll(dto.leadIds);
    } else if (dto.assignmentType === 'cluster' && dto.clusterId) {
      // Assign leads to a specific cluster
      await this.prisma.lead.updateMany({
        where: { id: { in: dto.leadIds } },
        data: { status: 'assigned', assignedCluster: dto.clusterId },
      });

      await this.notificationService.notifyLeadAssignedToCluster(dto.leadIds, dto.clusterId);
    } else {
      throw new BadRequestException('Invalid assignment type or missing clusterId');
    }
    return { message: 'Leads assigned', ...dto };
  }

  async findAll(filters?: { status?: string; assetId?: string; assignedToId?: string; source?: string }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.assetId) where.assetId = filters.assetId;
    if (filters?.assignedToId) where.assignedToId = filters.assignedToId;
    if (filters?.source) where.source = filters.source;

    return this.prisma.lead.findMany({
      where,
      include: {
        asset: { select: { id: true, name: true, type: true, location: true } },
        assignedTo: { include: { user: { select: { id: true, name: true } } } },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        asset: true,
        assignedTo: { include: { user: true, cluster: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!lead) throw new NotFoundException(`Lead with ID ${id} not found`);
    return lead;
  }

  async create(data: any, createdById: string) {
    if (!data.name) throw new BadRequestException('Lead name is required');
    if (!data.email) throw new BadRequestException('Email is required');

    const serialId = await generateSerialId(this.prisma, 'LED');
    const createdLead = await this.prisma.lead.create({
      data: {
        serialId,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        assetInterest: data.assetInterest || null,
        budget: data.budget ? parseFloat(data.budget) : null,
        source: data.source || null,
        leadSource: data.leadSource || "investor-app",
        location: data.location || null,
        notes: data.notes || null,
        status: data.status || "pending",
        assignedToId: data.assignedToId || null,
        assignedCluster: data.assignedCluster || null,
        createdById,
        dateReceived: data.dateReceived ? new Date(data.dateReceived) : new Date(),
      },
      include: {
        asset: { select: { id: true, name: true } },
        assignedTo: { include: { user: { select: { id: true, name: true } } } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    const source = String(createdLead.leadSource || createdLead.source || '').toLowerCase();
    if (source.includes('investor')) {
      await this.notificationService.notifyNewLeadFromInvestor(createdLead.id);
    }

    return createdLead;
  }

  async update(id: string, data: any) {
    await this.findById(id);

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.budget !== undefined) updateData.budget = parseFloat(data.budget);
    if (data.source !== undefined) updateData.source = data.source;
    if (data.leadSource !== undefined) updateData.leadSource = data.leadSource;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.assetInterest !== undefined) updateData.assetInterest = data.assetInterest;
    if (data.assignedToId !== undefined) updateData.assignedToId = data.assignedToId;
    if (data.assignedCluster !== undefined) updateData.assignedCluster = data.assignedCluster;

    return this.prisma.lead.update({
      where: { id },
      data: updateData,
      include: {
        asset: { select: { id: true, name: true } },
        assignedTo: { include: { user: { select: { id: true, name: true } } } },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.lead.delete({ where: { id } });
    return { message: 'Lead deleted successfully', id };
  }

  async getStats() {
    const [total, byStatus] = await Promise.all([
      this.prisma.lead.count(),
      this.prisma.lead.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    return {
      total,
      byStatus: byStatus.map((s: any) => ({ status: s.status, count: s._count })),
    };
  }

  async assignSingleLead(leadId: string, dto: { assignedToId?: string; clusterId?: string }) {
    if (!leadId) throw new BadRequestException('Missing leadId');
    const updateData: any = {};
    if (dto.assignedToId) {
      updateData.assignedToId = dto.assignedToId;
      updateData.status = 'assigned';
    }
    if (dto.clusterId) {
      updateData.assignedCluster = dto.clusterId;
      updateData.status = 'assigned';
    }
    if (!updateData.assignedToId && !updateData.assignedCluster) {
      throw new BadRequestException('Must provide assignedToId or clusterId');
    }
    const lead = await this.prisma.lead.update({
      where: { id: leadId },
      data: updateData,
    });
    if (dto.clusterId) {
      await this.notificationService.notifyLeadAssignedToCluster([leadId], dto.clusterId);
    }
    return { message: 'Lead assigned', lead };
  }

  async updateLeadStatus(id: string, status: string) {
    if (!id) throw new BadRequestException('Missing leadId');
    if (!status) throw new BadRequestException('Missing status');
    const lead = await this.prisma.lead.update({
      where: { id },
      data: { status },
    });
    return { message: 'Lead status updated', lead };
  }
}
