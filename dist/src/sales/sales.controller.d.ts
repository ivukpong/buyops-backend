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
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
            name: string;
            email: string;
        };
        product: {
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
