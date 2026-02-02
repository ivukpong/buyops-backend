import { Controller, Get, Put, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private prisma: PrismaService) {}

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
}