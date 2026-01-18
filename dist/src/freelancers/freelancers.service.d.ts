import { PrismaService } from "../prisma/prisma.service";
export declare class FreelancersService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findById(id: string): Promise<{
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
    update(id: string, data: any): Promise<{
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
    delete(id: string): Promise<{
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
    updateFreelancerStats(freelancerId: string): Promise<{
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
}
