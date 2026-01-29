// src/assets/assets.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './assets.controller';

@Injectable()
export class AssetsService {
    constructor(private prisma: PrismaService) { }

    // --- SAVED PROPERTIES ---
    async getSavedProperties(userId: string) {
        // Return all assets saved by the user
        const saved = await this.prisma.savedProperty.findMany({
            where: { userId },
            include: {
                asset: {
                    include: {
                        company: { select: { id: true, name: true } },
                    },
                },
            },
        });
        // Return just the asset objects
        return saved.map((s) => s.asset);
    }

    async saveProperty(userId: string, assetId: string) {
        // Create or ignore if already exists
        return this.prisma.savedProperty.upsert({
            where: { userId_assetId: { userId, assetId } },
            update: {},
            create: { userId, assetId },
        });
    }

    async unsaveProperty(userId: string, assetId: string) {
        // Remove the saved property if exists
        return this.prisma.savedProperty.delete({
            where: { userId_assetId: { userId, assetId } },
        });
    }

    async findAll(filters?: { type?: string; status?: string; location?: string }) {
        const where: any = {};

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

    async findById(id: string) {
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
            throw new NotFoundException(`Asset with ID ${id} not found`);
        }

        return asset;
    }

    async create(dto: CreateAssetDto) {
        if (dto.referenceCode) {
            const existing = await this.prisma.asset.findUnique({
                where: { referenceCode: dto.referenceCode },
            });
            if (existing) {
                throw new ConflictException('Reference code already exists');
            }
        }

        const { company, ...assetData } = dto; // strip any relation object if present
        return this.prisma.asset.create({
            data: {
                ...assetData,
                companyId: dto.companyId || company?.id, // if needed
                availableUnits: dto.totalUnits,
                finalPrice: dto.basePrice * (1 + dto.markup / 100),
            },
        });
    }

    async update(id: string, dto: Partial<CreateAssetDto>) {
        await this.findById(id); // Ensure exists

        const updateData: any = { ...dto };

        if (dto.basePrice || dto.markup) {
            const current = await this.prisma.asset.findUnique({ where: { id } });
            const base = dto.basePrice ?? current!.basePrice;
            const markup = dto.markup ?? current!.markup;
            updateData.finalPrice = base * (1 + markup / 100);
        }

        if (dto.company) {
            updateData.companyId = dto.company; // Map to companyId
            delete updateData.company;
        }

        return this.prisma.asset.update({
            where: { id },
            data: updateData,
        });
    }

    async delete(id: string) {
        const asset = await this.findById(id);

        if (asset.transactions?.length > 0) {
            throw new ConflictException('Cannot delete asset with active transactions');
        }

        return this.prisma.asset.delete({ where: { id } });
    }

    async getStats() {
        const [
            totalAssets,
            activeAssets,
            soldOutAssets,
            totalRevenue,
            avgPrice,
        ] = await Promise.all([
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
}