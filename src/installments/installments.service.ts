import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class InstallmentsService {
    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService,
    ) { }

    async findAll(filters?: { status?: string }) {
        const where: any = {};
        if (filters?.status && filters.status !== 'all') {
            where.status = filters.status.toUpperCase();
        }

        const plans = await this.prisma.installmentPlan.findMany({
            where,
            include: {
                asset: { select: { name: true } },
                company: { select: { name: true } },
                leadAgent: { include: { user: { select: { name: true } } } },
                closerAgent: { include: { user: { select: { name: true } } } },
                installments: { orderBy: { dueDate: 'asc' } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return plans.map(plan => ({
            id: plan.id,
            asset: plan.asset?.name ?? "",
            buyer: plan.buyerName ?? "",
            buyerEmail: plan.buyerEmail ?? "",
            buyerPhone: plan.buyerPhone ?? "",
            totalAmount: plan.totalAmount,
            downPayment: plan.downPayment,
            paidAmount: plan.paidAmount,
            remainingBalance: plan.remainingBalance,
            numberOfInstallments: plan.numberOfInstallments,
            completedInstallments: plan.completedInstallments,
            installmentAmount: plan.installmentAmount,
            frequency: plan.frequency,
            startDate: plan.startDate?.toISOString().split("T")[0] ?? "",
            nextDueDate: plan.nextDueDate?.toISOString().split("T")[0] ?? "",
            status: plan.status?.toLowerCase(),
            company: plan.company?.name ?? "",
            leadAgent: plan.leadAgent?.user?.name ?? "",
            closerAgent: plan.closerAgent?.user?.name ?? "",
            installments: plan.installments.map(inst => ({
                id: inst.id,
                dueDate: inst.dueDate?.toISOString().split("T")[0] ?? "",
                amount: inst.amount,
                paidAmount: inst.paidAmount,
                status: inst.status?.toLowerCase(),
                paidDate: inst.paidDate ? inst.paidDate.toISOString().split("T")[0] : null,
                paymentMethod: inst.paymentMethod ?? "",
            })),
        }));
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
                status: installment.paidAmount + data.amount >= installment.amount ? "PAID" : "PARTIAL",
                paidDate: new Date(),
                paymentMethod: data.paymentMethod,
            },
        });

        // Update plan
        const newPaidAmount = plan.paidAmount + data.amount;
        const completedInstallments = await this.prisma.installment.count({
            where: {
                installmentPlanId: planId,
                status: "PAID",
            },
        });

        // Get next due installment
        const nextInstallment = await this.prisma.installment.findFirst({
            where: {
                installmentPlanId: planId,
                status: { in: ["PENDING", "UPCOMING", "OVERDUE"] },
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
                status: isCompleted ? "COMPLETED" : "ACTIVE",
            },
        });

        await this.notificationService.notifyInstallmentPaymentRecorded({
            planId,
            installmentId,
            paidAmount: data.amount,
            paymentMethod: data.paymentMethod,
            buyerName: plan.buyerName,
            assetName: plan.asset?.name,
        });

        return updatedInstallment;
    }

    async sendPaymentReminder(data: {
        installmentId: string;
        reminderDate: string;
        method: string;
    }) {
        // FIX 34: use installmentPlan relation (not plan)
        const installment = await this.prisma.installment.findUnique({
            where: { id: data.installmentId },
            include: {
                installmentPlan: {
                    include: {
                        asset: { select: { name: true } },
                        leadAgent: { include: { user: { select: { name: true, email: true } } } },
                    },
                },
            },
        });

        if (!installment) {
            throw new NotFoundException(`Installment with ID ${data.installmentId} not found`);
        }

        // In production, this would send actual email/SMS
        const agentEmail = installment.installmentPlan?.leadAgent?.user?.email || 'unknown';
        console.log(`Sending ${data.method} reminder for asset "${installment.installmentPlan?.asset?.name}" to agent ${agentEmail}`);

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
            this.prisma.installmentPlan.count({ where: { status: "ACTIVE" } }),
            this.prisma.installmentPlan.count({ where: { status: "COMPLETED" } }),
            this.prisma.installmentPlan.aggregate({
                where: { status: "ACTIVE" },
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
                where: { status: "OVERDUE" },
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
                status: { in: ["PENDING", "UPCOMING"] },
            },
            data: {
                status: "OVERDUE",
            },
        });

        // Update upcoming to pending (7 days before due)
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);

        await this.prisma.installment.updateMany({
            where: {
                dueDate: { lte: weekFromNow, gte: today },
                status: "UPCOMING",
            },
            data: {
                status: "PENDING",
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
                status: i === 0 ? "PENDING" : "UPCOMING",
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