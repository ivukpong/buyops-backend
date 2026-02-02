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
  constructor(private prisma: PrismaService) {}

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
      activeAssets: company.assets.filter(asset => asset.status === 'AVAILABLE').length,
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
    return company;
  }

  async create(data: any) {
    try {
      if (!data.name || !data.name.trim()) throw new BadRequestException('Company name is required');
      if (!data.email || !data.email.trim()) throw new BadRequestException('Email is required');

      // Email uniqueness check
      const existing = await this.prisma.company.findFirst({ where: { email: data.email.toLowerCase().trim() } });
      if (existing) throw new ConflictException('A company with this email already exists');

      const company = await this.prisma.company.create({
        data: {
          name: data.name.trim(),
          type: data.type || null,
          email: data.email.toLowerCase().trim(),
          phone: data.phone?.trim() || null,
          status: data.status || 'active',
          contactPerson: data.contactPerson?.trim() || null,
          address: data.address?.trim() || null,
          commissionRate: data.commissionRate ? parseFloat(data.commissionRate) : 0,
          paymentTerms: data.paymentTerms?.trim() || null,
          agreementStartDate: data.agreementStartDate ? new Date(data.agreementStartDate) : null,
          agreementExpiryDate: data.agreementExpiryDate ? new Date(data.agreementExpiryDate) : null,
          registrationNumber: data.registrationNumber?.trim() || null,
          notes: data.notes?.trim() || null,
          accountName: data.accountName?.trim() || null,
          bankName: data.bankName?.trim() || null,
          accountNumber: data.accountNumber?.trim() || null,
        },
        include: { _count: { select: { assets: true, transactions: true } } },
      });

      return company;
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
    await this.findById(id);

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.type !== undefined) updateData.type = data.type;
    if (data.email !== undefined) updateData.email = data.email.toLowerCase().trim();
    if (data.phone !== undefined) updateData.phone = data.phone?.trim();
    if (data.status !== undefined) updateData.status = data.status;
    if (data.contactPerson !== undefined) updateData.contactPerson = data.contactPerson?.trim();
    if (data.address !== undefined) updateData.address = data.address?.trim();
    if (data.commissionRate !== undefined) updateData.commissionRate = parseFloat(data.commissionRate);
    if (data.paymentTerms !== undefined) updateData.paymentTerms = data.paymentTerms?.trim();
    if (data.agreementStartDate !== undefined) updateData.agreementStartDate = new Date(data.agreementStartDate);
    if (data.agreementExpiryDate !== undefined) updateData.agreementExpiryDate = new Date(data.agreementExpiryDate);
    if (data.registrationNumber !== undefined) updateData.registrationNumber = data.registrationNumber?.trim();
    if (data.notes !== undefined) updateData.notes = data.notes?.trim();
    if (data.accountName !== undefined) updateData.accountName = data.accountName?.trim();
    if (data.bankName !== undefined) updateData.bankName = data.bankName?.trim();
    if (data.accountNumber !== undefined) updateData.accountNumber = data.accountNumber?.trim();

    return this.prisma.company.update({
      where: { id },
      data: updateData,
      include: { _count: { select: { assets: true, transactions: true } } },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    const activeAssets = await this.prisma.asset.count({ where: { companyId: id, status: 'published' } });
    if (activeAssets > 0) throw new BadRequestException(`Cannot delete company with ${activeAssets} active assets.`);

    const txCount = await this.prisma.transaction.count({ where: { companyId: id } });
    if (txCount > 0) throw new BadRequestException(`Cannot delete company with ${txCount} transactions.`);

    await this.prisma.company.delete({ where: { id } });
    return { message: 'Company deleted successfully', id };
  }
}
