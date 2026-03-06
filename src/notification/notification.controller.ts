import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { UserRole, NotificationType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private prisma: PrismaService) { }

  @Get()
  async getNotifications(@Request() req) {
    return this.prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  @Get('unread')
  async getUnreadCount(@Request() req) {
    const count = await this.prisma.notification.count({
      where: { userId: req.user.id, read: false },
    });
    return { count };
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  @Put('read-all')
  async markAllAsRead(@Request() req) {
    return this.prisma.notification.updateMany({
      where: { userId: req.user.id, read: false },
      data: { read: true },
    });
  }

  @Post('admin')
  async notifyAdmins(
    @Body() body: { title: string; message: string; type?: string },
    @Request() req,
  ) {
    const admins = await this.prisma.user.findMany({
      where: { role: UserRole.ADMIN },
      select: { id: true },
    });
    if (!admins.length) return { message: 'No admin users found', count: 0 };

    const validTypes = Object.values(NotificationType);
    const notifType: NotificationType =
      body.type && validTypes.includes(body.type.toUpperCase() as NotificationType)
        ? (body.type.toUpperCase() as NotificationType)
        : NotificationType.INFO;

    await this.prisma.notification.createMany({
      data: admins.map((admin) => ({
        userId: admin.id,
        title: body.title,
        message: body.message,
        type: notifType,
      })),
    });

    return { message: 'Admin(s) notified successfully', count: admins.length };
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Request() req) {
    // Ensure users can only delete their own notifications
    await this.prisma.notification.deleteMany({
      where: { id, userId: req.user.id },
    });
    return { message: 'Notification deleted' };
  }

  @Delete()
  async deleteAllNotifications(@Request() req) {
    await this.prisma.notification.deleteMany({
      where: { userId: req.user.id },
    });
    return { message: 'All notifications deleted' };
  }
}