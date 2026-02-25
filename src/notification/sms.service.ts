import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Twilio from 'twilio';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly twilioClient: Twilio.Twilio | null;
  private readonly fromPhone: string | null;
  private readonly isConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.fromPhone = this.configService.get<string>('TWILIO_PHONE_NUMBER');

    this.isConfigured = Boolean(accountSid && authToken && this.fromPhone);

    if (!this.isConfigured) {
      this.twilioClient = null;
      this.logger.warn('Twilio SMS is disabled because required environment variables are missing.');
      return;
    }

    this.twilioClient = new Twilio.Twilio(accountSid, authToken);
    this.logger.log('Twilio SMS service initialized.');
  }

  async sendSms({ to, message }: { to: string; message: string }): Promise<boolean> {
    if (!this.isConfigured || !this.twilioClient || !this.fromPhone) {
      this.logger.warn(`SMS send skipped for ${to}: Twilio is not configured.`);
      return false;
    }

    try {
      await this.twilioClient.messages.create({
        body: message,
        from: this.fromPhone,
        to,
      });
      this.logger.log(`SMS sent to ${to}`);
      return true;
    } catch (error) {
      const messageText = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send SMS to ${to}: ${messageText}`);
      throw error;
    }
  }
}