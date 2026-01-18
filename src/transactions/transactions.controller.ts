import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { TransactionsService } from "./transactions.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";

class CreateTransactionDto {
    assetId!: string;
    buyerId!: string;
    leadAgentId!: string;
    closerAgentId!: string;
    companyId!: string;
    amount!: number;
    paymentType!: string;
    leadCommission!: number;
    closerCommission!: number;
    totalCommission!: number;
    status!: string;
}

class SendCommissionsDto {
    transactionIds!: string[];
}

@Controller("transactions")
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) { }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Get()
    async findAll(@Query("month") month?: string) {
        return this.transactionsService.findAll({ month });
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Get("stats")
    async getStats() {
        return this.transactionsService.getStats();
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Get("commissions/unpaid")
    async getUnpaidCommissions(@Query("month") month?: string) {
        return this.transactionsService.getUnpaidCommissions({ month });
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Get("commissions/paid")
    async getPaidCommissions(@Query("month") month?: string) {
        return this.transactionsService.getPaidCommissions({ month });
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.transactionsService.findById(id);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Post()
    async create(@Body() dto: CreateTransactionDto) {
        return this.transactionsService.create(dto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Post("commissions/send")
    async sendCommissions(@Body() dto: SendCommissionsDto) {
        return this.transactionsService.sendCommissionsForPayment(dto.transactionIds);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Post("commissions/payment-proof")
    @UseInterceptors(FileInterceptor("file"))
    async uploadPaymentProof(@UploadedFile() file: Express.Multer.File) {
        return this.transactionsService.uploadPaymentProof(file);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: Partial<CreateTransactionDto>) {
        return this.transactionsService.update(id, dto);
    }
}