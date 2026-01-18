import { AgentsService } from "./agents.service";
declare class CreateAgentDto {
    name: string;
    email: string;
    phone: string;
    cluster: string;
    role: string;
    status: string;
}
export declare class AgentsController {
    private agentsService;
    constructor(agentsService: AgentsService);
    findAll(): Promise<({
        _count: {
            leadsAsLead: number;
            leadsAsCloser: number;
        };
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
        role: string;
        userId: string;
        clusterId: string;
        activeDeals: number;
        closedDeals: number;
        performance: number;
    })[]>;
    getStats(): Promise<{
        totalAgents: number;
        activeAgents: number;
        totalActiveDeals: number;
        totalClosedDeals: number;
        totalCommission: number;
    }>;
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
        leadsAsLead: ({
            asset: {
                name: string;
            };
        } & {
            amount: number;
            leadCommission: number;
            closerCommission: number | null;
            totalCommission: number;
            earnedLeadCommission: number | null;
            earnedCloserCommission: number | null;
            earnedTotalCommission: number | null;
            pendingLeadCommission: number | null;
            pendingCloserCommission: number | null;
            pendingTotalCommission: number | null;
            id: string;
            assetId: string;
            buyerId: string;
            leadAgentId: string;
            closerAgentId: string | null;
            installmentPlanId: string | null;
            companyId: string;
            paymentType: string;
            commissionPaymentStatus: string;
            status: string;
            date: Date;
            createdAt: Date;
            updatedAt: Date;
        })[];
        leadsAsCloser: ({
            asset: {
                name: string;
            };
        } & {
            amount: number;
            leadCommission: number;
            closerCommission: number | null;
            totalCommission: number;
            earnedLeadCommission: number | null;
            earnedCloserCommission: number | null;
            earnedTotalCommission: number | null;
            pendingLeadCommission: number | null;
            pendingCloserCommission: number | null;
            pendingTotalCommission: number | null;
            id: string;
            assetId: string;
            buyerId: string;
            leadAgentId: string;
            closerAgentId: string | null;
            installmentPlanId: string | null;
            companyId: string;
            paymentType: string;
            commissionPaymentStatus: string;
            status: string;
            date: Date;
            createdAt: Date;
            updatedAt: Date;
        })[];
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
    }>;
    create(dto: CreateAgentDto): Promise<{
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
        role: string;
        userId: string;
        clusterId: string;
        activeDeals: number;
        closedDeals: number;
        performance: number;
    }>;
    update(id: string, dto: Partial<CreateAgentDto>): Promise<{
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
        role: string;
        userId: string;
        clusterId: string;
        activeDeals: number;
        closedDeals: number;
        performance: number;
    }>;
    remove(id: string): Promise<{
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
    }>;
}
export {};
