import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from './notification.service';

@Injectable()
export class CronService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  @Cron('0 9 * * *') // Daily at 9 AM
  async sendInstallmentReminders() {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const upcomingInstallments = await this.prisma.installment.findMany({
      where: {
        dueDate: {
          gte: new Date(),
          lte: threeDaysFromNow,
        },
        status: 'PENDING',
      },
    });

    for (const installment of upcomingInstallments) {
      await this.notificationService.notifyInstallmentDue(installment.id);
    }
  }

  @Cron('0 10 * * *') // Daily at 10 AM
  async sendOverdueNotifications() {
    const overdueInstallments = await this.prisma.installment.findMany({
      where: {
        dueDate: { lt: new Date() },
        status: 'PENDING',
      },
    });

    for (const installment of overdueInstallments) {
      await this.notificationService.notifyInstallmentOverdue(installment.id);
      
      // Update status to OVERDUE
      await this.prisma.installment.update({
        where: { id: installment.id },
        data: { status: 'OVERDUE' },
      });
    }
  }
}