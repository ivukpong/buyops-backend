import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AgentsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.agent.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        leadsAsLead: true,
                        leadsAsCloser: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findById(id: string) {
        const agent = await this.prisma.agent.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                cluster: true,
                leadsAsLead: {
                    take: 10,
                    orderBy: { date: "desc" },
                    include: {
                        asset: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                leadsAsCloser: {
                    take: 10,
                    orderBy: { date: "desc" },
                    include: {
                        asset: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!agent) {
            throw new NotFoundException(`Agent with ID ${id} not found`);
        }

        return agent;
    }

    async create(data: {
        name: string;
        email: string;
        phone: string;
        cluster: string;
        role: string;
        status: string;
    }) {
        // Check if user with this email exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            // Check if user is already an agent
            const existingAgent = await this.prisma.agent.findUnique({
                where: { userId: existingUser.id },
            });

            if (existingAgent) {
                throw new ConflictException("User is already registered as an agent");
            }
        }

        // Create user if doesn't exist
        let user;
        if (existingUser) {
            user = existingUser;
        } else {
            const hashedPassword = await bcrypt.hash("password123", 10); // Default password
            user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                    role: "SALES",
                },
            });
        }

        // Create agent profile
        const agent = await this.prisma.agent.create({
            data: {
                userId: user.id,
                clusterId: data.cluster,
                role: data.role,
                status: data.status || "active",
                activeDeals: 0,
                closedDeals: 0,
                totalCommission: 0,
                performance: 0,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
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

        return agent;
    }

    async update(id: string, data: any) {
        // Check if agent exists
        const agent = await this.findById(id);

        // Update user info if provided
        if (data.name || data.email) {
            await this.prisma.user.update({
                where: { id: agent.userId },
                data: {
                    name: data.name,
                    email: data.email,
                },
            });
        }

        // Update agent profile
        const updateData: any = {};
        if (data.cluster) updateData.clusterId = data.cluster;
        if (data.role) updateData.role = data.role;
        if (data.status) updateData.status = data.status;

        return this.prisma.agent.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
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

    async delete(id: string) {
        // Check if agent exists
        const agent = await this.findById(id);

        // Check if agent has active deals
        const activeDealsCount = await this.prisma.transaction.count({
            where: {
                OR: [
                    { leadAgentId: id },
                    { closerAgentId: id },
                ],
                status: "pending",
            },
        });

        if (activeDealsCount > 0) {
            throw new Error(
                `Cannot delete agent with ${activeDealsCount} active deals. Please reassign or complete deals first.`
            );
        }

        // Delete agent profile (user remains)
        return this.prisma.agent.delete({
            where: { id },
        });
    }

    async getStats() {
        const [
            totalAgents,
            activeAgents,
            totalDeals,
            totalCommission,
        ] = await Promise.all([
            this.prisma.agent.count(),
            this.prisma.agent.count({ where: { status: "active" } }),
            this.prisma.agent.aggregate({
                _sum: {
                    activeDeals: true,
                    closedDeals: true,
                },
            }),
            this.prisma.agent.aggregate({
                _sum: {
                    totalCommission: true,
                },
            }),
        ]);

        return {
            totalAgents,
            activeAgents,
            totalActiveDeals: totalDeals._sum.activeDeals || 0,
            totalClosedDeals: totalDeals._sum.closedDeals || 0,
            totalCommission: totalCommission._sum.totalCommission || 0,
        };
    }

    async updateAgentStats(agentId: string) {
        const [activeDeals, closedDeals, totalCommission] = await Promise.all([
            this.prisma.transaction.count({
                where: {
                    OR: [
                        { leadAgentId: agentId },
                        { closerAgentId: agentId },
                    ],
                    status: "pending",
                },
            }),
            this.prisma.transaction.count({
                where: {
                    OR: [
                        { leadAgentId: agentId },
                        { closerAgentId: agentId },
                    ],
                    status: "completed",
                },
            }),
            this.prisma.transaction.aggregate({
                where: {
                    OR: [
                        { leadAgentId: agentId },
                        { closerAgentId: agentId },
                    ],
                    status: "completed",
                },
                _sum: {
                    leadCommission: true,
                    closerCommission: true,
                },
            }),
        ]);

        const commission =
            (totalCommission._sum.leadCommission || 0) +
            (totalCommission._sum.closerCommission || 0);

        return this.prisma.agent.update({
            where: { id: agentId },
            data: {
                activeDeals,
                closedDeals,
                totalCommission: commission,
            },
        });
    }
}