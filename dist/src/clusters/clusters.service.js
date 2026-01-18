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
exports.ClustersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClustersService = class ClustersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.cluster.findMany({
            include: {
                agents: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                        role: true,
                        status: true,
                    },
                },
                freelancers: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        agents: true,
                        freelancers: true,
                        leads: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findById(id) {
        const cluster = await this.prisma.cluster.findUnique({
            where: { id },
            include: {
                agents: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                freelancers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                leads: {
                    take: 20,
                    orderBy: {
                        dateReceived: "desc",
                    },
                },
                _count: {
                    select: {
                        agents: true,
                        freelancers: true,
                        leads: true,
                    },
                },
            },
        });
        if (!cluster) {
            throw new common_1.NotFoundException(`Cluster with ID ${id} not found`);
        }
        return cluster;
    }
    async create(data) {
        const existingCluster = await this.prisma.cluster.findUnique({
            where: { code: data.code },
        });
        if (existingCluster) {
            throw new common_1.ConflictException(`Cluster with code ${data.code} already exists`);
        }
        return this.prisma.cluster.create({
            data: {
                name: data.name,
                code: data.code,
                teamLead: data.teamLead,
                location: data.location,
                status: data.status || "active",
                activeAssets: 0,
                totalCommission: 0,
            },
            include: {
                _count: {
                    select: {
                        agents: true,
                        freelancers: true,
                        leads: true,
                    },
                },
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        if (data.code) {
            const existingCluster = await this.prisma.cluster.findUnique({
                where: { code: data.code },
            });
            if (existingCluster && existingCluster.id !== id) {
                throw new common_1.ConflictException(`Cluster with code ${data.code} already exists`);
            }
        }
        return this.prisma.cluster.update({
            where: { id },
            data,
            include: {
                _count: {
                    select: {
                        agents: true,
                        freelancers: true,
                        leads: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        const activeAgentsCount = await this.prisma.agent.count({
            where: {
                clusterId: id,
                status: "active",
            },
        });
        if (activeAgentsCount > 0) {
            throw new Error(`Cannot delete cluster with ${activeAgentsCount} active agents. Please reassign agents first.`);
        }
        const pendingLeadsCount = await this.prisma.lead.count({
            where: {
                assignedCluster: id,
                status: "pending",
            },
        });
        if (pendingLeadsCount > 0) {
            throw new Error(`Cannot delete cluster with ${pendingLeadsCount} pending leads. Please reassign leads first.`);
        }
        return this.prisma.cluster.delete({
            where: { id },
        });
    }
    async getStats() {
        const [totalClusters, activeClusters, totalAgents, totalCommission,] = await Promise.all([
            this.prisma.cluster.count(),
            this.prisma.cluster.count({ where: { status: "active" } }),
            this.prisma.cluster.aggregate({
                _count: true,
            }).then(async () => {
                return this.prisma.agent.count();
            }),
            this.prisma.cluster.aggregate({
                _sum: {
                    totalCommission: true,
                },
            }),
        ]);
        return {
            totalClusters,
            activeClusters,
            totalAgents,
            totalCommission: totalCommission._sum.totalCommission || 0,
        };
    }
    async updateClusterStats(clusterId) {
        const agents = await this.prisma.agent.findMany({
            where: { clusterId },
            select: { totalCommission: true },
        });
        const totalCommission = agents.reduce((sum, agent) => sum + (agent.totalCommission || 0), 0);
        const activeAssets = await this.prisma.lead.count({
            where: {
                assignedCluster: clusterId,
                status: "assigned",
            },
        });
        return this.prisma.cluster.update({
            where: { id: clusterId },
            data: {
                totalCommission,
                activeAssets,
            },
        });
    }
    async getPerformanceMetrics(clusterId) {
        const cluster = await this.findById(clusterId);
        const transactions = await this.prisma.transaction.findMany({
            where: {
                OR: [
                    {
                        leadAgent: {
                            clusterId,
                        },
                    },
                    {
                        closerAgent: {
                            clusterId,
                        },
                    },
                ],
            },
            include: {
                asset: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        const completedTransactions = transactions.filter((t) => t.status === "completed");
        const totalRevenue = completedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalCommission = completedTransactions.reduce((sum, t) => sum + (t.totalCommission || 0), 0);
        return {
            cluster,
            metrics: {
                totalTransactions: transactions.length,
                completedTransactions: completedTransactions.length,
                totalRevenue,
                totalCommission,
                averageTransactionValue: completedTransactions.length > 0
                    ? totalRevenue / completedTransactions.length
                    : 0,
                conversionRate: transactions.length > 0
                    ? (completedTransactions.length / transactions.length) * 100
                    : 0,
            },
        };
    }
};
exports.ClustersService = ClustersService;
exports.ClustersService = ClustersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClustersService);
//# sourceMappingURL=clusters.service.js.map