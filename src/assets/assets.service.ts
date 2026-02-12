import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) { }

  async publish(id: string) {
    await this.findById(id);
    return this.prisma.asset.update({
      where: { id },
      data: { status: 'published' }, // removed publishedAt
    });
  }

  async unpublish(id: string) {
    await this.findById(id);
    return this.prisma.asset.update({
      where: { id },
      data: { status: 'draft' }, // removed publishedAt
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

    return assets.map(asset => {
      // Calculate final price (prefer price, fallback to fractionCost)
      const finalPrice = asset.price
        ? parseFloat(asset.price)
        : asset.fractionCost
          ? parseFloat(asset.fractionCost)
          : 0;

      // Calculate total annual return
      const rentalYield = asset.rentalYield
        ? parseFloat(asset.rentalYield as any)
        : asset.rentalYieldMax
          ? asset.rentalYieldMax
          : 0;

      const capAppreciation = asset.capitalAppreciation
        ? parseFloat(asset.capitalAppreciation as any)
        : asset.capitalAppreciationMax
          ? asset.capitalAppreciationMax
          : 0;

      const totalAnnualReturn = rentalYield + capAppreciation;

      return {
        id: asset.id,
        name: asset.name,
        title: asset.title ?? asset.name,
        type: asset.type,
        status: asset.status,
        projectStatus: asset.projectStatus,
        location: asset.location,
        description: asset.description,
        companyId: asset.companyId,
        company: asset.company,
        // Unit details
        units: asset.units,
        totalUnits: asset.totalUnits,
        availableUnits: asset.availableUnits,
        bedrooms: asset.bedrooms,
        bathrooms: asset.bathrooms,
        area: asset.area,
        parking: asset.parking,
        furnished: asset.furnished,
        facilities: asset.facilities ?? [],
        ownershipOptions: asset.ownershipOptions ?? [],
        // Pricing
        price: asset.price,
        priceRange: asset.priceRange,
        fractionCost: asset.fractionCost,
        fundingStatus: asset.fundingStatus,
        finalPrice, // Computed field
        // Commission
        commission: asset.commission,
        commissionRate: asset.commissionRate,
        // Returns
        projectedRentalIncome: Number(asset.projectedRentalIncome) || 0,
        rentalYield: asset.rentalYield,
        rentalYieldMin: asset.rentalYieldMin,
        rentalYieldMax: asset.rentalYieldMax,
        capitalAppreciation: asset.capitalAppreciation,
        capitalAppreciationMin: asset.capitalAppreciationMin,
        capitalAppreciationMax: asset.capitalAppreciationMax,
        totalReturns: asset.totalReturns,
        totalReturnsMin: asset.totalReturnsMin,
        totalReturnsMax: asset.totalReturnsMax,
        totalAnnualReturn, // Computed field
        // Risk & Construction
        riskLevel: asset.riskLevel,
        riskFactors: asset.riskFactors ?? [],
        constructionStage: asset.constructionStage,
        // Media
        virtualTours: asset.virtualTours ?? 0,
        images: asset.images,
        documents: asset.documents,
        // Relations
        leads: asset.leads ?? [],
        transactions: asset.transactions ?? [],
        installmentPlans: asset.installmentPlans ?? [],
        _count: asset._count,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
      };
    });
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

    // Calculate final price (prefer price, fallback to fractionCost)
    const finalPrice = asset.price
      ? parseFloat(asset.price)
      : asset.fractionCost
        ? parseFloat(asset.fractionCost)
        : 0;

    // Calculate total annual return
    const rentalYield = asset.rentalYield
      ? parseFloat(asset.rentalYield as any)
      : asset.rentalYieldMax
        ? asset.rentalYieldMax
        : 0;

    const capAppreciation = asset.capitalAppreciation
      ? parseFloat(asset.capitalAppreciation as any)
      : asset.capitalAppreciationMax
        ? asset.capitalAppreciationMax
        : 0;

    const totalAnnualReturn = rentalYield + capAppreciation;

    return {
      ...asset,
      finalPrice,
      totalAnnualReturn,
      projectedRentalIncome: Number(asset.projectedRentalIncome) || 0,
    };
  }

  async create(data: any) {
    if (!data.name) throw new BadRequestException('Asset name is required');
    if (!data.companyId) throw new BadRequestException('Company ID is required');

    // Verify company exists
    const company = await this.prisma.company.findUnique({ where: { id: data.companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const newAsset = await this.prisma.asset.create({
      data: {
        name: data.name,
        companyId: data.companyId,
        title: data.title || data.name,
        type: data.type || null,
        status: data.status || 'draft',
        projectStatus: data.projectStatus || null,
        location: data.location || null,
        description: data.description || null,
        // Unit details
        units: data.units ? parseInt(data.units) : null,
        totalUnits: data.totalUnits ? parseInt(data.totalUnits) : null,
        availableUnits: data.availableUnits ? parseInt(data.availableUnits) : null,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
        area: data.area ? parseFloat(data.area) : null,
        parking: data.parking || null,
        furnished: data.furnished || null,
        facilities: data.facilities || data.sharedFacilities || [],
        ownershipOptions: data.ownershipOptions || [],
        // Pricing
        price: data.price || null,
        priceRange: data.priceRange || null,
        fractionCost: data.fractionCost || data.costPerFraction || null,
        fundingStatus: data.fundingStatus ? parseInt(data.fundingStatus) : null,
        // Commission
        commission: data.commission || null,
        commissionRate: data.commissionRate || null,
        // Returns
        projectedRentalIncome: data.projectedRentalIncome ? parseFloat(data.projectedRentalIncome) : null,
        rentalYield: data.rentalYield || null,
        rentalYieldMin: data.rentalYieldMin ? parseFloat(data.rentalYieldMin) : null,
        rentalYieldMax: data.rentalYieldMax ? parseFloat(data.rentalYieldMax) : null,
        capitalAppreciation: data.capitalAppreciation ? parseFloat(data.capitalAppreciation) : null,
        capitalAppreciationMin: data.capitalAppreciationMin ? parseFloat(data.capitalAppreciationMin) : null,
        capitalAppreciationMax: data.capitalAppreciationMax ? parseFloat(data.capitalAppreciationMax) : null,
        totalReturns: data.totalReturns || null,
        totalReturnsMin: data.totalReturnsMin ? parseFloat(data.totalReturnsMin) : null,
        totalReturnsMax: data.totalReturnsMax ? parseFloat(data.totalReturnsMax) : null,
        // Risk & Construction
        riskLevel: data.riskLevel || null,
        riskFactors: data.riskFactors || [],
        constructionStage: data.constructionStage || data.constructionProgress || null,
        // Media
        virtualTours: data.virtualTours ? parseInt(data.virtualTours) : null,
      },
    });

    // Return enriched asset with computed fields
    return this.findById(newAsset.id);
  }

  async update(id: string, data: any) {
    await this.findById(id); // throws if not found

    const updateData: any = {};
    // Basic info
    if (data.name !== undefined) updateData.name = data.name;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.projectStatus !== undefined) updateData.projectStatus = data.projectStatus;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.companyId !== undefined) updateData.companyId = data.companyId;
    // Unit details
    if (data.units !== undefined) updateData.units = parseInt(data.units);
    if (data.totalUnits !== undefined) updateData.totalUnits = parseInt(data.totalUnits);
    if (data.availableUnits !== undefined) updateData.availableUnits = parseInt(data.availableUnits);
    if (data.bedrooms !== undefined) updateData.bedrooms = parseInt(data.bedrooms);
    if (data.bathrooms !== undefined) updateData.bathrooms = parseInt(data.bathrooms);
    if (data.area !== undefined) updateData.area = parseFloat(data.area);
    if (data.parking !== undefined) updateData.parking = data.parking;
    if (data.furnished !== undefined) updateData.furnished = data.furnished;
    if (data.facilities !== undefined) updateData.facilities = data.facilities;
    if (data.sharedFacilities !== undefined) updateData.facilities = data.sharedFacilities;
    if (data.ownershipOptions !== undefined) updateData.ownershipOptions = data.ownershipOptions;
    // Pricing
    if (data.price !== undefined) updateData.price = data.price;
    if (data.priceRange !== undefined) updateData.priceRange = data.priceRange;
    if (data.fractionCost !== undefined) updateData.fractionCost = data.fractionCost;
    if (data.costPerFraction !== undefined) updateData.fractionCost = data.costPerFraction;
    if (data.fundingStatus !== undefined) updateData.fundingStatus = parseInt(data.fundingStatus);
    // Commission
    if (data.commission !== undefined) updateData.commission = data.commission;
    if (data.commissionRate !== undefined) updateData.commissionRate = data.commissionRate;
    // Returns
    if (data.projectedRentalIncome !== undefined) updateData.projectedRentalIncome = parseFloat(data.projectedRentalIncome);
    if (data.rentalYield !== undefined) updateData.rentalYield = data.rentalYield;
    if (data.rentalYieldMin !== undefined) updateData.rentalYieldMin = parseFloat(data.rentalYieldMin);
    if (data.rentalYieldMax !== undefined) updateData.rentalYieldMax = parseFloat(data.rentalYieldMax);
    if (data.capitalAppreciation !== undefined) updateData.capitalAppreciation = parseFloat(data.capitalAppreciation);
    if (data.capitalAppreciationMin !== undefined) updateData.capitalAppreciationMin = parseFloat(data.capitalAppreciationMin);
    if (data.capitalAppreciationMax !== undefined) updateData.capitalAppreciationMax = parseFloat(data.capitalAppreciationMax);
    if (data.totalReturns !== undefined) updateData.totalReturns = data.totalReturns;
    if (data.totalReturnsMin !== undefined) updateData.totalReturnsMin = parseFloat(data.totalReturnsMin);
    if (data.totalReturnsMax !== undefined) updateData.totalReturnsMax = parseFloat(data.totalReturnsMax);
    // Risk & Construction
    if (data.riskLevel !== undefined) updateData.riskLevel = data.riskLevel;
    if (data.riskFactors !== undefined) updateData.riskFactors = data.riskFactors;
    if (data.constructionStage !== undefined) updateData.constructionStage = data.constructionStage;
    if (data.constructionProgress !== undefined) updateData.constructionStage = data.constructionProgress;
    // Media
    if (data.virtualTours !== undefined) updateData.virtualTours = parseInt(data.virtualTours);

    await this.prisma.asset.update({
      where: { id },
      data: updateData,
    });

    // Return enriched asset with computed fields
    return this.findById(id);
  }

  async delete(id: string) {
    await this.findById(id);

    // Check for foreign key constraints before deleting
    const savedByCount = await this.prisma.savedProperty.count({ where: { assetId: id } });
    if (savedByCount > 0) {
      throw new BadRequestException(
        `Cannot delete asset. It is saved by ${savedByCount} user(s). Please ask them to unsave it first.`
      );
    }

    const leadsCount = await this.prisma.lead.count({ where: { assetInterest: id } });
    if (leadsCount > 0) {
      throw new BadRequestException(
        `Cannot delete asset. It has ${leadsCount} associated lead(s).`
      );
    }

    const transactionsCount = await this.prisma.transaction.count({ where: { assetId: id } });
    if (transactionsCount > 0) {
      throw new BadRequestException(
        `Cannot delete asset. It has ${transactionsCount} associated transaction(s).`
      );
    }

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
