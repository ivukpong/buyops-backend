// Quick manual notification trigger script
// Run this from NestJS CLI or create a test endpoint

import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { NotificationService } from './src/notification/notification.service';
import { PrismaService } from './src/prisma/prisma.service';

async function triggerNotifications() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const notificationService = app.get(NotificationService);
    const prismaService = app.get(PrismaService);

    console.log('🔔 Triggering manual notifications to ivukpong@gmail.com / +2348107758678\n');

    // Get first asset for testing
    const asset = await prismaService.asset.findFirst();
    const assetId = asset?.id;

    // Get test user
    const user = await prismaService.user.findUnique({
        where: { email: 'ivukpong@gmail.com' }
    });

    if (!user) {
        console.log('❌ Test user not found');
        return;
    }

    // Test commission notifications
    const transactions = await prismaService.transaction.findMany({
        where: { status: 'COMPLETED' },
        take: 2
    });

    if (transactions.length > 0) {
        const txIds = transactions.map(t => t.id);

        console.log('📧 Sending COMMISSION_SENT notification...');
        await notificationService.notifyCommissionSent(txIds);

        console.log('📧 Sending COMMISSION_PAID notification...');
        await notificationService.notifyCommissionsPaid(txIds, 'test-batch.csv');
    }

    // Test installment plan notifications
    const installmentPlan = await prismaService.installmentPlan.findFirst({
        where: { buyerEmail: 'ivukpong@gmail.com' }
    });

    if (installmentPlan) {
        const installment = await prismaService.installment.findFirst({
            where: { installmentPlanId: installmentPlan.id }
        });

        if (installment) {
            console.log('📧 Sending INSTALLMENT_DUE notification...');
            await notificationService.notifyInstallmentDue(installment.id);

            console.log('📧 Sending INSTALLMENT_OVERDUE notification...');
            await notificationService.notifyInstallmentOverdue(installment.id);
        }
    }

    console.log('\n✅ All manual notifications triggered!');
    console.log('📬 Check:');
    console.log('  - Email: ivukpong@gmail.com');
    console.log('  - Phone: +2348107758678');
    console.log('  - Database notifications table');

    await app.close();
}

triggerNotifications().catch(console.error);
