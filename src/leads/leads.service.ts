import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LeadsService {
    constructor(private prisma: PrismaService) { }

    async findAll(filters?: { source?: string; status?: string }) {
        const where: any = {};

        if (filters?.source && filters.source !== "all") {
            where.leadSource = filters.source;
        }

        if (filters?.status && filters.status !== "all") {
            where.status = filters.status;
        }

        return this.prisma.lead.findMany({
            where,
            include: {
                asset: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                    },
                },
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                dateReceived: "desc",
            },
        });
    }

    async findById(id: string) {
        const lead = await this.prisma.lead.findUnique({
            where: { id },
            include: {
                asset: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                cluster: true,
            },
        });

        if (!lead) {
            throw new NotFoundException(`Lead with ID ${id} not found`);
        }

        return lead;
    }

    async create(data: {
        name: string;
        email: string;
        phone: string;
        assetInterest: string;
        budget: number;
        source: string;
        leadSource: string;
        createdBy?: string;
    }) {
        return this.prisma.lead.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                assetInterest: data.assetInterest,
                budget: data.budget,
                source: data.source,
                leadSource: data.leadSource,
                createdBy: data.createdBy,
                status: "pending",
                dateReceived: new Date(),
            },
            include: {
                creator: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async update(id: string, data: any) {
        // Check if lead exists
        await this.findById(id);

        return this.prisma.lead.update({
            where: { id },
            data,
            include: {
                asset: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async assignLeads(data: {
        leadIds: string[];
        assignmentType: "cluster" | "all";
        clusterId?: string;
    }) {
        const { leadIds, assignmentType, clusterId } = data;

        // Verify all leads exist
        const leads = await this.prisma.lead.findMany({
            where: {
                id: { in: leadIds },
            },
        });

        if (leads.length !== leadIds.length) {
            throw new NotFoundException("One or more leads not found");
        }

        // Verify cluster exists if assigning to specific cluster
        if (assignmentType === "cluster" && clusterId) {
            const cluster = await this.prisma.cluster.findUnique({
                where: { id: clusterId },
            });

            if (!cluster) {
                throw new NotFoundException(`Cluster with ID ${clusterId} not found`);
            }
        }

        // Update leads
        if (assignmentType === "all") {
            return this.prisma.lead.updateMany({
                where: {
                    id: { in: leadIds },
                },
                data: {
                    status: "available",
                    assignedTo: "All Clusters",
                    assignedCluster: null,
                },
            });
        } else {
            const cluster = await this.prisma.cluster.findUnique({
                where: { id: clusterId },
            });

            return this.prisma.lead.updateMany({
                where: {
                    id: { in: leadIds },
                },
                data: {
                    status: "assigned",
                    assignedTo: cluster?.name || null,
                    assignedCluster: clusterId,
                },
            });
        }
    }

    async getStats() {
        const [
            totalLeads,
            pendingLeads,
            assignedLeads,
            availableLeads,
            convertedLeads,
            leadsBySource,
        ] = await Promise.all([
            this.prisma.lead.count(),
            this.prisma.lead.count({ where: { status: "pending" } }),
            this.prisma.lead.count({ where: { status: "assigned" } }),
            this.prisma.lead.count({ where: { status: "available" } }),
            this.prisma.lead.count({ where: { status: "converted" } }),
            this.prisma.lead.groupBy({
                by: ["leadSource"],
                _count: true,
            }),
        ]);

        const conversionRate = totalLeads > 0
            ? (convertedLeads / totalLeads) * 100
            : 0;

        return {
            totalLeads,
            pendingLeads,
            assignedLeads,
            availableLeads,
            convertedLeads,
            conversionRate: conversionRate.toFixed(2),
            leadsBySource,
        };
    }

    async getLeadsByCluster(clusterId: string) {
        return this.prisma.lead.findMany({
            where: {
                assignedCluster: clusterId,
            },
            include: {
                asset: {
                    select: {
                        name: true,
                        location: true,
                    },
                },
            },
            orderBy: {
                dateReceived: "desc",
            },
        });
    }

    async convertLead(leadId: string, transactionData: any) {
        // Update lead status
        const lead = await this.prisma.lead.update({
            where: { id: leadId },
            data: {
                status: "converted",
            },
        });

        // Create transaction
        // This would typically be called from the transactions service
        return lead;
    }

    async bulkImportLeads(leads: any[]) {
        return this.prisma.lead.createMany({
            data: leads.map(lead => ({
                ...lead,
                status: "pending",
                dateReceived: new Date(),
            })),
            skipDuplicates: true,
        });
    }

    async getLeadHistory(leadId: string) {
        // This would track status changes, assignments, etc.
        // For now, return basic lead info
        return this.findById(leadId);
    }
}