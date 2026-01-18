import { InvestmentsService } from "./investments.service";
declare class CreateInvestmentDto {
    amount: number;
    note?: string;
}
export declare class InvestmentsController {
    private svc;
    constructor(svc: InvestmentsService);
    create(req: any, body: CreateInvestmentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        note: string | null;
    }>;
    myInvestments(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        note: string | null;
    }[]>;
    all(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        note: string | null;
    }[]>;
}
export {};
