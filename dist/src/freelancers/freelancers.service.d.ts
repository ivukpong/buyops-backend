import { PrismaService } from "../prisma/prisma.service";
export declare class FreelancersService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findById(id: string): Promise<{
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
    create(data: {
        name: string;
        email: string;
        phone: string;
        registeredBy: string;
        registrarName: string;
        registrarType: string;
        cluster: string;
        status: string;
    }): Promise<{
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
    update(id: string, data: any): Promise<{
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
    delete(id: string): Promise<{
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
    getStats(): Promise<{
        totalFreelancers: number;
        activeFreelancers: number;
        totalActiveDeals: number;
        totalClosedDeals: number;
        totalCommission: number;
    }>;
    getFreelancersByRegistrar(registrarId: string): Promise<({
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
    updateFreelancerStats(freelancerId: string): Promise<{
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
}
