import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { PublicController } from './public.controller';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [AssetsController, PublicController],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule { }


