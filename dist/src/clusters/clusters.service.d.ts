import { PrismaService } from "../prisma/prisma.service";
export declare class ClustersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            leads: number;
            agents: number;
            freelancers: number;
        };
        agents: {
            id: string;
            status: string;
            user: {
                name: string;
                email: string;
            };
            role: string;
        }[];
        freelancers: {
            id: string;
            user: {
                name: string;
                email: string;
            };
        }[];
    } & {
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
    })[]>;
    findById(id: string): Promise<{
        _count: {
            leads: number;
            agents: number;
            freelancers: number;
        };
        leads: {
            id: string;
            assetId: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            phone: string;
            assetInterest: string;
            budget: number;
            source: string;
            leadSource: string;
            createdBy: string | null;
            assignedTo: string | null;
            assignedCluster: string | null;
            dateReceived: Date;
        }[];
        agents: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            totalCommission: number;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            role: string;
            userId: string;
            clusterId: string;
            activeDeals: number;
            closedDeals: number;
            performance: number;
        })[];
        freelancers: ({
            user: {
                id: string;
                name: string;
                email: string;
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
        })[];
    } & {
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
    }>;
    create(data: {
        name: string;
        code: string;
        teamLead: string;
        location: string;
        status: string;
    }): Promise<{
        _count: {
            leads: number;
            agents: number;
            freelancers: number;
        };
    } & {
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
    }>;
    update(id: string, data: any): Promise<{
        _count: {
            leads: number;
            agents: number;
            freelancers: number;
        };
    } & {
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
    }>;
    delete(id: string): Promise<{
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
    }>;
    getStats(): Promise<{
        totalClusters: number;
        activeClusters: number;
        totalAgents: number;
        totalCommission: number;
    }>;
    updateClusterStats(clusterId: string): Promise<{
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
    }>;
    getPerformanceMetrics(clusterId: string): Promise<{
        cluster: {
            _count: {
                leads: number;
                agents: number;
                freelancers: number;
            };
            leads: {
                id: string;
                assetId: string | null;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                email: string;
                phone: string;
                assetInterest: string;
                budget: number;
                source: string;
                leadSource: string;
                createdBy: string | null;
                assignedTo: string | null;
                assignedCluster: string | null;
                dateReceived: Date;
            }[];
            agents: ({
                user: {
                    id: string;
                    name: string;
                    email: string;
                };
            } & {
                totalCommission: number;
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                role: string;
                userId: string;
                clusterId: string;
                activeDeals: number;
                closedDeals: number;
                performance: number;
            })[];
            freelancers: ({
                user: {
                    id: string;
                    name: string;
                    email: string;
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
            })[];
        } & {
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
        metrics: {
            totalTransactions: number;
            completedTransactions: number;
            totalRevenue: number;
            totalCommission: number;
            averageTransactionValue: number;
            conversionRate: number;
        };
    }>;
}
