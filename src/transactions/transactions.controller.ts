import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionsService } from "./transactions.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";

class CreateTransactionDto {
    @IsString()
    assetId!: string;

    @IsString()
    buyerId!: string;

    @IsString()
    @IsOptional()
    leadAgentId?: string;

    @IsString()
    @IsOptional()
    closerAgentId?: string;

    @IsString()
    @IsOptional()
    companyId?: string;

    @IsNumber()
    @Type(() => Number)
    totalAmount!: number;

    @IsString()
    @IsOptional()
    paymentType?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    leadCommission?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    closerCommission?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    totalCommission?: number;

    @IsString()
    @IsOptional()
    status?: string;
}

class SendCommissionsDto {
    transactionIds!: string[];
}

@Controller("transactions")
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get()
    async findAll(@Query("month") month?: string) {
        return this.transactionsService.findAll({ month });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get("stats")
    async getStats() {
        return this.transactionsService.getStats();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get("commissions/unpaid")
    async getUnpaidCommissions(@Query("month") month?: string) {
        return this.transactionsService.getUnpaidCommissions({ month });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get("commissions/paid")
    async getPaidCommissions(@Query("month") month?: string) {
        return this.transactionsService.getPaidCommissions({ month });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.transactionsService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Post()
    async create(@Body() dto: CreateTransactionDto) {
        return this.transactionsService.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Post("commissions/send")
    async sendCommissions(@Body() dto: SendCommissionsDto) {
        return this.transactionsService.sendCommissionsForPayment(dto.transactionIds);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Post("commissions/payment-proof")
    @UseInterceptors(FileInterceptor("file"))
    async uploadPaymentProof(@UploadedFile() file: Express.Multer.File) {
        return this.transactionsService.uploadPaymentProof(file);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")    @Patch(":id")
    async patch(@Param("id") id: string, @Body() dto: Partial<CreateTransactionDto>) {
        return this.transactionsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: Partial<CreateTransactionDto>) {
        return this.transactionsService.update(id, dto);
    }
}
