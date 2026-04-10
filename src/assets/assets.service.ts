import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { generateSerialId } from '../common/serial-id.helper';

@Injectable()
export class AssetsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) { }

  async publish(id: string) {
    await this.findById(id);
    const published = await this.prisma.asset.update({
      where: { id },
      data: { status: 'published' }, // removed publishedAt
    });

    await this.notificationService.notifyAssetPublished(id);
    return published;
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
        company: true,
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
        ...asset,
        facilities: asset.facilities ?? [],
        ownershipOptions: asset.ownershipOptions ?? [],
        paymentOptions: asset.paymentOptions ?? [],
        installmentPeriods: asset.installmentPeriods ?? [],
        riskFactors: asset.riskFactors ?? [],
        finalPrice,
        totalAnnualReturn,
        projectedRentalIncome: Number(asset.projectedRentalIncome) || 0,
        virtualTours: asset.virtualTours ?? 0,
      };
    });
  }

  async getPublicStats() {
    const [publishedAssets, totalLeads] = await Promise.all([
      this.prisma.asset.findMany({
        where: { status: 'published' },
        select: { price: true, fractionCost: true, rentalYield: true, rentalYieldMax: true, capitalAppreciation: true },
      }),
      this.prisma.lead.count(),
    ]);

    let totalValue = 0;
    let yieldSum = 0;
    let yieldCount = 0;

    for (const a of publishedAssets) {
      const raw = a.price || a.fractionCost || '0';
      const n = parseFloat(raw);
      if (!isNaN(n)) totalValue += n;

      const ry = parseFloat((a.rentalYield as any) || '0') || a.rentalYieldMax || 0;
      const ca = a.capitalAppreciation || 0;
      if (ry + ca > 0) { yieldSum += ry + ca; yieldCount++; }
    }

    return {
      assetsListed: publishedAssets.length,
      totalInvestors: totalLeads,
      totalTransactionValue: totalValue,
      averageROI: yieldCount > 0 ? Math.round(yieldSum / yieldCount) : 18,
    };
  }

  async getOverviewStats() {
    const assets = await this.prisma.asset.findMany({
      select: { status: true, price: true, fractionCost: true },
    });

    const statusCounts: Record<string, number> = {};
    let totalValue = 0;

    for (const asset of assets) {
      const statusKey = (asset.status || 'unknown').toLowerCase();
      statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;

      const rawValue = asset.price || asset.fractionCost || '0';
      const numericValue = Number.parseFloat(rawValue);
      if (!Number.isNaN(numericValue)) {
        totalValue += numericValue;
      }
    }

    return {
      totalAssets: assets.length,
      totalValue,
      statusCounts,
    };
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
      facilities: asset.facilities ?? [],
      ownershipOptions: asset.ownershipOptions ?? [],
      paymentOptions: asset.paymentOptions ?? [],
      installmentPeriods: asset.installmentPeriods ?? [],
      riskFactors: asset.riskFactors ?? [],
      finalPrice,
      totalAnnualReturn,
      projectedRentalIncome: Number(asset.projectedRentalIncome) || 0,
      virtualTours: asset.virtualTours ?? 0,
    };
  }

  async create(data: any) {
    if (!data.name) throw new BadRequestException('Asset name is required');
    if (!data.companyId) throw new BadRequestException('Company ID is required');

    // Verify company exists
    const company = await this.prisma.company.findUnique({ where: { id: data.companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const serialId = await generateSerialId(this.prisma, 'AST');
    const newAsset = await this.prisma.asset.create({
      data: {
        serialId,
        name: data.name,
        company: { connect: { id: data.companyId } },
        title: data.title || data.name,
        referenceCode: data.referenceCode || null,
        type: data.type || null,
        status: data.status || 'draft',
        projectStatus: data.projectStatus || null,
        location: data.location || null,
        address: data.address || null,
        description: data.description || null,
        // Basic Details
        landSize: data.landSize ? parseFloat(data.landSize) : null,
        builtSize: data.builtSize ? parseFloat(data.builtSize) : null,
        constructionStart: data.constructionStart ? new Date(data.constructionStart) : null,
        constructionEnd: data.constructionEnd ? new Date(data.constructionEnd) : null,
        propertyCategory: data.propertyCategory || null,
        unitConfiguration: data.unitConfiguration || null,
        facilityManagement: data.facilityManagement ?? null,
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
        // Investment Structure
        ownershipType: data.ownershipType || null,
        fractionTotal: data.fractionTotal ? parseInt(data.fractionTotal) : null,
        landUnitType: data.landUnitType || null,
        landUnitCount: data.landUnitCount ? parseInt(data.landUnitCount) : null,
        // Pricing
        price: data.price || null,
        priceRange: data.priceRange || null,
        markup: data.markup || null,
        fractionCost: data.fractionCost || data.costPerFraction || null,
        fundingStatus: data.fundingStatus ? parseInt(data.fundingStatus) : null,
        paymentOptions: data.paymentOptions || [],
        installmentPeriods: data.installmentPeriods || [],
        downPaymentAmount: data.downPaymentAmount || null,
        offPlanDiscount: data.offPlanDiscount ? parseFloat(data.offPlanDiscount) : null,
        stageBasedDiscount: data.stageBasedDiscount ? parseFloat(data.stageBasedDiscount) : null,
        // Commission
        commission: data.commission || null,
        commissionRate: data.commissionRate || null,
        leadCommission: data.leadCommission ? parseFloat(data.leadCommission) : null,
        closerCommission: data.closerCommission ? parseFloat(data.closerCommission) : null,
        // Returns
        projectedRentalIncome: data.projectedRentalIncome ? parseFloat(data.projectedRentalIncome) : null,
        rentalFrequency: data.rentalFrequency || null,
        operatingCost: data.operatingCost ? parseFloat(data.operatingCost) : null,
        firstPayoutDate: data.firstPayoutDate ? new Date(data.firstPayoutDate) : null,
        rentalYield: data.rentalYield || null,
        rentalYieldMin: data.rentalYieldMin ? parseFloat(data.rentalYieldMin) : null,
        rentalYieldMax: data.rentalYieldMax ? parseFloat(data.rentalYieldMax) : null,
        capitalAppreciation: data.capitalAppreciation ? parseFloat(data.capitalAppreciation) : null,
        capitalAppreciationMin: data.capitalAppreciationMin ? parseFloat(data.capitalAppreciationMin) : null,
        capitalAppreciationMax: data.capitalAppreciationMax ? parseFloat(data.capitalAppreciationMax) : null,
        totalReturns: data.totalReturns || null,
        totalReturnsMin: data.totalReturnsMin ? parseFloat(data.totalReturnsMin) : null,
        totalReturnsMax: data.totalReturnsMax ? parseFloat(data.totalReturnsMax) : null,
        // Risk & Management
        riskLevel: data.riskLevel || null,
        riskFactors: data.riskFactors || [],
        constructionStage: data.constructionStage || data.constructionProgress || null,
        offPlanSecurity: data.offPlanSecurity || null,
        exitLiquidity: data.exitLiquidity || null,
        managementMode: data.managementMode || null,
        // Media
        virtualTours: data.virtualTours ? parseInt(data.virtualTours) : null,
      },
    });

    // Return enriched asset with computed fields
    return this.findById(newAsset.id);
  }

  async update(id: string, data: any) {
    const existingAsset = await this.findById(id); // throws if not found

    const updateData: any = {};
    // Basic info
    if (data.name !== undefined) updateData.name = data.name;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.referenceCode !== undefined) updateData.referenceCode = data.referenceCode;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.projectStatus !== undefined) updateData.projectStatus = data.projectStatus;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.companyId !== undefined) updateData.companyId = data.companyId;
    // Basic Details
    if (data.landSize !== undefined && data.landSize !== '' && data.landSize !== null) updateData.landSize = parseFloat(data.landSize);
    if (data.builtSize !== undefined && data.builtSize !== '' && data.builtSize !== null) updateData.builtSize = parseFloat(data.builtSize);
    if (data.constructionStart !== undefined) updateData.constructionStart = data.constructionStart ? new Date(data.constructionStart) : null;
    if (data.constructionEnd !== undefined) updateData.constructionEnd = data.constructionEnd ? new Date(data.constructionEnd) : null;
    if (data.propertyCategory !== undefined) updateData.propertyCategory = data.propertyCategory;
    if (data.unitConfiguration !== undefined) updateData.unitConfiguration = data.unitConfiguration;
    if (data.facilityManagement !== undefined) updateData.facilityManagement = data.facilityManagement;
    // Unit details
    if (data.units !== undefined && data.units !== '' && data.units !== null) updateData.units = parseInt(data.units);
    if (data.totalUnits !== undefined && data.totalUnits !== '' && data.totalUnits !== null) updateData.totalUnits = parseInt(data.totalUnits);
    if (data.availableUnits !== undefined && data.availableUnits !== '' && data.availableUnits !== null) updateData.availableUnits = parseInt(data.availableUnits);
    if (data.bedrooms !== undefined && data.bedrooms !== '' && data.bedrooms !== null) updateData.bedrooms = parseInt(data.bedrooms);
    if (data.bathrooms !== undefined && data.bathrooms !== '' && data.bathrooms !== null) updateData.bathrooms = parseInt(data.bathrooms);
    if (data.area !== undefined && data.area !== '' && data.area !== null) updateData.area = parseFloat(data.area);
    if (data.parking !== undefined) updateData.parking = data.parking;
    if (data.furnished !== undefined) updateData.furnished = data.furnished;
    if (data.facilities !== undefined) updateData.facilities = data.facilities;
    if (data.sharedFacilities !== undefined) updateData.facilities = data.sharedFacilities;
    if (data.ownershipOptions !== undefined) updateData.ownershipOptions = data.ownershipOptions;
    // Investment Structure
    if (data.ownershipType !== undefined) updateData.ownershipType = data.ownershipType;
    if (data.fractionTotal !== undefined && data.fractionTotal !== '' && data.fractionTotal !== null) updateData.fractionTotal = parseInt(data.fractionTotal);
    if (data.landUnitType !== undefined) updateData.landUnitType = data.landUnitType;
    if (data.landUnitCount !== undefined && data.landUnitCount !== '' && data.landUnitCount !== null) updateData.landUnitCount = parseInt(data.landUnitCount);
    // Pricing
    if (data.price !== undefined) updateData.price = data.price;
    if (data.priceRange !== undefined) updateData.priceRange = data.priceRange;
    if (data.markup !== undefined) updateData.markup = data.markup;
    if (data.fractionCost !== undefined) updateData.fractionCost = data.fractionCost;
    if (data.costPerFraction !== undefined) updateData.fractionCost = data.costPerFraction;
    if (data.fundingStatus !== undefined && data.fundingStatus !== '' && data.fundingStatus !== null) updateData.fundingStatus = parseInt(data.fundingStatus);
    if (data.paymentOptions !== undefined) updateData.paymentOptions = data.paymentOptions;
    if (data.installmentPeriods !== undefined) updateData.installmentPeriods = data.installmentPeriods;
    if (data.downPaymentAmount !== undefined) updateData.downPaymentAmount = data.downPaymentAmount;
    if (data.offPlanDiscount !== undefined && data.offPlanDiscount !== '' && data.offPlanDiscount !== null) updateData.offPlanDiscount = parseFloat(data.offPlanDiscount);
    if (data.stageBasedDiscount !== undefined && data.stageBasedDiscount !== '' && data.stageBasedDiscount !== null) updateData.stageBasedDiscount = parseFloat(data.stageBasedDiscount);
    // Commission
    if (data.commission !== undefined) updateData.commission = data.commission;
    if (data.commissionRate !== undefined) updateData.commissionRate = data.commissionRate;
    if (data.leadCommission !== undefined && data.leadCommission !== '' && data.leadCommission !== null) updateData.leadCommission = parseFloat(data.leadCommission);
    if (data.closerCommission !== undefined && data.closerCommission !== '' && data.closerCommission !== null) updateData.closerCommission = parseFloat(data.closerCommission);
    // Returns
    if (data.projectedRentalIncome !== undefined && data.projectedRentalIncome !== '' && data.projectedRentalIncome !== null) updateData.projectedRentalIncome = parseFloat(data.projectedRentalIncome);
    if (data.rentalFrequency !== undefined) updateData.rentalFrequency = data.rentalFrequency;
    if (data.operatingCost !== undefined && data.operatingCost !== '' && data.operatingCost !== null) updateData.operatingCost = parseFloat(data.operatingCost);
    if (data.firstPayoutDate !== undefined) updateData.firstPayoutDate = data.firstPayoutDate ? new Date(data.firstPayoutDate) : null;
    if (data.rentalYield !== undefined) updateData.rentalYield = data.rentalYield;
    if (data.rentalYieldMin !== undefined && data.rentalYieldMin !== '' && data.rentalYieldMin !== null) updateData.rentalYieldMin = parseFloat(data.rentalYieldMin);
    if (data.rentalYieldMax !== undefined && data.rentalYieldMax !== '' && data.rentalYieldMax !== null) updateData.rentalYieldMax = parseFloat(data.rentalYieldMax);
    if (data.capitalAppreciation !== undefined && data.capitalAppreciation !== '' && data.capitalAppreciation !== null) updateData.capitalAppreciation = parseFloat(data.capitalAppreciation);
    if (data.capitalAppreciationMin !== undefined && data.capitalAppreciationMin !== '' && data.capitalAppreciationMin !== null) updateData.capitalAppreciationMin = parseFloat(data.capitalAppreciationMin);
    if (data.capitalAppreciationMax !== undefined && data.capitalAppreciationMax !== '' && data.capitalAppreciationMax !== null) updateData.capitalAppreciationMax = parseFloat(data.capitalAppreciationMax);
    if (data.totalReturns !== undefined) updateData.totalReturns = data.totalReturns;
    if (data.totalReturnsMin !== undefined && data.totalReturnsMin !== '' && data.totalReturnsMin !== null) updateData.totalReturnsMin = parseFloat(data.totalReturnsMin);
    if (data.totalReturnsMax !== undefined && data.totalReturnsMax !== '' && data.totalReturnsMax !== null) updateData.totalReturnsMax = parseFloat(data.totalReturnsMax);
    // Risk & Management
    if (data.riskLevel !== undefined) updateData.riskLevel = data.riskLevel;
    if (data.riskFactors !== undefined) updateData.riskFactors = data.riskFactors;
    if (data.constructionStage !== undefined) updateData.constructionStage = data.constructionStage;
    if (data.constructionProgress !== undefined) updateData.constructionStage = data.constructionProgress;
    if (data.offPlanSecurity !== undefined) updateData.offPlanSecurity = data.offPlanSecurity;
    if (data.exitLiquidity !== undefined) updateData.exitLiquidity = data.exitLiquidity;
    if (data.managementMode !== undefined) updateData.managementMode = data.managementMode;
    // Media
    if (data.virtualTours !== undefined && data.virtualTours !== '' && data.virtualTours !== null) updateData.virtualTours = parseInt(data.virtualTours);

    await this.prisma.asset.update({
      where: { id },
      data: updateData,
    });

    const changedFields = Object.keys(updateData);
    if (changedFields.length) {
      await this.notificationService.notifyAssetUpdated(existingAsset.id, changedFields);
    }

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

  /**
   * Creates a draft asset imported from the Urbco platform.
   * The asset is created with status='draft' so a Buyops admin must
   * explicitly publish it before it becomes visible to investors.
   */
  async importFromUrbco(dto: {
    urbcoPropertyId: string;
    urbcoRef: string;
    name: string;
    description?: string;
    address?: string;
    location?: string;
    constructionStage?: string;
    totalUnits?: number;
    availableUnits?: number;
    fractionTotal?: number;
    price?: string;
    fractionCost?: string;
    rentalYieldMax?: number;
    capitalAppreciation?: number;
    firstPayoutDate?: string;
    constructionStart?: string;
    constructionEnd?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    companyId?: string;
  }) {
    // Reject duplicate imports for the same Urbco property
    const existing = await this.prisma.asset.findFirst({
      where: { urbcoPropertyId: dto.urbcoPropertyId },
    });
    if (existing) {
      return existing;
    }

    const serialId = await generateSerialId(this.prisma, 'AST');
    const asset = await this.prisma.asset.create({
      data: {
        serialId,
        name: dto.name,
        title: dto.name,
        referenceCode: dto.urbcoRef || null,
        urbcoPropertyId: dto.urbcoPropertyId,
        urbcoRef: dto.urbcoRef || null,
        status: 'draft',
        description: dto.description || null,
        address: dto.address || null,
        location: dto.location || null,
        constructionStage: dto.constructionStage || null,
        totalUnits: dto.totalUnits ?? null,
        units: dto.totalUnits ?? null,
        availableUnits: dto.availableUnits ?? null,
        fractionTotal: dto.fractionTotal ?? null,
        price: dto.price || null,
        fractionCost: dto.fractionCost || null,
        rentalYieldMax: dto.rentalYieldMax ?? null,
        capitalAppreciation: dto.capitalAppreciation ?? null,
        firstPayoutDate: dto.firstPayoutDate ? new Date(dto.firstPayoutDate) : null,
        constructionStart: dto.constructionStart ? new Date(dto.constructionStart) : null,
        constructionEnd: dto.constructionEnd ? new Date(dto.constructionEnd) : null,
        bedrooms: dto.bedrooms ?? null,
        bathrooms: dto.bathrooms ?? null,
        area: dto.area ?? null,
        ...(dto.companyId ? { company: { connect: { id: dto.companyId } } } : {}),
      },
    });

    return asset;
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

  async uploadImages(assetId: string, files: Express.Multer.File[]) {
    await this.findById(assetId);

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const images = [];

    for (const file of files) {
      const url = `${baseUrl}/uploads/images/${file.filename}`;
      const image = await this.prisma.assetImage.create({
        data: {
          assetId,
          url,
          caption: file.originalname,
          order: 0,
        },
      });
      images.push(image);
    }

    return {
      message: `${images.length} image(s) uploaded successfully`,
      images,
    };
  }

  async uploadDocuments(assetId: string, files: Express.Multer.File[]) {
    await this.findById(assetId);

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const documents = [];

    for (const file of files) {
      const url = `${baseUrl}/uploads/documents/${file.filename}`;
      const document = await this.prisma.assetDocument.create({
        data: {
          assetId,
          url,
          title: file.originalname,
          type: file.mimetype,
        },
      });
      documents.push(document);
    }

    return {
      message: `${documents.length} document(s) uploaded successfully`,
      documents,
    };
  }
}
