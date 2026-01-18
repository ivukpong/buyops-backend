import { PrismaService } from "../prisma/prisma.service";
export declare class ClustersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        agents: {
            id: string;
            role: string;
            user: {
                email: string;
                name: string | null;
            };
            status: string;
        }[];
        freelancers: {
            id: string;
            user: {
                email: string;
                name: string | null;
            };
        }[];
        _count: {
            agents: number;
            freelancers: number;
            leads: number;
        };
    } & {
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
    })[]>;
    findById(id: string): Promise<{
        agents: ({
            user: {
                id: string;
                email: string;
                name: string | null;
            };
        } & {
            id: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            totalCommission: number;
            activeDeals: number;
            closedDeals: number;
            performance: number;
            userId: string;
            clusterId: string;
        })[];
        freelancers: ({
            user: {
                id: string;
                email: string;
                name: string | null;
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
        })[];
        leads: {
            id: string;
            email: string;
            name: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            assetId: string | null;
            assetInterest: string;
            budget: number;
            source: string;
            leadSource: string;
            assignedTo: string | null;
            dateReceived: Date;
            createdBy: string | null;
            assignedCluster: string | null;
        }[];
        _count: {
            agents: number;
            freelancers: number;
            leads: number;
        };
    } & {
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
    }>;
    create(data: {
        name: string;
        code: string;
        teamLead: string;
        location: string;
        status: string;
    }): Promise<{
        _count: {
            agents: number;
            freelancers: number;
            leads: number;
        };
    } & {
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
    }>;
    update(id: string, data: any): Promise<{
        _count: {
            agents: number;
            freelancers: number;
            leads: number;
        };
    } & {
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
    }>;
    delete(id: string): Promise<{
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
    }>;
    getStats(): Promise<{
        totalClusters: number;
        activeClusters: number;
        totalAgents: number;
        totalCommission: number;
    }>;
    updateClusterStats(clusterId: string): Promise<{
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
    }>;
    getPerformanceMetrics(clusterId: string): Promise<{
        cluster: {
            agents: ({
                user: {
                    id: string;
                    email: string;
                    name: string | null;
                };
            } & {
                id: string;
                role: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                totalCommission: number;
                activeDeals: number;
                closedDeals: number;
                performance: number;
                userId: string;
                clusterId: string;
            })[];
            freelancers: ({
                user: {
                    id: string;
                    email: string;
                    name: string | null;
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
            })[];
            leads: {
                id: string;
                email: string;
                name: string;
                phone: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                assetId: string | null;
                assetInterest: string;
                budget: number;
                source: string;
                leadSource: string;
                assignedTo: string | null;
                dateReceived: Date;
                createdBy: string | null;
                assignedCluster: string | null;
            }[];
            _count: {
                agents: number;
                freelancers: number;
                leads: number;
            };
        } & {
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
