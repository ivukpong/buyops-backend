import { SalesService } from "./sales.service";
declare class CreateSaleDto {
    productId: string;
    quantity: number;
    total: number;
}
export declare class SalesController {
    private svc;
    constructor(svc: SalesService);
    create(req: any, body: CreateSaleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        quantity: number;
        total: number;
        productId: string;
    }>;
    mySales(req: any): Promise<({
        product: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        quantity: number;
        total: number;
        productId: string;
    })[]>;
    all(): Promise<({
        user: {
            id: string;
            email: string;
            name: string | null;
        };
        product: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        quantity: number;
        total: number;
        productId: string;
    })[]>;
}
export {};
