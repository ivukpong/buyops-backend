import { FreelancersService } from "./freelancers.service";
declare class CreateFreelancerDto {
    name: string;
    email: string;
    phone: string;
    registeredBy: string;
    registrarName: string;
    registrarType: string;
    cluster: string;
    status: string;
}
export declare class FreelancersController {
    private freelancersService;
    constructor(freelancersService: FreelancersService);
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
            name: string | null;
        };
        cluster: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        totalCommission: number;
        activeDeals: number;
        closedDeals: number;
        performance: number;
        userId: string;
        clusterId: string;
        registeredBy: string;
        registrarName: string;
        registrarType: string;
    })[]>;
    getStats(): Promise<{
        totalFreelancers: number;
        activeFreelancers: number;
        totalActiveDeals: number;
        totalClosedDeals: number;
        totalCommission: number;
    }>;
    getByRegistrar(registrarId: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string | null;
        };
        cluster: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        totalCommission: number;
        activeDeals: number;
        closedDeals: number;
        performance: number;
        userId: string;
        clusterId: string;
        registeredBy: string;
        registrarName: string;
        registrarType: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string | null;
        };
        cluster: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            activeAssets: number;
            code: string;
            teamLead: string;
            location: string;
            totalCommission: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        totalCommission: number;
        activeDeals: number;
        closedDeals: number;
        performance: number;
        userId: string;
        clusterId: string;
        registeredBy: string;
        registrarName: string;
        registrarType: string;
    }>;
    create(dto: CreateFreelancerDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string | null;
        };
        cluster: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        totalCommission: number;
        activeDeals: number;
        closedDeals: number;
        performance: number;
        userId: string;
        clusterId: string;
        registeredBy: string;
        registrarName: string;
        registrarType: string;
    }>;
    update(id: string, dto: Partial<CreateFreelancerDto>): Promise<{
        user: {
            id: string;
            email: string;
            name: string | null;
        };
        cluster: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        totalCommission: number;
        activeDeals: number;
        closedDeals: number;
        performance: number;
        userId: string;
        clusterId: string;
        registeredBy: string;
        registrarName: string;
        registrarType: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        totalCommission: number;
        activeDeals: number;
        closedDeals: number;
        performance: number;
        userId: string;
        clusterId: string;
        registeredBy: string;
        registrarName: string;
        registrarType: string;
    }>;
}
export {};
