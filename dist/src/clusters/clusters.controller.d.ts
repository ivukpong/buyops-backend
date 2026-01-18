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
    getStats(): Promise<{
        totalClusters: number;
        activeClusters: number;
        totalAgents: number;
        totalCommission: number;
    }>;
    findOne(id: string): Promise<{
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
    create(dto: CreateClusterDto): Promise<{
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
    update(id: string, dto: Partial<CreateClusterDto>): Promise<{
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
    remove(id: string): Promise<{
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
}
export {};
