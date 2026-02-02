import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller('sales')
export class SalesController {
  constructor(private svc: SalesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INVESTOR', 'USER')
  @Get('me')
  async mySales(@Req() req: any) {
    return this.svc.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async all() {
    return this.svc.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('summary')
  async summary() {
    return this.svc.getSalesSummary();
  }
}
