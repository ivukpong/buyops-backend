import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'ivukpong@gmail.com' } });
  console.log('Test user:', user?.id, user?.role, user?.status);
  
  const tx = await prisma.transaction.findFirst({ orderBy: { createdAt: 'desc' } });
  console.log('Latest tx:', tx?.id, 'paymentType:', tx?.paymentType, 'buyerId:', tx?.buyerId);
  
  // Try to create a test notification for the buyer
  if (user?.id) {
    try {
      const notif = await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Test',
          message: 'Test notification',
          type: 'SUCCESS',
        },
      });
      console.log('Notification created OK:', notif.id);
      await prisma.notification.delete({ where: { id: notif.id } });
      console.log('Notification deleted OK');
    } catch (e: any) {
      console.error('NOTIFICATION CREATE FAILED:', e.message);
    }
  }

  // Test createMany for ADMIN users (like notifyUsersByRoles does)
  try {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'TEAM_LEAD', 'AGENT'] as any } },
      select: { id: true },
    });
    console.log('Admin/team users found:', admins.length);
    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map(u => ({
          userId: u.id,
          title: 'Test Admin Notif',
          message: 'Test message',
          type: 'INFO' as any,
        })),
      });
      console.log('createMany OK');
    }
  } catch (e: any) {
    console.error('createMany FAILED:', e.message);
  }
  
  await prisma.$disconnect();
}

main().catch(e => console.error('MAIN ERROR:', e.message));
