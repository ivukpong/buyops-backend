"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.role) {
            where.role = filters.role;
        }
        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: "insensitive" } },
                { email: { contains: filters.search, mode: "insensitive" } },
            ];
        }
        const users = await this.prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                agentProfile: {
                    select: {
                        id: true,
                        status: true,
                        totalCommission: true,
                        activeDeals: true,
                        closedDeals: true,
                        cluster: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                freelancerProfile: {
                    select: {
                        id: true,
                        status: true,
                        totalCommission: true,
                        activeDeals: true,
                        closedDeals: true,
                        cluster: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (filters?.status) {
            return users.filter((user) => {
                if (user.agentProfile) {
                    return user.agentProfile.status === filters.status;
                }
                if (user.freelancerProfile) {
                    return user.freelancerProfile.status === filters.status;
                }
                return filters.status === "active";
            });
        }
        return users;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                agentProfile: {
                    include: {
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
                },
                freelancerProfile: {
                    include: {
                        cluster: true,
                    },
                },
                leadsCreated: {
                    take: 10,
                    orderBy: {
                        dateReceived: "desc",
                    },
                },
                transactions: {
                    take: 10,
                    orderBy: {
                        date: "desc",
                    },
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
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                agentProfile: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
                freelancerProfile: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }
    async getUserStats(userId) {
        const user = await this.findById(userId);
        if (user.agentProfile) {
            const [activeDeals, closedDeals, totalCommission] = await Promise.all([
                this.prisma.transaction.count({
                    where: {
                        OR: [
                            { leadAgentId: user.agentProfile.id },
                            { closerAgentId: user.agentProfile.id },
                        ],
                        status: "pending",
                    },
                }),
                this.prisma.transaction.count({
                    where: {
                        OR: [
                            { leadAgentId: user.agentProfile.id },
                            { closerAgentId: user.agentProfile.id },
                        ],
                        status: "completed",
                    },
                }),
                this.prisma.transaction.aggregate({
                    where: {
                        OR: [
                            { leadAgentId: user.agentProfile.id },
                            { closerAgentId: user.agentProfile.id },
                        ],
                        status: "completed",
                    },
                    _sum: {
                        leadCommission: true,
                        closerCommission: true,
                    },
                }),
            ]);
            return {
                userType: "agent",
                activeDeals,
                closedDeals,
                totalCommission: (totalCommission._sum.leadCommission || 0) +
                    (totalCommission._sum.closerCommission || 0),
                cluster: user.agentProfile.cluster,
            };
        }
        if (user.freelancerProfile) {
            return {
                userType: "freelancer",
                totalCommission: user.freelancerProfile.totalCommission,
                cluster: user.freelancerProfile.cluster,
                activeDeals: user.freelancerProfile.activeDeals,
                closedDeals: user.freelancerProfile.closedDeals,
            };
        }
        if (user.role === "INVESTOR") {
            const [totalInvested, activeInvestments] = await Promise.all([
                this.prisma.transaction.aggregate({
                    where: {
                        buyerId: userId,
                        status: "completed",
                    },
                    _sum: { amount: true },
                }),
                this.prisma.transaction.count({
                    where: {
                        buyerId: userId,
                        status: { in: ["pending", "completed"] },
                    },
                }),
            ]);
            return {
                userType: "investor",
                totalInvested: totalInvested._sum.amount || 0,
                activeInvestments,
            };
        }
        return {
            userType: user.role.toLowerCase(),
        };
    }
    async getUserActivity(userId, limit = 20) {
        const user = await this.findById(userId);
        const activities = [];
        if (user.transactions.length > 0) {
            activities.push(...user.transactions.map((t) => ({
                type: "transaction",
                date: t.date,
                description: `Transaction for ₦${t.amount.toLocaleString()}`,
                data: t,
            })));
        }
        if (user.leadsCreated.length > 0) {
            activities.push(...user.leadsCreated.map((l) => ({
                type: "lead",
                date: l.dateReceived,
                description: `Created lead for ${l.name}`,
                data: l,
            })));
        }
        return activities
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, limit);
    }
    async getUserTransactions(userId) {
        return this.prisma.transaction.findMany({
            where: {
                OR: [
                    { buyerId: userId },
                    {
                        leadAgent: {
                            userId,
                        },
                    },
                    {
                        closerAgent: {
                            userId,
                        },
                    },
                ],
            },
            include: {
                asset: {
                    select: {
                        name: true,
                        referenceCode: true,
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });
    }
    async getUserLeads(userId) {
        return this.prisma.lead.findMany({
            where: {
                createdBy: userId,
            },
            include: {
                asset: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                dateReceived: "desc",
            },
        });
    }
    async createUser(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: data.role || "USER",
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
    }
    async updateUser(userId, data) {
        await this.findById(userId);
        return this.prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                updatedAt: true,
            },
        });
    }
    async updateUserRole(userId, newRole) {
        await this.findById(userId);
        return this.prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
    }
    async updateUserPassword(userId, newPassword) {
        await this.findById(userId);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return {
            message: "Password updated successfully",
        };
    }
    async deactivateUser(userId) {
        const user = await this.findById(userId);
        if (user.agentProfile) {
            await this.prisma.agent.update({
                where: { id: user.agentProfile.id },
                data: { status: "inactive" },
            });
        }
        if (user.freelancerProfile) {
            await this.prisma.freelancer.update({
                where: { id: user.freelancerProfile.id },
                data: { status: "inactive" },
            });
        }
        return { message: "User deactivated successfully" };
    }
    async reactivateUser(userId) {
        const user = await this.findById(userId);
        if (user.agentProfile) {
            await this.prisma.agent.update({
                where: { id: user.agentProfile.id },
                data: { status: "active" },
            });
        }
        if (user.freelancerProfile) {
            await this.prisma.freelancer.update({
                where: { id: user.freelancerProfile.id },
                data: { status: "active" },
            });
        }
        return { message: "User reactivated successfully" };
    }
    async deleteUser(userId) {
        await this.findById(userId);
        const transactionCount = await this.prisma.transaction.count({
            where: { buyerId: userId },
        });
        if (transactionCount > 0) {
            throw new Error("Cannot delete user with existing transactions. Please deactivate instead.");
        }
        await this.prisma.user.delete({
            where: { id: userId },
        });
        return { message: "User deleted successfully" };
    }
    async getUsersByRole(role) {
        return this.prisma.user.findMany({
            where: { role },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getUserDashboard(userId) {
        const stats = await this.getUserStats(userId);
        const recentActivity = await this.getUserActivity(userId, 10);
        return {
            stats,
            recentActivity,
        };
    }
    async getAllAgents() {
        return this.prisma.user.findMany({
            where: {
                agentProfile: {
                    isNot: null,
                },
            },
            include: {
                agentProfile: {
                    include: {
                        cluster: true,
                    },
                },
            },
        });
    }
    async getAllInvestors() {
        return this.prisma.user.findMany({
            where: { role: "INVESTOR" },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });
    }
    async searchUsers(query, role) {
        const where = {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
            ],
        };
        if (role) {
            where.role = role;
        }
        return this.prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
            take: 20,
        });
    }
    async getUserCountByRole() {
        const counts = await this.prisma.user.groupBy({
            by: ["role"],
            _count: true,
        });
        return counts.map((item) => ({
            role: item.role,
            count: item._count,
        }));
    }
    async bulkCreateUsers(users) {
        const hashedUsers = await Promise.all(users.map(async (user) => ({
            ...user,
            password: await bcrypt.hash(user.password, 10),
            role: user.role || "USER",
        })));
        const result = await this.prisma.user.createMany({
            data: hashedUsers,
            skipDuplicates: true,
        });
        return {
            message: `${result.count} users created successfully`,
            count: result.count,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map