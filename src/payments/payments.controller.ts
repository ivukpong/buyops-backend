import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import {
    IsEmail,
    IsIn,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentsService, PaymentProvider } from './payments.service';

class InitializePaymentDto {
    @IsIn(['paystack', 'flutterwave'])
    provider!: PaymentProvider;

    @IsEmail()
    email!: string;

    @IsNumber()
    @Min(1)
    amount!: number;

    @IsOptional()
    @IsString()
    currency?: string;

    @IsOptional()
    @IsString()
    callbackUrl?: string;

    @IsOptional()
    @IsString()
    reference?: string;

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;

    @IsOptional()
    @IsString()
    title?: string;
}

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Get('providers')
    getProviders() {
        return this.paymentsService.getProviderConfig();
    }

    @Post('initialize')
    initializePayment(@Body(new ValidationPipe({ transform: true })) payload: InitializePaymentDto) {
        return this.paymentsService.initializePayment(payload);
    }

    @Get('verify')
    verifyPayment(
        @Query('provider') provider: PaymentProvider,
        @Query('reference') reference: string,
    ) {
        return this.paymentsService.verifyPayment(provider, reference);
    }
}
