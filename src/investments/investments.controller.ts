import { Controller, Get, Post, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller('investments')
export class InvestmentsController {
  constructor(private svc: InvestmentsService) { }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myInvestments(@Req() req: any) {
    if (!req.user?.id) {
      throw new UnauthorizedException('Missing or invalid auth token.');
    }
    return this.svc.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  async summary(@Req() req: any) {
    if (!req.user?.id) {
      throw new UnauthorizedException('Missing or invalid auth token.');
    }
    return this.svc.getInvestmentSummary(req.user.id);
  }

  /**
   * POST /investments
   * Called by the investor mobile app after payment is verified.
   * Creates a minimal transaction record linked to the authenticated buyer.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createInvestment(
    @Req() req: any,
    @Body() body: { amount: number; note?: string; assetId?: string },
  ) {
    if (!req.user?.id) {
      throw new UnauthorizedException('Missing or invalid auth token.');
    }
    return this.svc.createInvestorPurchase(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async all() {
    return this.svc.findAll();
  }
}
