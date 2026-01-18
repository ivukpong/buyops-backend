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
        user: {
            id: string;
            email: string;
            name: string | null;
        };
        cluster: {
            id: string;
            name: string;
        };
        _count: {
            leadsAsLead: number;
            leadsAsCloser: number;
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
        leadsAsLead: ({
            asset: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            totalCommission: number;
            companyId: string;
            leadCommission: number;
            closerCommission: number | null;
            installmentPlanId: string | null;
            amount: number;
            paymentType: string;
            earnedLeadCommission: number | null;
            earnedCloserCommission: number | null;
            earnedTotalCommission: number | null;
            pendingLeadCommission: number | null;
            pendingCloserCommission: number | null;
            pendingTotalCommission: number | null;
            commissionPaymentStatus: string;
            date: Date;
            assetId: string;
            buyerId: string;
            leadAgentId: string;
            closerAgentId: string | null;
        })[];
        leadsAsCloser: ({
            asset: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            totalCommission: number;
            companyId: string;
            leadCommission: number;
            closerCommission: number | null;
            installmentPlanId: string | null;
            amount: number;
            paymentType: string;
            earnedLeadCommission: number | null;
            earnedCloserCommission: number | null;
            earnedTotalCommission: number | null;
            pendingLeadCommission: number | null;
            pendingCloserCommission: number | null;
            pendingTotalCommission: number | null;
            commissionPaymentStatus: string;
            date: Date;
            assetId: string;
            buyerId: string;
            leadAgentId: string;
            closerAgentId: string | null;
        })[];
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
    }>;
    create(dto: CreateAgentDto): Promise<{
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
    }>;
    update(id: string, dto: Partial<CreateAgentDto>): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
export {};
