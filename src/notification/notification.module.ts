import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './notification.controller';
import { NotificationTriggersController } from './notification-triggers.controller';
import { NotificationService } from './notification.service';
import { SmsService } from './sms.service';
import { EmailService } from './email.service';
import { CronService } from './cron.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [NotificationController, NotificationTriggersController],
  providers: [NotificationService, SmsService, EmailService, CronService],
  exports: [NotificationService],
})
export class NotificationModule {}
