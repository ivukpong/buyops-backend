import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller('investments')
export class InvestmentsController {
  constructor(private svc: InvestmentsService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('INVESTOR')
  @Get('me')
  async myInvestments(@Req() req: any) {
    return this.svc.findByUser(req.user.id);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('INVESTOR')
  @Get('summary')
  async summary(@Req() req: any) {
    return this.svc.getInvestmentSummary(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async all() {
    return this.svc.findAll();
  }
}
