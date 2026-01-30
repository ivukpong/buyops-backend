import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException 
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

// ══════════════════════════════════════════════════════════════════════════
// ASSETS SERVICE - Complete Implementation
// Includes publish/unpublish, image/document management
// ══════════════════════════════════════════════════════════════════════════

@Injectable()
export class AssetsService {
    constructor(private prisma: PrismaService) { }

    async findAll(filters?: any) {
        try {
            const where: any = {};

            // Apply filters
            if (filters?.type) {
                where.type = filters.type;
            }

            if (filters?.status) {
                where.status = filters.status;
            }

            if (filters?.location) {
                where.location = {
                    contains: filters.location,
                    mode: 'insensitive'
                };
            }

            if (filters?.companyId) {
                where.companyId = filters.companyId;
            }

            if (filters?.search) {
                where.OR = [
                    { name: { contains: filters.search, mode: 'insensitive' } },
                    { referenceCode: { contains: filters.search, mode: 'insensitive' } },
                    { location: { contains: filters.search, mode: 'insensitive' } },
                ];
            }

            return await this.prisma.asset.findMany({
                where,
                include: {
                    company: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        } catch (error) {
            console.error('Failed to fetch assets:', error);
            throw new InternalServerErrorException('Failed to fetch assets');
        }
    }

    async findById(id: string) {
        if (!id || id.trim() === '') {
            throw new BadRequestException('Asset ID is required');
        }

        const asset = await this.prisma.asset.findUnique({
            where: { id },
            include: {
                company: true,
                images: true,
                documents: true,
                transactions: {
                    take: 10,
                    orderBy: { date: 'desc' },
                },
            },
        });

        if (!asset) {
            throw new NotFoundException(`Asset with ID ${id} not found`);
        }

        return asset;
    }

    async create(data: any) {
        try {
            // Validation
            if (!data.name || data.name.trim() === '') {
                throw new BadRequestException('Asset name is required');
            }

            if (!data.companyId) {
                throw new BadRequestException('Company ID is required');
            }

            if (!data.type) {
                throw new BadRequestException('Asset type is required');
            }

            if (!data.location) {
                throw new BadRequestException('Location is required');
            }

            // Verify company exists
            const company = await this.prisma.company.findUnique({
                where: { id: data.companyId },
            });

            if (!company) {
                throw new BadRequestException('Invalid company ID');
            }

            // Generate reference code if not provided
            if (!data.referenceCode) {
                const prefix = data.type.substring(0, 3).toUpperCase();
                const timestamp = Date.now().toString().slice(-6);
                data.referenceCode = `${prefix}-${timestamp}`;
            }

            // Calculate final price if not provided
            if (data.basePrice && data.markup) {
                data.finalPrice = data.basePrice + data.markup;
            }

            // Calculate total return if not provided
            if (data.rentalYieldMin && data.capitalAppreciationMin) {
                data.totalReturnMin = data.rentalYieldMin + data.capitalAppreciationMin;
            }

            if (data.rentalYieldMax && data.capitalAppreciationMax) {
                data.totalReturnMax = data.rentalYieldMax + data.capitalAppreciationMax;
            }

            const asset = await this.prisma.asset.create({
                data: {
                    ...data,
                    status: data.status || 'draft',
                },
                include: {
                    company: true,
                },
            });

            // Update company stats
            await this.updateCompanyStats(data.companyId);

            return asset;

        } catch (error) {
            if (error.code === 'P2002') {
                throw new BadRequestException('Asset with this reference code already exists');
            }

            if (error instanceof BadRequestException) {
                throw error;
            }

            console.error('Asset creation error:', error);
            throw new InternalServerErrorException('Failed to create asset');
        }
    }

    async update(id: string, data: any) {
        try {
            // Check if asset exists
            const existingAsset = await this.findById(id);

            // If changing company, verify new company exists
            if (data.companyId && data.companyId !== existingAsset.companyId) {
                const company = await this.prisma.company.findUnique({
                    where: { id: data.companyId },
                });

                if (!company) {
                    throw new BadRequestException('Invalid company ID');
                }
            }

            // Recalculate fields if needed
            if (data.basePrice !== undefined || data.markup !== undefined) {
                const basePrice = data.basePrice ?? existingAsset.basePrice;
                const markup = data.markup ?? existingAsset.markup;
                data.finalPrice = basePrice + markup;
            }

            if (data.rentalYieldMin !== undefined || data.capitalAppreciationMin !== undefined) {
                const rentalYieldMin = data.rentalYieldMin ?? existingAsset.rentalYieldMin;
                const capitalAppreciationMin = data.capitalAppreciationMin ?? existingAsset.capitalAppreciationMin;
                data.totalReturnMin = rentalYieldMin + capitalAppreciationMin;
            }

            if (data.rentalYieldMax !== undefined || data.capitalAppreciationMax !== undefined) {
                const rentalYieldMax = data.rentalYieldMax ?? existingAsset.rentalYieldMax;
                const capitalAppreciationMax = data.capitalAppreciationMax ?? existingAsset.capitalAppreciationMax;
                data.totalReturnMax = rentalYieldMax + capitalAppreciationMax;
            }

            const asset = await this.prisma.asset.update({
                where: { id },
                data,
                include: {
                    company: true,
                },
            });

            // Update company stats if company changed
            if (data.companyId && data.companyId !== existingAsset.companyId) {
                await this.updateCompanyStats(existingAsset.companyId);
                await this.updateCompanyStats(data.companyId);
            }

            return asset;

        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            console.error('Asset update error:', error);
            throw new InternalServerErrorException('Failed to update asset');
        }
    }

    // ═══ PUBLISH/UNPUBLISH ENDPOINTS ═══

    async publish(id: string) {
        try {
            const asset = await this.findById(id);

            // Validation: Check if asset has all required fields for publishing
            if (!asset.name || !asset.type || !asset.location) {
                throw new BadRequestException('Asset must have name, type, and location to be published');
            }

            if (!asset.finalPrice || asset.finalPrice <= 0) {
                throw new BadRequestException('Asset must have a valid price to be published');
            }

            if (asset.status === 'published') {
                throw new BadRequestException('Asset is already published');
            }

            const updatedAsset = await this.prisma.asset.update({
                where: { id },
                data: {
                    status: 'published',
                    publishedAt: new Date(),
                },
                include: {
                    company: true,
                },
            });

            // Update company stats
            await this.updateCompanyStats(asset.companyId);

            return {
                message: 'Asset published successfully',
                asset: updatedAsset,
            };

        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            console.error('Asset publish error:', error);
            throw new InternalServerErrorException('Failed to publish asset');
        }
    }

    async unpublish(id: string) {
        try {
            const asset = await this.findById(id);

            if (asset.status !== 'published') {
                throw new BadRequestException('Only published assets can be unpublished');
            }

            // Check if asset has active transactions
            const activeTransactions = await this.prisma.transaction.count({
                where: {
                    assetId: id,
                    status: {
                        in: ['pending', 'partial'],
                    },
                },
            });

            if (activeTransactions > 0) {
                throw new ForbiddenException(
                    `Cannot unpublish asset with ${activeTransactions} active transactions`
                );
            }

            const updatedAsset = await this.prisma.asset.update({
                where: { id },
                data: {
                    status: 'draft',
                },
                include: {
                    company: true,
                },
            });

            // Update company stats
            await this.updateCompanyStats(asset.companyId);

            return {
                message: 'Asset unpublished successfully',
                asset: updatedAsset,
            };

        } catch (error) {
            if (error instanceof NotFoundException || 
                error instanceof BadRequestException || 
                error instanceof ForbiddenException) {
                throw error;
            }

            console.error('Asset unpublish error:', error);
            throw new InternalServerErrorException('Failed to unpublish asset');
        }
    }

    // ═══ IMAGE MANAGEMENT ═══

    async addImage(assetId: string, imageData: { url: string; caption?: string }) {
        try {
            const asset = await this.findById(assetId);

            const image = await this.prisma.assetImage.create({
                data: {
                    assetId,
                    url: imageData.url,
                    caption: imageData.caption || null,
                },
            });

            return image;

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('Add image error:', error);
            throw new InternalServerErrorException('Failed to add image');
        }
    }

    async deleteImage(assetId: string, imageId: string) {
        try {
            // Verify asset exists
            await this.findById(assetId);

            // Verify image belongs to asset
            const image = await this.prisma.assetImage.findFirst({
                where: {
                    id: imageId,
                    assetId,
                },
            });

            if (!image) {
                throw new NotFoundException('Image not found for this asset');
            }

            await this.prisma.assetImage.delete({
                where: { id: imageId },
            });

            return {
                message: 'Image deleted successfully',
                id: imageId,
            };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('Delete image error:', error);
            throw new InternalServerErrorException('Failed to delete image');
        }
    }

    // ═══ DOCUMENT MANAGEMENT ═══

    async addDocument(assetId: string, documentData: { url: string; name: string; type: string }) {
        try {
            const asset = await this.findById(assetId);

            const document = await this.prisma.assetDocument.create({
                data: {
                    assetId,
                    url: documentData.url,
                    name: documentData.name,
                    type: documentData.type,
                },
            });

            return document;

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('Add document error:', error);
            throw new InternalServerErrorException('Failed to add document');
        }
    }

    async deleteDocument(assetId: string, documentId: string) {
        try {
            // Verify asset exists
            await this.findById(assetId);

            // Verify document belongs to asset
            const document = await this.prisma.assetDocument.findFirst({
                where: {
                    id: documentId,
                    assetId,
                },
            });

            if (!document) {
                throw new NotFoundException('Document not found for this asset');
            }

            await this.prisma.assetDocument.delete({
                where: { id: documentId },
            });

            return {
                message: 'Document deleted successfully',
                id: documentId,
            };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('Delete document error:', error);
            throw new InternalServerErrorException('Failed to delete document');
        }
    }

    // ═══ HELPER METHODS ═══

    async delete(id: string) {
        try {
            const asset = await this.findById(id);

            // Check if asset can be deleted
            const transactionsCount = await this.prisma.transaction.count({
                where: { assetId: id },
            });

            if (transactionsCount > 0) {
                throw new ForbiddenException(
                    `Cannot delete asset with ${transactionsCount} transactions. Unpublish instead.`
                );
            }

            await this.prisma.asset.delete({
                where: { id },
            });

            // Update company stats
            await this.updateCompanyStats(asset.companyId);

            return {
                message: 'Asset deleted successfully',
                id,
            };

        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }

            console.error('Asset deletion error:', error);
            throw new InternalServerErrorException('Failed to delete asset');
        }
    }

    private async updateCompanyStats(companyId: string) {
        try {
            const activeAssets = await this.prisma.asset.count({
                where: {
                    companyId,
                    status: 'published',
                },
            });

            await this.prisma.company.update({
                where: { id: companyId },
                data: { activeAssets },
            });
        } catch (error) {
            console.error('Failed to update company stats:', error);
            // Don't throw - this is not critical
        }
    }
}
