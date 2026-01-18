import { ClustersService } from "./clusters.service";
declare class CreateClusterDto {
    name: string;
    code: string;
    teamLead: string;
    location: string;
    status: string;
}
export declare class ClustersController {
    private clustersService;
    constructor(clustersService: ClustersService);
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
    getStats(): Promise<{
        totalClusters: number;
        activeClusters: number;
        totalAgents: number;
        totalCommission: number;
    }>;
    findOne(id: string): Promise<{
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
    create(dto: CreateClusterDto): Promise<{
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
    update(id: string, dto: Partial<CreateClusterDto>): Promise<{
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
    remove(id: string): Promise<{
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
}
export {};
