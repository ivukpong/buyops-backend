import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstallmentsService {
    constructor(private prisma: PrismaService) { }

    async findAll(filters?: { status?: string }) {
        const where: any = {};

        if (filters?.status && filters.status !== 'all') {
            where.status = filters.status;
        }

        return this.prisma.installmentPlan.findMany({
            where,
            include: {
                asset: {
                    select: {
                        id: true,
                        name: true,
                        referenceCode: true,
                    },
                },
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                installments: true,
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

    async create(dto: any) {
        return this.prisma.installmentPlan.create({
            data: {
                ...dto,
                companyId: dto.companyId, // Added required field
                remainingBalance: dto.totalAmount - (dto.downPayment || 0),
                paidAmount: 0,
                installmentAmount: dto.totalAmount / dto.numberOfInstallments,
            },
        });
    }

    async findById(id: string) {
        const plan = await this.prisma.installmentPlan.findUnique({
            where: { id },
            include: {
                asset: true,
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                installments: {
                    orderBy: {
                        dueDate: "asc",
                    },
                },
            },
        });

        if (!plan) {
            throw new NotFoundException(`Installment plan with ID ${id} not found`);
        }

        return plan;
    }

    async getInstallmentSchedule(planId: string) {
        const plan = await this.findById(planId);
        return plan.installments;
    }

    async recordPayment(
        planId: string,
        installmentId: string,
        data: { amount: number; paymentMethod: string }
    ) {
        const plan = await this.findById(planId);
        const installment = await this.prisma.installment.findUnique({
            where: { id: installmentId },
        });

        if (!installment) {
            throw new NotFoundException(`Installment with ID ${installmentId} not found`);
        }

        // Update installment
        const updatedInstallment = await this.prisma.installment.update({
            where: { id: installmentId },
            data: {
                paidAmount: installment.paidAmount + data.amount,
                status: installment.paidAmount + data.amount >= installment.amount ? "paid" : "partial",
                paidDate: new Date(),
                paymentMethod: data.paymentMethod,
            },
        });

        // Update plan
        const newPaidAmount = plan.paidAmount + data.amount;
        const completedInstallments = await this.prisma.installment.count({
            where: {
                installmentPlanId: planId,
                status: "paid",
            },
        });

        // Get next due installment
        const nextInstallment = await this.prisma.installment.findFirst({
            where: {
                installmentPlanId: planId,
                status: { in: ["pending", "upcoming", "overdue"] },
            },
            orderBy: {
                dueDate: "asc",
            },
        });

        // Check if plan is completed
        const isCompleted = newPaidAmount >= plan.remainingBalance;

        await this.prisma.installmentPlan.update({
            where: { id: planId },
            data: {
                paidAmount: newPaidAmount,
                completedInstallments,
                nextDueDate: nextInstallment?.dueDate || null,
                status: isCompleted ? "completed" : "active",
            },
        });

        return updatedInstallment;
    }

    async sendPaymentReminder(data: {
        installmentId: string;
        reminderDate: string;
        method: string;
    }) {
        const installment = await this.prisma.installment.findUnique({
            where: { id: data.installmentId },
            include: {
                plan: true,
            },
        });

        if (!installment) {
            throw new NotFoundException(`Installment with ID ${data.installmentId} not found`);
        }

        // In production, this would send actual email/SMS
        // For now, just log the reminder
        console.log(`Sending ${data.method} reminder to ${installment.plan.buyerEmail}`);

        return {
            message: "Reminder sent successfully",
            installmentId: data.installmentId,
            method: data.method,
            sentAt: new Date(),
        };
    }

    async getStats() {
        const [
            activePlans,
            completedPlans,
            totalOutstanding,
            totalCollected,
            overduePayments,
        ] = await Promise.all([
            this.prisma.installmentPlan.count({ where: { status: "active" } }),
            this.prisma.installmentPlan.count({ where: { status: "completed" } }),
            this.prisma.installmentPlan.aggregate({
                where: { status: "active" },
                _sum: {
                    remainingBalance: true,
                    paidAmount: true,
                },
            }),
            this.prisma.installmentPlan.aggregate({
                _sum: {
                    paidAmount: true,
                },
            }),
            this.prisma.installment.count({
                where: { status: "overdue" },
            }),
        ]);

        const outstanding = (totalOutstanding._sum.remainingBalance || 0) -
            (totalOutstanding._sum.paidAmount || 0);

        return {
            activePlans,
            completedPlans,
            totalOutstanding: outstanding,
            totalCollected: totalCollected._sum.paidAmount || 0,
            overduePayments,
        };
    }

    async updateInstallmentStatuses() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update overdue installments
        await this.prisma.installment.updateMany({
            where: {
                dueDate: { lt: today },
                status: { in: ["pending", "upcoming"] },
            },
            data: {
                status: "overdue",
            },
        });

        // Update upcoming to pending (7 days before due)
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);

        await this.prisma.installment.updateMany({
            where: {
                dueDate: { lte: weekFromNow, gte: today },
                status: "upcoming",
            },
            data: {
                status: "pending",
            },
        });
    }

    private async generateInstallmentSchedule(
        planId: string,
        data: {
            numberOfInstallments: number;
            installmentAmount: number;
            frequency: string;
            startDate: Date;
        }
    ) {
        const installments = [];
        const { numberOfInstallments, installmentAmount, frequency, startDate } = data;

        for (let i = 0; i < numberOfInstallments; i++) {
            const dueDate = this.calculateDueDate(startDate, frequency, i);

            installments.push({
                installmentPlanId: planId,
                dueDate,
                amount: installmentAmount,
                paidAmount: 0,
                status: i === 0 ? "pending" : "upcoming",
            });
        }

        await this.prisma.installment.createMany({
            data: installments,
        });
    }

    private calculateDueDate(startDate: Date, frequency: string, index: number): Date {
        const dueDate = new Date(startDate);

        switch (frequency.toLowerCase()) {
            case "weekly":
                dueDate.setDate(dueDate.getDate() + (index * 7));
                break;
            case "bi-weekly":
                dueDate.setDate(dueDate.getDate() + (index * 14));
                break;
            case "monthly":
                dueDate.setMonth(dueDate.getMonth() + index);
                break;
            case "quarterly":
                dueDate.setMonth(dueDate.getMonth() + (index * 3));
                break;
            default:
                dueDate.setMonth(dueDate.getMonth() + index);
        }

        return dueDate;
    }
}