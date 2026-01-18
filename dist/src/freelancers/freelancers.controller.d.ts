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
            name: string;
            email: string;
        };
        cluster: {
            id: string;
            name: string;
        };
    } & {
        totalCommission: number;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        clusterId: string;
        activeDeals: number;
        closedDeals: number;
        performance: number;
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
            name: string;
            email: string;
        };
        cluster: {
            id: string;
            name: string;
        };
    } & {
        totalCommission: number;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        clusterId: string;
        activeDeals: number;
        closedDeals: number;
        performance: number;
        registeredBy: string;
        registrarName: string;
        registrarType: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        cluster: {
            totalCommission: number;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            location: string;
            code: string;
            teamLead: string;
            activeAssets: number;
        };
    } & {
        totalCommission: number;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        clusterId: string;
        activeDeals: number;
        closedDeals: number;
        performance: number;
        registeredBy: string;
        registrarName: string;
        registrarType: string;
    }>;
    create(dto: CreateFreelancerDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        cluster: {
            id: string;
            name: string;
        };
    } & {
        totalCommission: number;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        clusterId: string;
        activeDeals: number;
        closedDeals: number;
        performance: number;
        registeredBy: string;
        registrarName: string;
        registrarType: string;
    }>;
    update(id: string, dto: Partial<CreateFreelancerDto>): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        cluster: {
            id: string;
            name: string;
        };
    } & {
        totalCommission: number;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        clusterId: string;
        activeDeals: number;
        closedDeals: number;
        performance: number;
        registeredBy: string;
        registrarName: string;
        registrarType: string;
    }>;
    remove(id: string): Promise<{
        totalCommission: number;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        clusterId: string;
        activeDeals: number;
        closedDeals: number;
        performance: number;
        registeredBy: string;
        registrarName: string;
        registrarType: string;
    }>;
}
export {};
