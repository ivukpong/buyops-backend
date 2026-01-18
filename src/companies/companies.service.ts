import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CompaniesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.company.findMany({
            include: {
                assets: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                    },
                },
                _count: {
                    select: {
                        assets: true,
                        transactions: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findById(id: string) {
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: {
                assets: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        status: true,
                        finalPrice: true,
                    },
                },
                transactions: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        date: true,
                    },
                    take: 10,
                    orderBy: {
                        date: "desc",
                    },
                },
                _count: {
                    select: {
                        assets: true,
                        transactions: true,
                    },
                },
            },
        });

        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }

        return company;
    }

    async create(data: any) {
        // Parse dates
        const companyData = {
            ...data,
            agreementStartDate: new Date(data.agreementStartDate),
            agreementExpiryDate: new Date(data.agreementExpiryDate),
            status: data.status || "active",
            activeAssets: 0,
            totalTransactions: 0,
        };

        return this.prisma.company.create({
            data: companyData,
            include: {
                _count: {
                    select: {
                        assets: true,
                        transactions: true,
                    },
                },
            },
        });
    }

    async update(id: string, data: any) {
        // Check if company exists
        await this.findById(id);

        // Parse dates if provided
        const updateData: any = { ...data };
        if (data.agreementStartDate) {
            updateData.agreementStartDate = new Date(data.agreementStartDate);
        }
        if (data.agreementExpiryDate) {
            updateData.agreementExpiryDate = new Date(data.agreementExpiryDate);
        }

        return this.prisma.company.update({
            where: { id },
            data: updateData,
            include: {
                _count: {
                    select: {
                        assets: true,
                        transactions: true,
                    },
                },
            },
        });
    }

    async delete(id: string) {
        // Check if company exists
        await this.findById(id);

        // Check if company has active assets
        const activeAssetsCount = await this.prisma.asset.count({
            where: {
                companyId: id,
                status: "published",
            },
        });

        if (activeAssetsCount > 0) {
            throw new Error(
                `Cannot delete company with ${activeAssetsCount} active assets. Please archive or delete assets first.`
            );
        }

        return this.prisma.company.delete({
            where: { id },
        });
    }

    async updateStats(companyId: string) {
        const [activeAssets, totalTransactions] = await Promise.all([
            this.prisma.asset.count({
                where: {
                    companyId,
                    status: "published",
                },
            }),
            this.prisma.transaction.count({
                where: { companyId },
            }),
        ]);

        return this.prisma.company.update({
            where: { id: companyId },
            data: {
                activeAssets,
                totalTransactions,
            },
        });
    }
}