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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TransactionsService = class TransactionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
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
    async findById(id) {
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
            throw new common_1.NotFoundException(`Transaction with ID ${id} not found`);
        }
        return transaction;
    }
    async create(data) {
        await Promise.all([
            this.prisma.asset.findUniqueOrThrow({ where: { id: data.assetId } }),
            this.prisma.user.findUniqueOrThrow({ where: { id: data.buyerId } }),
            this.prisma.agent.findUniqueOrThrow({ where: { id: data.leadAgentId } }),
            this.prisma.agent.findUniqueOrThrow({ where: { id: data.closerAgentId } }),
            this.prisma.company.findUniqueOrThrow({ where: { id: data.companyId } }),
        ]);
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
        if (data.status === "completed") {
            await this.updateAgentStatsAfterTransaction(data.leadAgentId, data.closerAgentId);
        }
        return transaction;
    }
    async update(id, data) {
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
        if (data.status === "completed" && transaction.status !== "completed") {
            await this.updateAgentStatsAfterTransaction(transaction.leadAgentId, transaction.closerAgentId || "");
        }
        return updated;
    }
    async getStats() {
        const [totalTransactions, completedTransactions, pendingTransactions, totalRevenue, totalCommission, earnedCommission,] = await Promise.all([
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
    async getUnpaidCommissions(filters) {
        const where = {
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
    async getPaidCommissions(filters) {
        const where = {
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
    async sendCommissionsForPayment(transactionIds) {
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
    async uploadPaymentProof(file) {
        const sentCommissions = await this.prisma.transaction.findMany({
            where: {
                commissionPaymentStatus: "sent",
            },
        });
        if (sentCommissions.length === 0) {
            throw new common_1.NotFoundException("No commissions marked as sent");
        }
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
    async updateAgentStatsAfterTransaction(leadAgentId, closerAgentId) {
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
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map