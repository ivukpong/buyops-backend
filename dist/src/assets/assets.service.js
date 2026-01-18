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
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AssetsService = class AssetsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.type && filters.type !== 'all') {
            where.type = filters.type;
        }
        if (filters?.status && filters.status !== 'all') {
            where.status = filters.status;
        }
        if (filters?.location && filters.location !== 'all') {
            where.location = { contains: filters.location, mode: 'insensitive' };
        }
        return this.prisma.asset.findMany({
            where,
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findById(id) {
        const asset = await this.prisma.asset.findUnique({
            where: { id },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        commissionRate: true,
                    },
                },
                leads: true,
                transactions: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        date: true,
                    },
                },
            },
        });
        if (!asset) {
            throw new common_1.NotFoundException(`Asset with ID ${id} not found`);
        }
        return asset;
    }
    async create(dto) {
        if (dto.referenceCode) {
            const existing = await this.prisma.asset.findUnique({
                where: { referenceCode: dto.referenceCode },
            });
            if (existing) {
                throw new common_1.ConflictException('Reference code already exists');
            }
        }
        const { company, ...assetData } = dto;
        return this.prisma.asset.create({
            data: {
                ...assetData,
                companyId: dto.companyId || company?.id,
                availableUnits: dto.totalUnits,
                finalPrice: dto.basePrice * (1 + dto.markup / 100),
            },
        });
    }
    async update(id, dto) {
        await this.findById(id);
        const updateData = { ...dto };
        if (dto.basePrice || dto.markup) {
            const current = await this.prisma.asset.findUnique({ where: { id } });
            const base = dto.basePrice ?? current.basePrice;
            const markup = dto.markup ?? current.markup;
            updateData.finalPrice = base * (1 + markup / 100);
        }
        if (dto.company) {
            updateData.companyId = dto.company;
            delete updateData.company;
        }
        return this.prisma.asset.update({
            where: { id },
            data: updateData,
        });
    }
    async delete(id) {
        const asset = await this.findById(id);
        if (asset.transactions?.length > 0) {
            throw new common_1.ConflictException('Cannot delete asset with active transactions');
        }
        return this.prisma.asset.delete({ where: { id } });
    }
    async getStats() {
        const [totalAssets, activeAssets, soldOutAssets, totalRevenue, avgPrice,] = await Promise.all([
            this.prisma.asset.count(),
            this.prisma.asset.count({ where: { status: 'published' } }),
            this.prisma.asset.count({ where: { status: 'sold-out' } }),
            this.prisma.transaction.aggregate({
                where: { status: 'completed' },
                _sum: { amount: true },
            }),
            this.prisma.asset.aggregate({
                _avg: { finalPrice: true },
            }),
        ]);
        return {
            totalAssets,
            activeAssets,
            soldOutAssets,
            totalRevenue: totalRevenue._sum.amount || 0,
            averagePrice: avgPrice._avg.finalPrice || 0,
        };
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map