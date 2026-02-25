import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type PaymentProvider = 'paystack' | 'flutterwave';

export interface InitializePaymentInput {
    provider: PaymentProvider;
    email: string;
    amount: number;
    currency?: string;
    callbackUrl?: string;
    reference?: string;
    metadata?: Record<string, any>;
    title?: string;
}

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);

    constructor(private readonly configService: ConfigService) { }

    getProviderConfig() {
        const paystackConfigured = Boolean(this.configService.get<string>('PAYSTACK_SECRET_KEY'));
        const flutterwaveConfigured = Boolean(this.configService.get<string>('FLUTTERWAVE_SECRET_KEY'));

        return {
            paystack: {
                configured: paystackConfigured,
                publicKey: this.configService.get<string>('PAYSTACK_PUBLIC_KEY') || null,
            },
            flutterwave: {
                configured: flutterwaveConfigured,
                publicKey: this.configService.get<string>('FLUTTERWAVE_PUBLIC_KEY') || null,
            },
        };
    }

    async initializePayment(payload: InitializePaymentInput) {
        if (payload.provider === 'paystack') {
            return this.initializePaystackPayment(payload);
        }

        return this.initializeFlutterwavePayment(payload);
    }

    async verifyPayment(provider: PaymentProvider, reference: string) {
        if (provider === 'paystack') {
            return this.verifyPaystackPayment(reference);
        }

        return this.verifyFlutterwavePayment(reference);
    }

    private async initializePaystackPayment(payload: InitializePaymentInput) {
        const secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
        if (!secretKey) {
            throw new InternalServerErrorException('PAYSTACK_SECRET_KEY is not configured');
        }

        const response = await this.requestJson('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: payload.email,
                amount: Math.round(payload.amount * 100),
                currency: payload.currency || 'NGN',
                callback_url: payload.callbackUrl || this.configService.get<string>('PAYMENT_CALLBACK_URL'),
                reference: payload.reference,
                metadata: payload.metadata || {},
            }),
        });

        return {
            provider: 'paystack',
            reference: response?.data?.reference,
            authorizationUrl: response?.data?.authorization_url,
            accessCode: response?.data?.access_code,
            raw: response,
        };
    }

    private async initializeFlutterwavePayment(payload: InitializePaymentInput) {
        const secretKey = this.configService.get<string>('FLUTTERWAVE_SECRET_KEY');
        if (!secretKey) {
            throw new InternalServerErrorException('FLUTTERWAVE_SECRET_KEY is not configured');
        }

        const txRef = payload.reference || `buyops-${Date.now()}`;

        const response = await this.requestJson('https://api.flutterwave.com/v3/payments', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tx_ref: txRef,
                amount: payload.amount,
                currency: payload.currency || 'NGN',
                redirect_url: payload.callbackUrl || this.configService.get<string>('PAYMENT_CALLBACK_URL') || 'http://localhost:5173',
                customer: {
                    email: payload.email,
                },
                customizations: {
                    title: payload.title || 'BuyOps Payment',
                },
                meta: payload.metadata || {},
            }),
        });

        return {
            provider: 'flutterwave',
            reference: txRef,
            authorizationUrl: response?.data?.link,
            raw: response,
        };
    }

    private async verifyPaystackPayment(reference: string) {
        const secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
        if (!secretKey) {
            throw new InternalServerErrorException('PAYSTACK_SECRET_KEY is not configured');
        }

        const response = await this.requestJson(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
        });

        return {
            provider: 'paystack',
            reference,
            status: response?.data?.status,
            paidAt: response?.data?.paid_at,
            amount: response?.data?.amount ? response.data.amount / 100 : undefined,
            currency: response?.data?.currency,
            customerEmail: response?.data?.customer?.email,
            raw: response,
        };
    }

    private async verifyFlutterwavePayment(reference: string) {
        const secretKey = this.configService.get<string>('FLUTTERWAVE_SECRET_KEY');
        if (!secretKey) {
            throw new InternalServerErrorException('FLUTTERWAVE_SECRET_KEY is not configured');
        }

        const response = await this.requestJson(
            `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                },
            },
        );

        return {
            provider: 'flutterwave',
            reference,
            status: response?.data?.status,
            paidAt: response?.data?.created_at,
            amount: response?.data?.amount,
            currency: response?.data?.currency,
            customerEmail: response?.data?.customer?.email,
            raw: response,
        };
    }

    private async requestJson(url: string, init: RequestInit) {
        const response = await fetch(url, init);
        const text = await response.text();

        let json: any;
        try {
            json = text ? JSON.parse(text) : {};
        } catch {
            json = { message: text };
        }

        if (!response.ok) {
            this.logger.error(`Payment provider request failed (${response.status}): ${JSON.stringify(json)}`);
            throw new InternalServerErrorException(
                json?.message || json?.error || 'Payment provider request failed',
            );
        }

        return json;
    }
}
