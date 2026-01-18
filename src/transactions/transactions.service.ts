import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService) { }

    async findAll(filters?: { month?: string }) {
        const where: any = {};

        if (filters?.month) {
            const [year, month] = filters.month.split("-");
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0);

            where.date = {
                gte: startDate,
                lte: endDate,
            };
        }

        return this.prisma.transaction.findMany({
            where,
            include: {
                asset: {
                    select: {
                        id: true,
                        name: true,
                        referenceCode: true,
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                leadAgent: {
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
                closerAgent: {
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
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });
    }

    async findById(id: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                asset: true,
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                company: true,
            },
        });

        if (!transaction) {
            throw new NotFoundException(`Transaction with ID ${id} not found`);
        }

        return transaction;
    }

    async create(data: {
        assetId: string;
        buyerId: string;
        leadAgentId: string;
        closerAgentId: string;
        companyId: string;
        amount: number;
        paymentType: string;
        leadCommission: number;
        closerCommission: number;
        totalCommission: number;
        status: string;
    }) {
        // Verify related entities exist
        await Promise.all([
            this.prisma.asset.findUniqueOrThrow({ where: { id: data.assetId } }),
            this.prisma.user.findUniqueOrThrow({ where: { id: data.buyerId } }),
            this.prisma.agent.findUniqueOrThrow({ where: { id: data.leadAgentId } }),
            this.prisma.agent.findUniqueOrThrow({ where: { id: data.closerAgentId } }),
            this.prisma.company.findUniqueOrThrow({ where: { id: data.companyId } }),
        ]);

        // Create transaction
        const transaction = await this.prisma.transaction.create({
            data: {
                assetId: data.assetId,
                buyerId: data.buyerId,
                leadAgentId: data.leadAgentId,
                closerAgentId: data.closerAgentId,
                companyId: data.companyId,
                amount: data.amount,
                paymentType: data.paymentType,
                leadCommission: data.leadCommission,
                closerCommission: data.closerCommission,
                totalCommission: data.totalCommission,
                status: data.status,
                commissionPaymentStatus: "unpaid",
                date: new Date(),
            },
            include: {
                asset: true,
                buyer: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                company: true,
            },
        });

        // Update agent stats if transaction is completed
        if (data.status === "completed") {
            await this.updateAgentStatsAfterTransaction(
                data.leadAgentId,
                data.closerAgentId
            );
        }

        return transaction;
    }

    async update(id: string, data: any) {
        // Check if transaction exists
        const transaction = await this.findById(id);

        const updated = await this.prisma.transaction.update({
            where: { id },
            data,
            include: {
                asset: true,
                buyer: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                company: true,
            },
        });

        // Update agent stats if status changed to completed
        if (data.status === "completed" && transaction.status !== "completed") {
            await this.updateAgentStatsAfterTransaction(
                transaction.leadAgentId,
                transaction.closerAgentId || ""
            );
        }

        return updated;
    }

    async getStats() {
        const [
            totalTransactions,
            completedTransactions,
            pendingTransactions,
            totalRevenue,
            totalCommission,
            earnedCommission,
        ] = await Promise.all([
            this.prisma.transaction.count(),
            this.prisma.transaction.count({ where: { status: "completed" } }),
            this.prisma.transaction.count({ where: { status: "pending" } }),
            this.prisma.transaction.aggregate({
                where: { status: "completed" },
                _sum: { amount: true },
            }),
            this.prisma.transaction.aggregate({
                where: { status: "completed" },
                _sum: { totalCommission: true },
            }),
            this.prisma.transaction.aggregate({
                where: { status: "completed" },
                _sum: { earnedTotalCommission: true },
            }),
        ]);

        return {
            totalTransactions,
            completedTransactions,
            pendingTransactions,
            totalRevenue: totalRevenue._sum.amount || 0,
            totalCommission: totalCommission._sum.totalCommission || 0,
            earnedCommission: earnedCommission._sum.earnedTotalCommission || 0,
            averageTransactionValue: completedTransactions > 0
                ? (totalRevenue._sum.amount || 0) / completedTransactions
                : 0,
        };
    }

    async getUnpaidCommissions(filters?: { month?: string }) {
        const where: any = {
            OR: [
                { commissionPaymentStatus: "unpaid" },
                { commissionPaymentStatus: "sent" },
            ],
        };

        if (filters?.month) {
            const [year, month] = filters.month.split("-");
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0);

            where.date = {
                gte: startDate,
                lte: endDate,
            };
        }

        return this.prisma.transaction.findMany({
            where,
            include: {
                asset: {
                    select: {
                        name: true,
                    },
                },
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });
    }

    async getPaidCommissions(filters?: { month?: string }) {
        const where: any = {
            commissionPaymentStatus: "paid",
        };

        if (filters?.month) {
            const [year, month] = filters.month.split("-");
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0);

            where.date = {
                gte: startDate,
                lte: endDate,
            };
        }

        return this.prisma.transaction.findMany({
            where,
            include: {
                asset: {
                    select: {
                        name: true,
                    },
                },
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });
    }

    async sendCommissionsForPayment(transactionIds: string[]) {
        // Mark commissions as sent
        return this.prisma.transaction.updateMany({
            where: {
                id: { in: transactionIds },
                commissionPaymentStatus: "unpaid",
            },
            data: {
                commissionPaymentStatus: "sent",
            },
        });
    }

    async uploadPaymentProof(file: Express.Multer.File) {
        // Process the payment proof file (CSV/Excel)
        // For now, just mark all sent commissions as paid
        // In production, you would parse the file and match transaction IDs

        const sentCommissions = await this.prisma.transaction.findMany({
            where: {
                commissionPaymentStatus: "sent",
            },
        });

        if (sentCommissions.length === 0) {
            throw new NotFoundException("No commissions marked as sent");
        }

        // Mark as paid
        await this.prisma.transaction.updateMany({
            where: {
                commissionPaymentStatus: "sent",
            },
            data: {
                commissionPaymentStatus: "paid",
            },
        });

        return {
            message: `${sentCommissions.length} commissions marked as paid`,
            count: sentCommissions.length,
        };
    }

    private async updateAgentStatsAfterTransaction(
        leadAgentId: string,
        closerAgentId: string
    ) {
        // Update lead agent stats
        const leadAgentStats = await this.prisma.transaction.aggregate({
            where: {
                leadAgentId,
                status: "completed",
            },
            _count: true,
            _sum: {
                leadCommission: true,
            },
        });

        await this.prisma.agent.update({
            where: { id: leadAgentId },
            data: {
                closedDeals: leadAgentStats._count,
                totalCommission: leadAgentStats._sum.leadCommission || 0,
            },
        });

        // Update closer agent stats
        const closerAgentStats = await this.prisma.transaction.aggregate({
            where: {
                closerAgentId,
                status: "completed",
            },
            _count: true,
            _sum: {
                closerCommission: true,
            },
        });

        await this.prisma.agent.update({
            where: { id: closerAgentId },
            data: {
                closedDeals: closerAgentStats._count,
                totalCommission: closerAgentStats._sum.closerCommission || 0,
            },
        });
    }
}