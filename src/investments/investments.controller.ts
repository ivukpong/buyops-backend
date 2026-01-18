import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { InvestmentsService } from "./investments.service";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";

class CreateInvestmentDto {
  amount!: number;
  note?: string;
}

@Controller("investments")
export class InvestmentsController {
  constructor(private svc: InvestmentsService) { }

  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles("INVESTOR")
  @Post()
  async create(@Req() req: any, @Body() body: CreateInvestmentDto) {
    const userId = req.user.id;
    return this.svc.create(userId, body);
  }

  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles("INVESTOR")
  @Get("me")
  async myInvestments(@Req() req: any) {
    return this.svc.findByUser(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles("ADMIN")
  @Get()
  async all() {
    return this.svc.findAll();
  }
}
