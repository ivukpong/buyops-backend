import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseGuards
} from "@nestjs/common";
import { IsString, IsNumber, IsOptional, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { InstallmentsService } from "./installments.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";

class CreateInstallmentPlanDto {
    @IsString()
    @IsOptional()
    buyerName?: string;

    @IsEmail()
    @IsOptional()
    buyerEmail?: string;

    @IsString()
    @IsOptional()
    buyerPhone?: string;

    @IsString()
    assetId!: string;

    @IsNumber()
    @Type(() => Number)
    totalAmount!: number;

    @IsNumber()
    @Type(() => Number)
    downPayment!: number;

    @IsNumber()
    @Type(() => Number)
    numberOfInstallments!: number;

    @IsString()
    frequency!: string;

    @IsString()
    startDate!: string;

    @IsString()
    leadAgentId!: string;

    @IsString()
    @IsOptional()
    closerAgentId?: string;

    @IsString()
    companyId!: string;

    @IsString()
    @IsOptional()
    transactionId?: string;
}

class SendReminderDto {
    @IsString()
    installmentId!: string;

    @IsString()
    reminderDate!: string;

    @IsString()
    method!: string;
}

class UpdatePlanStatusDto {
    @IsString()
    status!: string;
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

    // Shorthand: POST /installments/:installmentId/payments
    // maps to the same recordPayment logic using the installment's planId
    @Post(":installmentId/payments")
    async recordPaymentShorthand(
        @Param("installmentId") installmentId: string,
        @Body() body: { amount: number; paymentMethod: string }
    ) {
        return this.installmentsService.recordPaymentByInstallmentId(installmentId, body);
    }

    // PATCH /installments/plans/:id — update plan status
    @Patch("plans/:id")
    async updatePlanStatus(
        @Param("id") id: string,
        @Body() dto: UpdatePlanStatusDto
    ) {
        return this.installmentsService.updatePlanStatus(id, dto.status);
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