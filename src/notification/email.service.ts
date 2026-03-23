import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { MailtrapClient } from 'mailtrap';

type EmailProvider = 'resend' | 'mailtrap';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly provider: EmailProvider;
  private readonly isSandbox = process.env.MAILTRAP_USE_SANDBOX === 'true';
  private resend: Resend | null = null;
  private mailtrap: MailtrapClient | null = null;

  constructor() {
    this.provider = (process.env.EMAIL_PROVIDER as EmailProvider) ?? 'mailtrap';

    if (this.provider === 'resend') {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    } else {
      const sandboxId = this.isSandbox ? Number(process.env.MAILTRAP_INBOX_ID) : undefined;
      this.mailtrap = new MailtrapClient({
        token: process.env.MAILTRAP_API_KEY!,
        sandbox: this.isSandbox,
        testInboxId: sandboxId,
      });
    }

    this.logger.log(
      `EmailService initialised — provider: ${this.provider}` +
        (this.provider === 'mailtrap' ? ` (${this.isSandbox ? 'sandbox' : 'sending API'})` : ''),
    );
  }

  async sendEmail(options: { to: string; subject: string; html: string }) {
    const from = process.env.EMAIL_FROM ?? 'BuyOps <no-reply@buyops.com>';
    const [fromName, fromEmail] = from.includes('<')
      ? [from.split('<')[0].trim(), from.split('<')[1].replace('>', '').trim()]
      : ['BuyOps', from];

    this.logger.log(`Sending email to ${options.to} — subject: "${options.subject}"`);

    try {
      if (this.provider === 'resend') {
        const { data, error } = await this.resend!.emails.send({
          from,
          to: options.to,
          subject: options.subject,
          html: options.html,
        });
        if (error) {
          this.logger.error(`Resend error: ${JSON.stringify(error)}`);
          throw new Error(error.message);
        }
        this.logger.log(`Email delivered via Resend to ${options.to} (id: ${data?.id})`);
      } else {
        // Mailtrap sandbox requires any sender; sending API requires a verified domain
        const senderEmail = this.isSandbox ? 'sandbox@example.com' : fromEmail;
        await this.mailtrap!.send({
          from: { name: fromName, email: senderEmail },
          to: [{ email: options.to }],
          subject: options.subject,
          html: options.html,
        });
        this.logger.log(
          `Email sent via Mailtrap ${this.isSandbox ? '(sandbox)' : '(sending API)'} to ${options.to}`,
        );
      }
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${options.to}: ${err?.message ?? err}`);
      throw err;
    }
  }
}