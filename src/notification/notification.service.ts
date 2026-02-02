import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from './sms.service';
import { getSmsTemplate } from './sms-templates';
import { getInAppTemplate } from './in-app-templates';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private smsService: SmsService,
  ) {}

    // Notifies user(s) that an installment is due soon
  async notifyInstallmentDue(installmentId: string) {
    // TODO: Implement actual notification logic
    // For now, just log or return a stub
    console.log(`Installment ${installmentId} is due soon.`);
    return { message: `Installment ${installmentId} is due soon.` };
  }

  // Notifies user(s) that an installment is overdue
  async notifyInstallmentOverdue(installmentId: string) {
    // TODO: Implement actual notification logic
    // For now, just log or return a stub
    console.log(`Installment ${installmentId} is overdue.`);
    return { message: `Installment ${installmentId} is overdue.` };
  }

  async findByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async create(data: { userId: string; title: string; message: string; type?: string }) {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: (data.type as any) || 'INFO',
      },
    });
  }

  // FIX 6: use leadAgent / closerAgent relations (not transaction.agent)
  async notifyDealCreated(transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        asset: true,
        buyer: true,
        leadAgent: { include: { user: true } },
        closerAgent: { include: { user: true } },
      },
    });
    if (!transaction) return;

    const assetName = transaction.asset?.name || 'an asset';

    await this.prisma.notification.create({
      data: {
        userId: transaction.buyerId,
        title: 'New Deal Created',
        message: `Your deal for "${assetName}" worth ₦${transaction.totalAmount.toLocaleString()} has been created.`,
        type: 'SUCCESS',
      },
    });

    if (transaction.leadAgent?.user) {
      await this.prisma.notification.create({
        data: {
          userId: transaction.leadAgent.user.id,
          title: 'Deal Created on Your Lead',
          message: `A deal for "${assetName}" worth ₦${transaction.totalAmount.toLocaleString()} has been created.`,
          type: 'INFO',
        },
      });
    }

    if (transaction.closerAgent?.user) {
      await this.prisma.notification.create({
        data: {
          userId: transaction.closerAgent.user.id,
          title: 'New Deal Assigned',
          message: `A deal for "${assetName}" worth ₦${transaction.totalAmount.toLocaleString()} has been assigned to you.`,
          type: 'INFO',
        },
      });
    }
  }

  // FIX 7: use installmentPlans relation for due-date info (not installmentDuration)
  async notifyDealPaymentReady(transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { asset: true, buyer: true, installmentPlans: true },
    });
    if (!transaction) return;

    const plan = transaction.installmentPlans?.[0];
    const dueDate = plan?.nextDueDate
      ? plan.nextDueDate.toLocaleDateString('en-US', { dateStyle: 'medium' })
      : 'the next due date';
    const installmentAmount = plan?.installmentAmount || 0;

    await this.prisma.notification.create({
      data: {
        userId: transaction.buyerId,
        title: 'Payment Due',
        message: `Your next installment of ₦${installmentAmount.toLocaleString()} for "${transaction.asset?.name || 'an asset'}" is due on ${dueDate}.`,
        type: 'WARNING',
      },
    });
  }

  // FIX 8: use leadAgent?.user?.id and commissionPaymentStatus
  async notifyDealClosed(transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        asset: true,
        buyer: true,
        leadAgent: { include: { user: true } },
        closerAgent: { include: { user: true } },
      },
    });
    if (!transaction) return;

    const assetName = transaction.asset?.name || 'an asset';

    await this.prisma.notification.create({
      data: {
        userId: transaction.buyerId,
        title: 'Deal Closed',
        message: `Your deal for "${assetName}" has been closed successfully.`,
        type: 'SUCCESS',
      },
    });

    if (transaction.leadAgent?.user) {
      await this.prisma.notification.create({
        data: {
          userId: transaction.leadAgent.user.id,
          title: 'Deal Closed',
          message: `The deal for "${assetName}" has been closed. Commission status: ${transaction.commissionPaymentStatus}.`,
          type: 'SUCCESS',
        },
      });
    }

    if (transaction.closerAgent?.user) {
      await this.prisma.notification.create({
        data: {
          userId: transaction.closerAgent.user.id,
          title: 'Deal Closed',
          message: `The deal for "${assetName}" you closed has been finalised. Commission status: ${transaction.commissionPaymentStatus}.`,
          type: 'SUCCESS',
        },
      });
    }
  }

  // FIX 9: template helpers use imported functions (no more require())
  getEmailTemplate(type: string, data: any): string {
    const subject = type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return `<h2>${subject}</h2><p>${data.message || getSmsTemplate(type, data)}</p>`;
  }

  getSmsTemplate(type: string, data: any): string {
    return getSmsTemplate(type, data);
  }

  getInAppTemplate(type: string, data: any): { title: string; message: string } {
    return getInAppTemplate(type, data);
  }
}
