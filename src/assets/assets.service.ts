import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async publish(id: string) {
    await this.findById(id);
    return this.prisma.asset.update({
      where: { id },
      data: { status: 'published', publishedAt: new Date() },
    });
  }

  async unpublish(id: string) {
    await this.findById(id);
    return this.prisma.asset.update({
      where: { id },
      data: { status: 'draft', publishedAt: null },
    });
  }

  async deleteImage(assetId: string, imageId: string) {
    await this.findById(assetId);
    return this.prisma.assetImage.delete({ where: { id: imageId } });
  }

  async deleteDocument(assetId: string, documentId: string) {
    await this.findById(assetId);
    return this.prisma.assetDocument.delete({ where: { id: documentId } });
  }

  async findAll(filters?: { status?: string; type?: string; companyId?: string }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.type) where.type = filters.type;
    if (filters?.companyId) where.companyId = filters.companyId;

    const assets = await this.prisma.asset.findMany({
      where,
      include: {
        company: { select: { id: true, name: true } },
        images: { orderBy: { order: 'asc' } },
        documents: true,
        leads: { orderBy: { createdAt: 'desc' }, take: 10 },
        transactions: { orderBy: { date: 'desc' }, take: 10 },
        installmentPlans: true,
        _count: { select: { leads: true, transactions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return assets.map(asset => ({
      id: asset.id,
      title: asset.title ?? asset.name,
      type: asset.type,
      price: asset.price,
      priceRange: asset.priceRange,
      commission: asset.commission,
      commissionRate: asset.commissionRate,
      location: asset.location,
      status: asset.status,
      projectStatus: asset.projectStatus,
      area: asset.area,
      units: asset.units,
      bedrooms: asset.bedrooms,
      bathrooms: asset.bathrooms,
      parking: asset.parking,
      furnished: asset.furnished,
      facilities: asset.facilities ?? [],
      ownershipOptions: asset.ownershipOptions ?? [],
      fractionCost: asset.fractionCost,
      fundingStatus: asset.fundingStatus,
      rentalYield: asset.rentalYield,
      capitalAppreciation: asset.capitalAppreciation,
      totalReturns: asset.totalReturns,
      riskLevel: asset.riskLevel,
      constructionStage: asset.constructionStage,
      images: asset.images ?? 0,
      virtualTours: asset.virtualTours ?? 0,
      documents: asset.documents ?? 0,
      description: asset.description,
      leads: asset.leads ?? [],
      finalPrice: Number(asset.finalPrice) || 0,
      projectedRentalIncome: Number(asset.projectedRentalIncome) || 0,
      rentalYield: asset.rentalYield,
      capitalAppreciation: asset.capitalAppreciation,
      totalAnnualReturn: asset.totalAnnualReturn,
    }));
  }

  async findById(id: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: {
        company: true,
        images: { orderBy: { order: 'asc' } },
        documents: true,
        leads: { orderBy: { createdAt: 'desc' }, take: 10 },
        transactions: { orderBy: { date: 'desc' }, take: 10 },
        installmentPlans: true,
        _count: { select: { leads: true, transactions: true } },
      },
    });

    if (!asset) throw new NotFoundException(`Asset with ID ${id} not found`);
    return asset;
  }

  async create(data: any) {
    if (!data.name) throw new BadRequestException('Asset name is required');
    if (!data.companyId) throw new BadRequestException('Company ID is required');

    // Verify company exists
    const company = await this.prisma.company.findUnique({ where: { id: data.companyId } });
    if (!company) throw new NotFoundException('Company not found');

    return this.prisma.asset.create({
      data: {
        name: data.name,
        companyId: data.companyId,
        type: data.type || null,
        status: data.status || 'draft',
        location: data.location || null,
        referenceCode: data.referenceCode || null,
        basePrice: data.basePrice ? parseFloat(data.basePrice) : null,
        markup: data.markup ? parseFloat(data.markup) : null,
        finalPrice: data.finalPrice ? parseFloat(data.finalPrice) : null,
        description: data.description || null,
        publishedAt: data.status === 'published' ? new Date() : null,
        totalUnits: data.totalUnits ? parseInt(data.totalUnits) : null,
        availableUnits: data.availableUnits ? parseInt(data.availableUnits) : null,
        projectedRentalIncome: data.projectedRentalIncome ? parseFloat(data.projectedRentalIncome) : null,
        rentalYieldMin: data.rentalYieldMin ? parseFloat(data.rentalYieldMin) : null,
        rentalYieldMax: data.rentalYieldMax ? parseFloat(data.rentalYieldMax) : null,
        capitalAppreciation: data.capitalAppreciation ? parseFloat(data.capitalAppreciation) : null,
        capitalAppreciationMin: data.capitalAppreciationMin ? parseFloat(data.capitalAppreciationMin) : null,
        capitalAppreciationMax: data.capitalAppreciationMax ? parseFloat(data.capitalAppreciationMax) : null,
        totalReturnsMin: data.totalReturnsMin ? parseFloat(data.totalReturnsMin) : null,
        totalReturnsMax: data.totalReturnsMax ? parseFloat(data.totalReturnsMax) : null,
        riskLevel: data.riskLevel || null,
        riskFactors: data.riskFactors || [],
      },
      include: { company: { select: { id: true, name: true } } },
    });
  }

  async update(id: string, data: any) {
    await this.findById(id); // throws if not found

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === 'published' && !updateData.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (data.location !== undefined) updateData.location = data.location;
    if (data.referenceCode !== undefined) updateData.referenceCode = data.referenceCode;
    if (data.basePrice !== undefined) updateData.basePrice = parseFloat(data.basePrice);
    if (data.markup !== undefined) updateData.markup = parseFloat(data.markup);
    if (data.finalPrice !== undefined) updateData.finalPrice = parseFloat(data.finalPrice);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.companyId !== undefined) updateData.companyId = data.companyId;
    if (data.totalUnits !== undefined) updateData.totalUnits = parseInt(data.totalUnits);
    if (data.availableUnits !== undefined) updateData.availableUnits = parseInt(data.availableUnits);
    if (data.riskLevel !== undefined) updateData.riskLevel = data.riskLevel;

    return this.prisma.asset.update({
      where: { id },
      data: updateData,
      include: { company: { select: { id: true, name: true } } },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.asset.delete({ where: { id } });
    return { message: 'Asset deleted successfully', id };
  }

  // FIX 13: AssetImage and AssetDocument now exist in schema
  async addImage(assetId: string, imageData: { url: string; caption?: string; order?: number }) {
    await this.findById(assetId);
    return this.prisma.assetImage.create({
      data: {
        assetId,
        url: imageData.url,
        caption: imageData.caption || null,
        order: imageData.order || 0,
      },
    });
  }

  async removeImage(imageId: string) {
    return this.prisma.assetImage.delete({ where: { id: imageId } });
  }

  async addDocument(assetId: string, docData: { url: string; title?: string; type?: string }) {
    await this.findById(assetId);
    return this.prisma.assetDocument.create({
      data: {
        assetId,
        url: docData.url,
        title: docData.title || null,
        type: docData.type || null,
      },
    });
  }

  async removeDocument(docId: string) {
    return this.prisma.assetDocument.delete({ where: { id: docId } });
  }
}
