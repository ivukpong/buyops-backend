import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ClustersService {
    constructor(private prisma: PrismaService) { }

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

    async findById(id: string) {
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
            throw new NotFoundException(`Cluster with ID ${id} not found`);
        }

        return cluster;
    }

    async create(data: {
        name: string;
        code: string;
        teamLead: string;
        location: string;
        status: string;
    }) {
        // Check if code already exists
        const existingCluster = await this.prisma.cluster.findUnique({
            where: { code: data.code },
        });

        if (existingCluster) {
            throw new ConflictException(`Cluster with code ${data.code} already exists`);
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

    async update(id: string, data: any) {
        // Check if cluster exists
        await this.findById(id);

        // Check if code is being changed and if new code exists
        if (data.code) {
            const existingCluster = await this.prisma.cluster.findUnique({
                where: { code: data.code },
            });

            if (existingCluster && existingCluster.id !== id) {
                throw new ConflictException(`Cluster with code ${data.code} already exists`);
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

    async delete(id: string) {
        // Check if cluster exists
        await this.findById(id);

        // Check if cluster has active agents
        const activeAgentsCount = await this.prisma.agent.count({
            where: {
                clusterId: id,
                status: "active",
            },
        });

        if (activeAgentsCount > 0) {
            throw new Error(
                `Cannot delete cluster with ${activeAgentsCount} active agents. Please reassign agents first.`
            );
        }

        // Check if cluster has pending leads
        const pendingLeadsCount = await this.prisma.lead.count({
            where: {
                assignedCluster: id,
                status: "pending",
            },
        });

        if (pendingLeadsCount > 0) {
            throw new Error(
                `Cannot delete cluster with ${pendingLeadsCount} pending leads. Please reassign leads first.`
            );
        }

        return this.prisma.cluster.delete({
            where: { id },
        });
    }

    async getStats() {
        const [
            totalClusters,
            activeClusters,
            totalAgents,
            totalCommission,
        ] = await Promise.all([
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

    async updateClusterStats(clusterId: string) {
        // Calculate total commission from all agents in cluster
        const agents = await this.prisma.agent.findMany({
            where: { clusterId },
            select: { totalCommission: true },
        });

        const totalCommission = agents.reduce(
            (sum: number, agent: { totalCommission: number }) => sum + (agent.totalCommission || 0),
            0
        );

        // Count active assets assigned to leads in this cluster
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

    async getPerformanceMetrics(clusterId: string) {
        const cluster = await this.findById(clusterId);

        // Get transactions from agents in this cluster
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

        const completedTransactions = transactions.filter((t: any) => t.status === "completed");
        const totalRevenue = completedTransactions.reduce((sum: number, t: { amount: number }) => sum + (t.amount || 0), 0);
        const totalCommission = completedTransactions.reduce((sum: number, t: { totalCommission: number }) => sum + (t.totalCommission || 0), 0);

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
}