import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from './sms.service';
import { EmailService } from './email.service';
import { getSmsTemplate } from './sms-templates';
import { getInAppTemplate } from './in-app-templates';
import { EmailTemplates } from './email-templates';

const ADMIN_AND_SALES_ROLES = ['ADMIN', 'TEAM_LEAD', 'AGENT'] as const;

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private prisma: PrismaService,
    private smsService: SmsService,
    private emailService: EmailService,
  ) { }

  private async sendSmsNotification(options: {
    phone?: string | null;
    templateType: string;
    data: any;
  }) {
    if (!options.phone) {
      return;
    }

    const message = getSmsTemplate(options.templateType, options.data);

    try {
      await this.smsService.sendSms({
        to: options.phone,
        message,
      });
    } catch (error) {
      this.logger.warn(
        `SMS notification failed for ${options.phone}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async notifyUsersByRoles(options: {
    roles: string[];
    title: string;
    message: string;
    type?: string;
  }) {
    const users = await this.prisma.user.findMany({
      where: { role: { in: options.roles as any } },
      select: { id: true },
    });

    if (!users.length) {
      return;
    }

    await this.prisma.notification.createMany({
      data: users.map((user) => ({
        userId: user.id,
        title: options.title,
        message: options.message,
        type: (options.type as any) || 'INFO',
      })),
    });
  }

  private async getUsersByRolesWithContact(roles: string[]) {
    return this.prisma.user.findMany({
      where: { role: { in: roles as any } },
      select: { id: true, email: true, name: true },
    });
  }

  async notifyAdminAndSales(options: {
    title: string;
    message: string;
    type?: string;
  }) {
    await this.notifyUsersByRoles({
      roles: [...ADMIN_AND_SALES_ROLES],
      title: options.title,
      message: options.message,
      type: options.type,
    });
  }

  async notifyCommissionSent(transactionIds: string[]) {
    if (!transactionIds.length) return;

    await this.notifyAdminAndSales({
      title: 'Commissions Sent for Payment',
      message: `${transactionIds.length} deal commission(s) have been marked as SENT for payment processing.`,
      type: 'INFO',
    });
  }

  async notifyCommissionsPaid(transactionIds: string[], fileName?: string) {
    if (!transactionIds.length) return;

    await this.notifyAdminAndSales({
      title: 'Commissions Marked Paid',
      message: `${transactionIds.length} deal commission(s) have been marked as PAID${fileName ? ` via ${fileName}` : ''}.`,
      type: 'SUCCESS',
    });
  }

  async notifyInstallmentPaymentRecorded(options: {
    planId: string;
    installmentId: string;
    paidAmount: number;
    paymentMethod: string;
    buyerName?: string | null;
    assetName?: string | null;
  }) {
    await this.notifyAdminAndSales({
      title: 'Installment Payment Recorded',
      message: `Payment of ₦${options.paidAmount.toLocaleString()} was recorded for ${options.buyerName || 'a buyer'} on ${options.assetName || 'an asset'} via ${options.paymentMethod}.`,
      type: 'SUCCESS',
    });

    const plan = await this.prisma.installmentPlan.findUnique({
      where: { id: options.planId },
      include: {
        asset: { select: { name: true } },
      },
    });

    if (plan?.buyerEmail) {
      await this.sendEmail({
        to: plan.buyerEmail,
        templateType: 'PAYMENT_RECEIVED',
        data: {
          amount: options.paidAmount,
          reference: options.installmentId,
          assetName: plan.asset?.name,
        },
        recipient: {
          name: plan.buyerName || 'Investor',
          email: plan.buyerEmail,
        },
      });
    }

    if (plan && plan.status?.toUpperCase() === 'COMPLETED') {
      await this.notifyInstallmentPlanCompleted(plan.id);
    }
  }

  // Notifies user(s) that an installment is due soon
  async notifyInstallmentDue(installmentId: string) {
    const installment = await this.prisma.installment.findUnique({
      where: { id: installmentId },
      include: {
        installmentPlan: {
          include: {
            asset: { select: { name: true } },
            leadAgent: { include: { user: { select: { id: true } } } },
            closerAgent: { include: { user: { select: { id: true } } } },
          },
        },
      },
    });

    if (!installment) {
      return { message: `Installment ${installmentId} not found.` };
    }

    const dueDate = installment.dueDate.toLocaleDateString('en-US', { dateStyle: 'medium' });
    const message = `Installment of ₦${installment.amount.toLocaleString()} for "${installment.installmentPlan?.asset?.name || 'an asset'}" is due on ${dueDate}.`;

    const recipients = [
      installment.installmentPlan?.leadAgent?.user?.id,
      installment.installmentPlan?.closerAgent?.user?.id,
    ].filter(Boolean) as string[];

    if (recipients.length) {
      await this.prisma.notification.createMany({
        data: recipients.map((userId) => ({
          userId,
          title: 'Installment Due Reminder',
          message,
          type: 'WARNING',
        })),
      });
    }

    await this.notifyAdminAndSales({
      title: 'Installment Due Reminder',
      message,
      type: 'WARNING',
    });

    const buyerEmail = installment.installmentPlan?.buyerEmail;
    const buyerName = installment.installmentPlan?.buyerName || 'Investor';

    if (buyerEmail) {
      await this.sendEmail({
        to: buyerEmail,
        templateType: 'INSTALLMENT_DUE',
        data: {
          amount: installment.amount,
          dueDate: installment.dueDate,
        },
        recipient: { name: buyerName, email: buyerEmail },
      });

      const buyerUser = await this.prisma.user.findUnique({
        where: { email: buyerEmail },
        select: { id: true },
      });

      if (buyerUser?.id) {
        await this.prisma.notification.create({
          data: {
            userId: buyerUser.id,
            title: 'Installment Due Reminder',
            message,
            type: 'WARNING',
          },
        });
      }
    }

    return { message: `Installment ${installmentId} is due soon.` };
  }

  // Notifies user(s) that an installment is overdue
  async notifyInstallmentOverdue(installmentId: string) {
    const installment = await this.prisma.installment.findUnique({
      where: { id: installmentId },
      include: {
        installmentPlan: {
          include: {
            asset: { select: { name: true } },
            leadAgent: { include: { user: { select: { id: true } } } },
            closerAgent: { include: { user: { select: { id: true } } } },
          },
        },
      },
    });

    if (!installment) {
      return { message: `Installment ${installmentId} not found.` };
    }

    const dueDate = installment.dueDate.toLocaleDateString('en-US', { dateStyle: 'medium' });
    const message = `Installment of ₦${installment.amount.toLocaleString()} for "${installment.installmentPlan?.asset?.name || 'an asset'}" is overdue since ${dueDate}.`;

    const recipients = [
      installment.installmentPlan?.leadAgent?.user?.id,
      installment.installmentPlan?.closerAgent?.user?.id,
    ].filter(Boolean) as string[];

    if (recipients.length) {
      await this.prisma.notification.createMany({
        data: recipients.map((userId) => ({
          userId,
          title: 'Installment Overdue',
          message,
          type: 'ERROR',
        })),
      });
    }

    await this.notifyAdminAndSales({
      title: 'Installment Overdue',
      message,
      type: 'ERROR',
    });

    const buyerEmail = installment.installmentPlan?.buyerEmail;
    const buyerName = installment.installmentPlan?.buyerName || 'Investor';

    if (buyerEmail) {
      await this.sendEmail({
        to: buyerEmail,
        templateType: 'INSTALLMENT_OVERDUE',
        data: {
          amount: installment.amount,
          dueDate: installment.dueDate,
        },
        recipient: { name: buyerName, email: buyerEmail },
      });

      const buyerUser = await this.prisma.user.findUnique({
        where: { email: buyerEmail },
        select: { id: true },
      });

      if (buyerUser?.id) {
        await this.prisma.notification.create({
          data: {
            userId: buyerUser.id,
            title: 'Installment Overdue',
            message,
            type: 'ERROR',
          },
        });
      }
    }

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
    const adminUsers = await this.getUsersByRolesWithContact(['ADMIN']);

    await this.prisma.notification.create({
      data: {
        userId: transaction.buyerId,
        title: 'New Deal Created',
        message: `Your deal for "${assetName}" worth ₦${transaction.totalAmount.toLocaleString()} has been created.`,
        type: 'SUCCESS',
      },
    });

    await this.sendSmsNotification({
      phone: transaction.buyer?.phone,
      templateType: 'deal_created',
      data: {
        assetName,
        totalAmount: transaction.totalAmount,
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

      await this.sendSmsNotification({
        phone: transaction.leadAgent.user.phone,
        templateType: 'deal_created',
        data: {
          assetName,
          totalAmount: transaction.totalAmount,
        },
      });

      if (transaction.leadAgent.user.email) {
        await this.sendEmail({
          to: transaction.leadAgent.user.email,
          templateType: 'DEAL_CREATED',
          data: {
            dealId: transaction.id,
            agentName: transaction.leadAgent.user.name,
            assetName,
          },
          recipient: {
            name: transaction.leadAgent.user.name || 'Agent',
            email: transaction.leadAgent.user.email,
          },
        });
      }
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

      await this.sendSmsNotification({
        phone: transaction.closerAgent.user.phone,
        templateType: 'deal_created',
        data: {
          assetName,
          totalAmount: transaction.totalAmount,
        },
      });

      if (transaction.closerAgent.user.email) {
        await this.sendEmail({
          to: transaction.closerAgent.user.email,
          templateType: 'DEAL_CREATED',
          data: {
            dealId: transaction.id,
            agentName: transaction.closerAgent.user.name,
            assetName,
          },
          recipient: {
            name: transaction.closerAgent.user.name || 'Agent',
            email: transaction.closerAgent.user.email,
          },
        });
      }
    }

    for (const admin of adminUsers) {
      await this.sendEmail({
        to: admin.email,
        templateType: 'DEAL_CREATED',
        data: {
          dealId: transaction.id,
          agentName: transaction.leadAgent?.user?.name || transaction.closerAgent?.user?.name || 'Agent',
          assetName,
        },
        recipient: {
          name: admin.name || 'Admin',
          email: admin.email,
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

    await this.sendSmsNotification({
      phone: transaction.buyer?.phone,
      templateType: 'payment_ready',
      data: {
        installmentAmount,
        dueDate,
      },
    });

    const adminsAndAgents = await this.getUsersByRolesWithContact(['ADMIN', 'TEAM_LEAD', 'AGENT']);
    for (const recipient of adminsAndAgents) {
      await this.sendEmail({
        to: recipient.email,
        templateType: 'DEAL_PAYMENT_READY',
        data: {
          dealId: transaction.id,
          amount: transaction.totalAmount,
          paymentType: transaction.paymentType || 'installment',
        },
        recipient: {
          name: recipient.name || 'User',
          email: recipient.email,
        },
      });
    }
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
    const adminsAndAgents = await this.getUsersByRolesWithContact(['ADMIN', 'TEAM_LEAD', 'AGENT']);

    await this.prisma.notification.create({
      data: {
        userId: transaction.buyerId,
        title: 'Deal Closed',
        message: `Your deal for "${assetName}" has been closed successfully.`,
        type: 'SUCCESS',
      },
    });

    await this.sendSmsNotification({
      phone: transaction.buyer?.phone,
      templateType: 'deal_closed',
      data: {
        assetName,
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

      await this.sendSmsNotification({
        phone: transaction.leadAgent.user.phone,
        templateType: 'deal_closed',
        data: {
          assetName,
        },
      });

      if (transaction.leadAgent.user.email) {
        await this.sendEmail({
          to: transaction.leadAgent.user.email,
          templateType: 'DEAL_CLOSED',
          data: {
            dealId: transaction.id,
            assetName,
            commissionStatus: transaction.commissionPaymentStatus,
          },
          recipient: {
            name: transaction.leadAgent.user.name || 'Agent',
            email: transaction.leadAgent.user.email,
          },
        });
      }
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

      await this.sendSmsNotification({
        phone: transaction.closerAgent.user.phone,
        templateType: 'deal_closed',
        data: {
          assetName,
        },
      });

      if (transaction.closerAgent.user.email) {
        await this.sendEmail({
          to: transaction.closerAgent.user.email,
          templateType: 'DEAL_CLOSED',
          data: {
            dealId: transaction.id,
            assetName,
            commissionStatus: transaction.commissionPaymentStatus,
          },
          recipient: {
            name: transaction.closerAgent.user.name || 'Agent',
            email: transaction.closerAgent.user.email,
          },
        });
      }
    }

    for (const recipient of adminsAndAgents) {
      await this.sendEmail({
        to: recipient.email,
        templateType: 'DEAL_CLOSED',
        data: {
          dealId: transaction.id,
          assetName,
          commissionStatus: transaction.commissionPaymentStatus,
        },
        recipient: {
          name: recipient.name || 'User',
          email: recipient.email,
        },
      });
    }
  }

  async notifyAssetPublished(assetId: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
      include: { company: { select: { name: true } } },
    });
    if (!asset) return;

    const message = `Asset "${asset.name}" has been published and is now live.`;
    await this.notifyAdminAndSales({
      title: 'Asset Published',
      message,
      type: 'SUCCESS',
    });

    const recipients = await this.getUsersByRolesWithContact(['ADMIN', 'TEAM_LEAD', 'AGENT']);
    for (const recipient of recipients) {
      await this.sendEmail({
        to: recipient.email,
        templateType: 'ASSET_PUBLISHED',
        data: {
          assetName: asset.name,
          companyName: asset.company?.name || 'BuyOps',
        },
        recipient: {
          name: recipient.name || 'User',
          email: recipient.email,
        },
      });
    }
  }

  async notifyAssetUpdated(assetId: string, updatedFields: string[]) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
      select: { id: true, name: true },
    });
    if (!asset) return;

    const summary = updatedFields.join(', ');
    const message = `Asset "${asset.name}" has been updated (${summary}).`;

    await this.notifyAdminAndSales({
      title: 'Asset Updated',
      message,
      type: 'INFO',
    });

    const recipients = await this.getUsersByRolesWithContact(['ADMIN', 'TEAM_LEAD', 'AGENT']);
    for (const recipient of recipients) {
      await this.sendEmail({
        to: recipient.email,
        templateType: 'ASSET_UPDATED',
        data: {
          assetName: asset.name,
          updatedFields: summary,
        },
        recipient: {
          name: recipient.name || 'User',
          email: recipient.email,
        },
      });
    }
  }

  async notifyNewLeadFromInvestor(leadId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        asset: { select: { name: true } },
      },
    });
    if (!lead) return;

    const message = `New investor lead "${lead.name}" created for ${lead.asset?.name || 'an asset'}.`;

    await this.notifyUsersByRoles({
      roles: ['ADMIN'],
      title: 'New Investor Lead',
      message,
      type: 'INFO',
    });

    const admins = await this.getUsersByRolesWithContact(['ADMIN']);
    for (const admin of admins) {
      await this.sendEmail({
        to: admin.email,
        templateType: 'NEW_LEAD_FROM_INVESTOR',
        data: {
          leadName: lead.name,
          assetName: lead.asset?.name || 'N/A',
          budget: lead.budget || 0,
        },
        recipient: {
          name: admin.name || 'Admin',
          email: admin.email,
        },
      });
    }
  }

  async notifyLeadAssignedToCluster(leadIds: string[], clusterId: string) {
    if (!leadIds.length) return;

    const [cluster, leads] = await Promise.all([
      this.prisma.cluster.findUnique({
        where: { id: clusterId },
        select: { id: true, name: true },
      }),
      this.prisma.lead.findMany({
        where: { id: { in: leadIds } },
        include: { asset: { select: { name: true } } },
      }),
    ]);

    const teamLeads = await this.prisma.user.findMany({
      where: {
        role: 'TEAM_LEAD',
        managedClusters: { some: { id: clusterId } },
      },
      select: { id: true, email: true, name: true },
    });

    const recipients = teamLeads.length
      ? teamLeads
      : await this.getUsersByRolesWithContact(['TEAM_LEAD']);

    for (const lead of leads) {
      const message = `Lead "${lead.name}" has been assigned to cluster ${cluster?.name || 'N/A'}.`;

      if (recipients.length) {
        await this.prisma.notification.createMany({
          data: recipients.map((recipient) => ({
            userId: recipient.id,
            title: 'Lead Assigned to Cluster',
            message,
            type: 'INFO',
          })),
        });
      }

      for (const recipient of recipients) {
        await this.sendEmail({
          to: recipient.email,
          templateType: 'LEAD_ASSIGNED_TO_CLUSTER',
          data: {
            leadName: lead.name,
            clusterName: cluster?.name || 'N/A',
          },
          recipient: {
            name: recipient.name || 'Team Lead',
            email: recipient.email,
          },
        });
      }
    }
  }

  async notifyLeadAvailableToAll(leadIds: string[]) {
    if (!leadIds.length) return;

    const [leads, agents] = await Promise.all([
      this.prisma.lead.findMany({
        where: { id: { in: leadIds } },
        include: { asset: { select: { name: true } } },
      }),
      this.getUsersByRolesWithContact(['AGENT']),
    ]);

    for (const lead of leads) {
      const message = `New available lead: ${lead.name} (${lead.asset?.name || 'General interest'}).`;

      if (agents.length) {
        await this.prisma.notification.createMany({
          data: agents.map((agent) => ({
            userId: agent.id,
            title: 'New Lead Available',
            message,
            type: 'INFO',
          })),
        });
      }

      for (const agent of agents) {
        await this.sendEmail({
          to: agent.email,
          templateType: 'LEAD_AVAILABLE_TO_ALL',
          data: {
            leadName: lead.name,
            assetName: lead.asset?.name || 'N/A',
          },
          recipient: {
            name: agent.name || 'Agent',
            email: agent.email,
          },
        });
      }
    }
  }

  async notifyInstallmentPlanCompleted(planId: string) {
    const plan = await this.prisma.installmentPlan.findUnique({
      where: { id: planId },
      include: {
        asset: { select: { name: true } },
      },
    });

    if (!plan || !plan.buyerEmail) {
      return;
    }

    await this.sendEmail({
      to: plan.buyerEmail,
      templateType: 'INSTALLMENT_COMPLETED',
      data: {
        assetName: plan.asset?.name || 'your asset',
        totalPaid: plan.paidAmount,
      },
      recipient: {
        name: plan.buyerName || 'Investor',
        email: plan.buyerEmail,
      },
    });

    const buyerUser = await this.prisma.user.findUnique({
      where: { email: plan.buyerEmail },
      select: { id: true },
    });

    if (buyerUser?.id) {
      await this.prisma.notification.create({
        data: {
          userId: buyerUser.id,
          title: 'Installment Plan Completed',
          message: `Your installment plan for "${plan.asset?.name || 'your asset'}" is fully completed.`,
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

  // Send actual email using EmailService and EmailTemplates
  async sendEmail(options: {
    to: string;
    templateType: string;
    data: any;
    recipient?: { name: string; email: string };
  }) {
    try {
      const template = (EmailTemplates as any)[options.templateType];
      if (!template) {
        console.warn(`Email template not found: ${options.templateType}`);
        return { success: false, message: 'Template not found' };
      }

      const subject = typeof template.subject === 'function'
        ? template.subject(options.data)
        : template.subject;
      const html = typeof template.body === 'function'
        ? template.body(options.data, options.recipient || { name: 'User', email: options.to })
        : template.body;

      await this.emailService.sendEmail({
        to: options.to,
        subject,
        html,
      });

      console.log(`Email sent to ${options.to} for template ${options.templateType}`);
      return { success: true, message: 'Email sent' };
    } catch (error) {
      console.error(`Failed to send email to ${options.to}:`, error);
      return { success: false, message: 'Email sending failed' };
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(user: { id: string; name: string; email: string }, resetToken: string) {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    return this.sendEmail({
      to: user.email,
      templateType: 'PASSWORD_RESET',
      data: { resetLink },
      recipient: { name: user.name, email: user.email },
    });
  }

  // Send agent invitation email
  async sendAgentInvitationEmail(user: { name: string; email: string }, tempPassword: string) {
    const loginLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
    return this.sendEmail({
      to: user.email,
      templateType: 'AGENT_INVITATION',
      data: { tempPassword, loginLink },
      recipient: { name: user.name, email: user.email },
    });
  }

  // Send email verification email
  async sendEmailVerificationEmail(user: { name: string; email: string }, verificationToken: string) {
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
    return this.sendEmail({
      to: user.email,
      templateType: 'EMAIL_VERIFICATION',
      data: { verificationLink },
      recipient: { name: user.name, email: user.email },
    });
  }

  getSmsTemplate(type: string, data: any): string {
    return getSmsTemplate(type, data);
  }

  getInAppTemplate(type: string, data: any): { title: string; message: string } {
    return getInAppTemplate(type, data);
  }
}
