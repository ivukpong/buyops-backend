import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationService } from './notification.service';

/**
 * Manual notification trigger endpoints used for testing and admin actions.
 * Base path is /notification (singular) to distinguish from the user-facing
 * /notifications (plural) controller.
 */
@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationTriggersController {
  constructor(private notificationService: NotificationService) {}

  @Post('installment-due/:id')
  async triggerInstallmentDue(@Param('id') id: string) {
    return this.notificationService.notifyInstallmentDue(id);
  }

  @Post('installment-overdue/:id')
  async triggerInstallmentOverdue(@Param('id') id: string) {
    return this.notificationService.notifyInstallmentOverdue(id);
  }

  @Post('commissions-sent')
  async triggerCommissionsSent(@Body() body: { transactionIds: string[] }) {
    return this.notificationService.notifyCommissionSent(body.transactionIds || []);
  }

  @Post('commissions-paid')
  async triggerCommissionsPaid(@Body() body: { transactionIds: string[]; fileName?: string }) {
    return this.notificationService.notifyCommissionsPaid(body.transactionIds || [], body.fileName);
  }
}
