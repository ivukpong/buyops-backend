import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  ConflictException,
  InternalServerErrorException 
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

// ══════════════════════════════════════════════════════════════════════════
// COMPANIES SERVICE - BUG_019 FIX
// Complete validation, error handling, and business logic
// ══════════════════════════════════════════════════════════════════════════

@Injectable()
export class CompaniesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        try {
            return await this.prisma.company.findMany({
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
        } catch (error) {
            console.error('Failed to fetch companies:', error);
            throw new InternalServerErrorException('Failed to fetch companies');
        }
    }

    async findById(id: string) {
        if (!id || id.trim() === '') {
            throw new BadRequestException('Company ID is required');
        }

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

    // BUG_019 FIX: Comprehensive validation and error handling
    async create(data: any) {
        try {
            // ═══ VALIDATION ═══
            
            // 1. Required fields validation
            if (!data.name || data.name.trim() === '') {
                throw new BadRequestException('Company name is required');
            }

            if (!data.email || data.email.trim() === '') {
                throw new BadRequestException('Email is required');
            }

            if (!data.type) {
                throw new BadRequestException('Company type is required');
            }

            if (!data.phone) {
                throw new BadRequestException('Phone number is required');
            }

            if (!data.contactPerson || data.contactPerson.trim() === '') {
                throw new BadRequestException('Contact person is required');
            }

            if (!data.agreementStartDate) {
                throw new BadRequestException('Agreement start date is required');
            }

            if (!data.agreementExpiryDate) {
                throw new BadRequestException('Agreement expiry date is required');
            }

            // 2. Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new BadRequestException('Invalid email format');
            }

            // 3. Commission rate validation
            if (data.commissionRate !== undefined && data.commissionRate !== null) {
                const rate = parseFloat(data.commissionRate);
                if (isNaN(rate)) {
                    throw new BadRequestException('Commission rate must be a valid number');
                }
                if (rate < 0 || rate > 100) {
                    throw new BadRequestException('Commission rate must be between 0 and 100');
                }
            }

            // 4. Date validation
            let agreementStartDate: Date;
            let agreementExpiryDate: Date;

            try {
                agreementStartDate = new Date(data.agreementStartDate);
                agreementExpiryDate = new Date(data.agreementExpiryDate);

                // Check if dates are valid
                if (isNaN(agreementStartDate.getTime())) {
                    throw new BadRequestException('Invalid agreement start date format');
                }
                if (isNaN(agreementExpiryDate.getTime())) {
                    throw new BadRequestException('Invalid agreement expiry date format');
                }

                // Check date logic
                if (agreementExpiryDate <= agreementStartDate) {
                    throw new BadRequestException('Agreement expiry date must be after start date');
                }

                // Check if start date is not too far in the past (optional business rule)
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                
                if (agreementStartDate < oneYearAgo) {
                    throw new BadRequestException('Agreement start date cannot be more than 1 year in the past');
                }

            } catch (error) {
                if (error instanceof BadRequestException) {
                    throw error;
                }
                throw new BadRequestException('Invalid date format. Please use YYYY-MM-DD format');
            }

            // 5. Phone number validation
            const phoneRegex = /^[+]?[\d\s()-]{10,20}$/;
            if (!phoneRegex.test(data.phone)) {
                throw new BadRequestException('Invalid phone number format');
            }

            // ═══ DATA PREPARATION ═══
            
            const companyData = {
                name: data.name.trim(),
                type: data.type,
                email: data.email.toLowerCase().trim(),
                phone: data.phone.trim(),
                contactPerson: data.contactPerson.trim(),
                address: data.address?.trim() || '',
                commissionRate: data.commissionRate ? parseFloat(data.commissionRate) : 0,
                paymentTerms: data.paymentTerms?.trim() || '',
                agreementStartDate,
                agreementExpiryDate,
                registrationNumber: data.registrationNumber?.trim() || null,
                notes: data.notes?.trim() || null,
                accountName: data.accountName?.trim() || data.bankAccountName?.trim() || null,
                bankName: data.bankName?.trim() || null,
                accountNumber: data.accountNumber?.trim() || data.bankAccountNumber?.trim() || null,
                status: data.status || "active",
                activeAssets: 0,
                totalTransactions: 0,
            };

            // ═══ DATABASE OPERATION ═══
            
            const company = await this.prisma.company.create({
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

            return company;

        } catch (error) {
            // ═══ ERROR HANDLING ═══
            
            // Prisma unique constraint violation (duplicate email)
            if (error.code === 'P2002') {
                const field = error.meta?.target?.[0] || 'field';
                throw new ConflictException(`A company with this ${field} already exists`);
            }

            // Prisma foreign key constraint violation
            if (error.code === 'P2003') {
                throw new BadRequestException('Invalid reference to related entity');
            }

            // Re-throw known exceptions
            if (error instanceof BadRequestException || 
                error instanceof ConflictException ||
                error instanceof NotFoundException) {
                throw error;
            }

            // Log unexpected errors
            console.error('Company creation error:', error);
            
            // Generic error response
            throw new InternalServerErrorException(
                'Failed to create company. Please check all fields and try again.'
            );
        }
    }

    async update(id: string, data: any) {
        try {
            // Check if company exists
            await this.findById(id);

            // ═══ VALIDATION (same as create but all optional) ═══
            
            // Email validation if provided
            if (data.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    throw new BadRequestException('Invalid email format');
                }
            }

            // Commission rate validation if provided
            if (data.commissionRate !== undefined && data.commissionRate !== null) {
                const rate = parseFloat(data.commissionRate);
                if (isNaN(rate)) {
                    throw new BadRequestException('Commission rate must be a valid number');
                }
                if (rate < 0 || rate > 100) {
                    throw new BadRequestException('Commission rate must be between 0 and 100');
                }
            }

            // Phone validation if provided
            if (data.phone) {
                const phoneRegex = /^[+]?[\d\s()-]{10,20}$/;
                if (!phoneRegex.test(data.phone)) {
                    throw new BadRequestException('Invalid phone number format');
                }
            }

            // ═══ DATA PREPARATION ═══
            
            const updateData: any = {};

            if (data.name) updateData.name = data.name.trim();
            if (data.type) updateData.type = data.type;
            if (data.email) updateData.email = data.email.toLowerCase().trim();
            if (data.phone) updateData.phone = data.phone.trim();
            if (data.contactPerson) updateData.contactPerson = data.contactPerson.trim();
            if (data.address !== undefined) updateData.address = data.address?.trim() || '';
            if (data.commissionRate !== undefined) updateData.commissionRate = parseFloat(data.commissionRate) || 0;
            if (data.paymentTerms !== undefined) updateData.paymentTerms = data.paymentTerms?.trim() || '';
            if (data.registrationNumber !== undefined) updateData.registrationNumber = data.registrationNumber?.trim() || null;
            if (data.notes !== undefined) updateData.notes = data.notes?.trim() || null;
            if (data.accountName !== undefined) updateData.accountName = data.accountName?.trim() || null;
            if (data.bankName !== undefined) updateData.bankName = data.bankName?.trim() || null;
            if (data.accountNumber !== undefined) updateData.accountNumber = data.accountNumber?.trim() || null;
            if (data.status) updateData.status = data.status;

            // Date validation and parsing if provided
            if (data.agreementStartDate) {
                const startDate = new Date(data.agreementStartDate);
                if (isNaN(startDate.getTime())) {
                    throw new BadRequestException('Invalid agreement start date format');
                }
                updateData.agreementStartDate = startDate;
            }
            
            if (data.agreementExpiryDate) {
                const expiryDate = new Date(data.agreementExpiryDate);
                if (isNaN(expiryDate.getTime())) {
                    throw new BadRequestException('Invalid agreement expiry date format');
                }
                updateData.agreementExpiryDate = expiryDate;
            }

            // Validate date logic if both dates are being updated
            if (updateData.agreementStartDate && updateData.agreementExpiryDate) {
                if (updateData.agreementExpiryDate <= updateData.agreementStartDate) {
                    throw new BadRequestException('Agreement expiry date must be after start date');
                }
            }

            // ═══ DATABASE OPERATION ═══
            
            const company = await this.prisma.company.update({
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

            return company;

        } catch (error) {
            // ═══ ERROR HANDLING ═══
            
            if (error.code === 'P2002') {
                const field = error.meta?.target?.[0] || 'field';
                throw new ConflictException(`A company with this ${field} already exists`);
            }

            if (error instanceof BadRequestException || 
                error instanceof NotFoundException || 
                error instanceof ConflictException) {
                throw error;
            }

            console.error('Company update error:', error);
            throw new InternalServerErrorException('Failed to update company');
        }
    }

    async delete(id: string) {
        try {
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
                throw new BadRequestException(
                    `Cannot delete company with ${activeAssetsCount} active assets. Please unpublish or delete assets first.`
                );
            }

            // Check if company has transactions
            const transactionsCount = await this.prisma.transaction.count({
                where: { companyId: id },
            });

            if (transactionsCount > 0) {
                throw new BadRequestException(
                    `Cannot delete company with ${transactionsCount} transactions. Companies with transaction history cannot be deleted for audit purposes.`
                );
            }

            // Delete the company
            await this.prisma.company.delete({
                where: { id },
            });

            return {
                message: 'Company deleted successfully',
                id
            };

        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }

            console.error('Company deletion error:', error);
            throw new InternalServerErrorException('Failed to delete company');
        }
    }

    async updateStats(companyId: string) {
        try {
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

            return await this.prisma.company.update({
                where: { id: companyId },
                data: {
                    activeAssets,
                    totalTransactions,
                },
            });
        } catch (error) {
            console.error('Failed to update company stats:', error);
            // Don't throw - stats update is not critical
            return null;
        }
    }
}
