import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) { }

  private normalizeStatus(status?: string): string {
    const normalized = String(status || 'active').trim().toLowerCase();
    if (!['active', 'pending', 'inactive', 'suspended'].includes(normalized)) {
      throw new BadRequestException('Status must be one of: active, pending, inactive, suspended');
    }
    return normalized;
  }

  private normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  // Helper method to add computed fields (activeAssets and totalTransactions)
  private async enrichCompanyData(company: any) {
    // If assets are already included in the company object, use them
    let activeAssets: number;
    if (company.assets && Array.isArray(company.assets)) {
      activeAssets = company.assets.filter((asset: any) =>
        ['available', 'active', 'published'].includes(String(asset.status || '').toLowerCase())
      ).length;
    } else {
      // Otherwise, fetch and count
      const assets = await this.prisma.asset.findMany({
        where: { companyId: company.id },
        select: { status: true }
      });
      activeAssets = assets.filter(asset =>
        ['available', 'active', 'published'].includes(String(asset.status || '').toLowerCase())
      ).length;
    }

    const totalTransactions = company._count?.transactions ||
      await this.prisma.transaction.count({ where: { companyId: company.id } });

    return {
      ...company,
      activeAssets,
      totalTransactions
    };
  }

  async findAll() {
    // Fetch all companies with their assets and transactions counts
    const companies = await this.prisma.company.findMany({
      include: {
        assets: { select: { id: true, name: true, type: true, status: true } },
        _count: { select: { assets: true, transactions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Add activeAssets and totalTransactions to each company
    return companies.map(company => ({
      ...company,
      activeAssets: company.assets.filter(asset =>
        ['available', 'active', 'published'].includes(String(asset.status || '').toLowerCase())
      ).length,
      totalTransactions: company._count.transactions,
    }));
  }

  async findById(id: string) {
    if (!id || id.trim() === '') throw new BadRequestException('Company ID is required');

    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        assets: { select: { id: true, name: true, type: true, status: true } },
        transactions: { select: { id: true, totalAmount: true, status: true, date: true }, take: 10, orderBy: { date: 'desc' } },
        _count: { select: { assets: true, transactions: true } },
      },
    });

    if (!company) throw new NotFoundException(`Company with ID ${id} not found`);

    // Return company with computed activeAssets and totalTransactions
    return this.enrichCompanyData(company);
  }

  async create(data: any) {
    try {
      if (!data.name || !data.name.trim()) throw new BadRequestException('Company name is required');
      if (!data.email || !data.email.trim()) throw new BadRequestException('Email is required');
      if (!data.type || !['developer', 'realtor', 'partner', 'consultant', 'investor'].includes(data.type)) {
        throw new BadRequestException('Company type is required and must be one of: developer, realtor, partner, consultant, investor');
      }

      // Name uniqueness check
      const existingByName = await this.prisma.company.findFirst({ where: { name: { equals: data.name.trim(), mode: 'insensitive' } } });
      if (existingByName) throw new ConflictException('A company with this name already exists');

      // Email uniqueness check
      const existing = await this.prisma.company.findFirst({ where: { email: this.normalizeEmail(data.email) } });
      if (existing) throw new ConflictException('A company with this email already exists');

      // Phone uniqueness check
      if (data.phone?.trim()) {
        const existingByPhone = await this.prisma.company.findFirst({ where: { phone: data.phone.trim() } });
        if (existingByPhone) throw new ConflictException('A company with this phone number already exists');
      }

      // Note: activeAssets and totalTransactions are computed fields and are NOT saved to the database
      const company = await this.prisma.company.create({
        data: {
          name: data.name.trim(),
          type: data.type,
          email: this.normalizeEmail(data.email),
          phone: data.phone?.trim() || null,
          status: this.normalizeStatus(data.status),
          contactPerson: data.contactPerson?.trim() || null,
          address: data.address?.trim() || null,
          commissionRate: data.commissionRate ? parseFloat(data.commissionRate) : 0,
          paymentTerms: data.paymentTerms?.trim() || null,
          agreementStartDate: data.agreementStartDate ? new Date(data.agreementStartDate) : null,
          agreementExpiryDate: data.agreementExpiryDate ? new Date(data.agreementExpiryDate) : null,
          registrationNumber: data.registrationNumber?.trim() || null,
          notes: data.notes?.trim() || null,
          accountName: (data.accountName || data.bankAccountName)?.trim() || null,
          bankName: data.bankName?.trim() || null,
          accountNumber: data.accountNumber?.trim() || null,
        },
        include: {
          assets: { select: { id: true, name: true, type: true, status: true } },
          _count: { select: { assets: true, transactions: true } }
        },
      });

      // Return company with computed activeAssets and totalTransactions
      return this.enrichCompanyData(company);
    } catch (error) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0] || 'field';
        throw new ConflictException(`A company with this ${field} already exists`);
      }
      if (error instanceof BadRequestException || error instanceof ConflictException) throw error;
      console.error('Company creation error:', error);
      throw new InternalServerErrorException('Failed to create company');
    }
  }

  async update(id: string, data: any) {
    // Validate company exists
    if (!id || id.trim() === '') throw new BadRequestException('Company ID is required');

    const exists = await this.prisma.company.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new NotFoundException(`Company with ID ${id} not found`);

    // Note: activeAssets and totalTransactions are computed fields and should NOT be saved to the database
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.type !== undefined) updateData.type = data.type;
    if (data.email !== undefined) updateData.email = this.normalizeEmail(data.email);
    if (data.phone !== undefined) updateData.phone = data.phone?.trim();
    if (data.status !== undefined) updateData.status = this.normalizeStatus(data.status);
    if (data.contactPerson !== undefined) updateData.contactPerson = data.contactPerson?.trim();
    if (data.address !== undefined) updateData.address = data.address?.trim();
    if (data.commissionRate !== undefined) updateData.commissionRate = parseFloat(data.commissionRate);
    if (data.paymentTerms !== undefined) updateData.paymentTerms = data.paymentTerms?.trim();
    if (data.agreementStartDate !== undefined) updateData.agreementStartDate = data.agreementStartDate ? new Date(data.agreementStartDate) : null;
    if (data.agreementExpiryDate !== undefined) updateData.agreementExpiryDate = data.agreementExpiryDate ? new Date(data.agreementExpiryDate) : null;
    if (data.registrationNumber !== undefined) updateData.registrationNumber = data.registrationNumber?.trim();
    if (data.notes !== undefined) updateData.notes = data.notes?.trim();
    if (data.accountName !== undefined || data.bankAccountName !== undefined) {
      updateData.accountName = (data.accountName || data.bankAccountName)?.trim() || null;
    }
    if (data.bankName !== undefined) updateData.bankName = data.bankName?.trim();
    if (data.accountNumber !== undefined) updateData.accountNumber = data.accountNumber?.trim();

    const company = await this.prisma.company.update({
      where: { id },
      data: updateData,
      include: {
        assets: { select: { id: true, name: true, type: true, status: true } },
        _count: { select: { assets: true, transactions: true } }
      },
    });

    // Return company with computed activeAssets and totalTransactions
    return this.enrichCompanyData(company);
  }

  async delete(id: string) {
    // Validate company exists
    if (!id || id.trim() === '') throw new BadRequestException('Company ID is required');

    const exists = await this.prisma.company.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new NotFoundException(`Company with ID ${id} not found`);

    const activeAssets = await this.prisma.asset.count({ where: { companyId: id, status: 'published' } });
    if (activeAssets > 0) throw new BadRequestException(`Cannot delete company with ${activeAssets} active assets.`);

    const txCount = await this.prisma.transaction.count({ where: { companyId: id } });
    if (txCount > 0) throw new BadRequestException(`Cannot delete company with ${txCount} transactions.`);

    await this.prisma.company.delete({ where: { id } });
    return { message: 'Company deleted successfully', id };
  }
}
