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
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AgentsService = class AgentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findById(id) {
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
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        }
        return agent;
    }
    async create(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            const existingAgent = await this.prisma.agent.findUnique({
                where: { userId: existingUser.id },
            });
            if (existingAgent) {
                throw new common_1.ConflictException("User is already registered as an agent");
            }
        }
        let user;
        if (existingUser) {
            user = existingUser;
        }
        else {
            const hashedPassword = await bcrypt.hash("password123", 10);
            user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                    role: "SALES",
                },
            });
        }
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
    async update(id, data) {
        const agent = await this.findById(id);
        if (data.name || data.email) {
            await this.prisma.user.update({
                where: { id: agent.userId },
                data: {
                    name: data.name,
                    email: data.email,
                },
            });
        }
        const updateData = {};
        if (data.cluster)
            updateData.clusterId = data.cluster;
        if (data.role)
            updateData.role = data.role;
        if (data.status)
            updateData.status = data.status;
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
    async delete(id) {
        const agent = await this.findById(id);
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
            throw new Error(`Cannot delete agent with ${activeDealsCount} active deals. Please reassign or complete deals first.`);
        }
        return this.prisma.agent.delete({
            where: { id },
        });
    }
    async getStats() {
        const [totalAgents, activeAgents, totalDeals, totalCommission,] = await Promise.all([
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
    async updateAgentStats(agentId) {
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
        const commission = (totalCommission._sum.leadCommission || 0) +
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
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgentsService);
//# sourceMappingURL=agents.service.js.map