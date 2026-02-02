import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards
} from "@nestjs/common";
import { InstallmentsService } from "./installments.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";

class CreateInstallmentPlanDto {
    buyerName!: string;
    buyerEmail!: string;
    buyerPhone!: string;
    assetId!: string;
    totalAmount!: number;
    downPayment!: number;
    numberOfInstallments!: number;
    frequency!: string;
    startDate!: string;
    leadAgentId!: string;
    closerAgentId!: string;
    companyId!: string;
}

class SendReminderDto {
    installmentId!: string;
    reminderDate!: string;
    method!: string;
}

@Controller("installments")
export class InstallmentsController {
    constructor(private installmentsService: InstallmentsService) { }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get()
    async findAll(@Query("status") status?: string) {
        return this.installmentsService.findAll({ status });
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get("stats")
    async getStats() {
        return this.installmentsService.getStats();
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.installmentsService.findById(id);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get(":id/schedule")
    async getSchedule(@Param("id") id: string) {
        return this.installmentsService.getInstallmentSchedule(id);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Post()
    async create(@Body() dto: CreateInstallmentPlanDto) {
        return this.installmentsService.create(dto);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Post("reminders/send")
    async sendReminder(@Body() dto: SendReminderDto) {
        return this.installmentsService.sendPaymentReminder(dto);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Put(":id/installments/:installmentId/pay")
    async recordPayment(
        @Param("id") id: string,
        @Param("installmentId") installmentId: string,
        @Body() body: { amount: number; paymentMethod: string }
    ) {
        return this.installmentsService.recordPayment(id, installmentId, body);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN", "SALES")
    @Get("upcoming")
    async getUpcoming() {
        return this.installmentsService.findAll({ status: "upcoming" });
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN", "SALES")
    @Get("overdue")
    async getOverdue() {
        return this.installmentsService.findAll({ status: "overdue" });
    }
}