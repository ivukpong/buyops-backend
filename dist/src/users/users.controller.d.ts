import { UsersService } from "./users.service";
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
}
export declare class UpdatePasswordDto {
    newPassword: string;
}
export declare class CreateUserDto {
    email: string;
    password: string;
    name: string;
    role?: string;
    phone?: string;
}
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(role?: string, status?: string, search?: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        agentProfile: {
            id: string;
            status: string;
            totalCommission: number;
            cluster: {
                id: string;
                name: string;
            };
            activeDeals: number;
            closedDeals: number;
        } | null;
        freelancerProfile: {
            id: string;
            status: string;
            totalCommission: number;
            cluster: {
                id: string;
                name: string;
            };
            activeDeals: number;
            closedDeals: number;
        } | null;
    }[]>;
    findOne(id: string, req: any): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        agentProfile: ({
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
        }) | null;
        freelancerProfile: ({
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
        }) | null;
        leadsCreated: {
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
        transactions: ({
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
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        agentProfile: {
            id: string;
            status: string;
        } | null;
        freelancerProfile: {
            id: string;
            status: string;
        } | null;
    }>;
    getUserStats(id: string, req: any): Promise<{
        userType: string;
        activeDeals: number;
        closedDeals: number;
        totalCommission: number;
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
        totalInvested?: undefined;
        activeInvestments?: undefined;
    } | {
        userType: string;
        totalInvested: number;
        activeInvestments: number;
        activeDeals?: undefined;
        closedDeals?: undefined;
        totalCommission?: undefined;
        cluster?: undefined;
    } | {
        userType: string;
        activeDeals?: undefined;
        closedDeals?: undefined;
        totalCommission?: undefined;
        cluster?: undefined;
        totalInvested?: undefined;
        activeInvestments?: undefined;
    }>;
    getUserActivity(id: string, limit?: string, req?: any): Promise<any[]>;
    getUserTransactions(id: string, req: any): Promise<({
        asset: {
            name: string;
            referenceCode: string;
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
    })[]>;
    getUserLeads(id: string, req: any): Promise<({
        asset: {
            name: string;
        } | null;
    } & {
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
    })[]>;
    create(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto, req: any): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        updatedAt: Date;
    }>;
    updateRole(id: string, role: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
    }>;
    updatePassword(id: string, dto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    deactivate(id: string): Promise<{
        message: string;
    }>;
    reactivate(id: string): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getUsersByRole(role: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        createdAt: Date;
    }[]>;
    getUserDashboard(id: string, req: any): Promise<{
        stats: {
            userType: string;
            activeDeals: number;
            closedDeals: number;
            totalCommission: number;
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
            totalInvested?: undefined;
            activeInvestments?: undefined;
        } | {
            userType: string;
            totalInvested: number;
            activeInvestments: number;
            activeDeals?: undefined;
            closedDeals?: undefined;
            totalCommission?: undefined;
            cluster?: undefined;
        } | {
            userType: string;
            activeDeals?: undefined;
            closedDeals?: undefined;
            totalCommission?: undefined;
            cluster?: undefined;
            totalInvested?: undefined;
            activeInvestments?: undefined;
        };
        recentActivity: any[];
    }>;
    getAllAgents(): Promise<({
        agentProfile: ({
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
        }) | null;
    } & {
        id: string;
        email: string;
        password: string;
        name: string | null;
        role: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getAllInvestors(): Promise<{
        id: string;
        email: string;
        name: string | null;
        createdAt: Date;
    }[]>;
    searchUsers(query: string, role?: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
    }[]>;
    getUserCountByRole(): Promise<{
        role: any;
        count: any;
    }[]>;
    bulkCreate(users: CreateUserDto[]): Promise<{
        message: string;
        count: number;
    }>;
}
