import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";

class CreateSaleDto {
  productId!: string;
  quantity!: number;
  total!: number;
}

@Controller("sales")
export class SalesController {
  constructor(private svc: SalesService) { }

  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles("SALES")
  @Post()
  async create(@Req() req: any, @Body() body: CreateSaleDto) {
    const userId = req.user.id;
    return this.svc.create(userId, body);
  }

  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles("SALES")
  @Get("me")
  async mySales(@Req() req: any) {
    return this.svc.findByUser(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles("ADMIN")
  @Get()
  async all() {
    return this.svc.findAll();
  }
}
