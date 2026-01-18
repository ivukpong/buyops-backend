import { InvestmentsService } from "./investments.service";
declare class CreateInvestmentDto {
    amount: number;
    note?: string;
}
export declare class InvestmentsController {
    private svc;
    constructor(svc: InvestmentsService);
    create(req: any, body: CreateInvestmentDto): Promise<{
        amount: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
    }>;
    myInvestments(req: any): Promise<{
        amount: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
    }[]>;
    all(): Promise<{
        amount: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
    }[]>;
}
export {};
