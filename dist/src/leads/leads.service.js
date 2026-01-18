"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LeadsService = class LeadsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
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
    async findById(id) {
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
            throw new common_1.NotFoundException(`Lead with ID ${id} not found`);
        }
        return lead;
    }
    async create(data) {
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
    async update(id, data) {
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
    async assignLeads(data) {
        const { leadIds, assignmentType, clusterId } = data;
        const leads = await this.prisma.lead.findMany({
            where: {
                id: { in: leadIds },
            },
        });
        if (leads.length !== leadIds.length) {
            throw new common_1.NotFoundException("One or more leads not found");
        }
        if (assignmentType === "cluster" && clusterId) {
            const cluster = await this.prisma.cluster.findUnique({
                where: { id: clusterId },
            });
            if (!cluster) {
                throw new common_1.NotFoundException(`Cluster with ID ${clusterId} not found`);
            }
        }
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
        }
        else {
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
        const [totalLeads, pendingLeads, assignedLeads, availableLeads, convertedLeads, leadsBySource,] = await Promise.all([
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
    async getLeadsByCluster(clusterId) {
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
    async convertLead(leadId, transactionData) {
        const lead = await this.prisma.lead.update({
            where: { id: leadId },
            data: {
                status: "converted",
            },
        });
        return lead;
    }
    async bulkImportLeads(leads) {
        return this.prisma.lead.createMany({
            data: leads.map(lead => ({
                ...lead,
                status: "pending",
                dateReceived: new Date(),
            })),
            skipDuplicates: true,
        });
    }
    async getLeadHistory(leadId) {
        return this.findById(leadId);
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map