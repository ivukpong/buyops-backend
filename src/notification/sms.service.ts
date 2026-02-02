import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Twilio from 'twilio';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly twilioClient: Twilio.Twilio;
  private readonly fromPhone: string;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.fromPhone = this.configService.get<string>('TWILIO_PHONE_NUMBER');
    this.twilioClient = new Twilio.Twilio(accountSid, authToken);
  }

  async sendSms({ to, message }: { to: string; message: string }): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body: message,
        from: this.fromPhone,
        to,
      });
      this.logger.log(`SMS sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}: ${error.message}`);
      throw error;
    }
  }
}