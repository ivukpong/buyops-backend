import { PrismaService } from "../prisma/prisma.service";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: {
        role?: string;
        status?: string;
        search?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        role: string;
        agentProfile: {
            totalCommission: number;
            id: string;
            status: string;
            activeDeals: number;
            closedDeals: number;
            cluster: {
                id: string;
                name: string;
            };
        };
        freelancerProfile: {
            totalCommission: number;
            id: string;
            status: string;
            activeDeals: number;
            closedDeals: number;
            cluster: {
                id: string;
                name: string;
            };
        };
    }[]>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        transactions: ({
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
        email: string;
        role: string;
        agentProfile: {
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
        };
        freelancerProfile: {
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
        };
        leadsCreated: {
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
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        agentProfile: {
            id: string;
            status: string;
        };
        freelancerProfile: {
            id: string;
            status: string;
        };
    }>;
    getUserStats(userId: string): Promise<{
        userType: string;
        activeDeals: number;
        closedDeals: number;
        totalCommission: number;
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
    getUserActivity(userId: string, limit?: number): Promise<any[]>;
    getUserTransactions(userId: string): Promise<({
        asset: {
            name: string;
            referenceCode: string;
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
    })[]>;
    getUserLeads(userId: string): Promise<({
        asset: {
            name: string;
        };
    } & {
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
    })[]>;
    createUser(data: {
        email: string;
        password: string;
        name: string;
        role?: string;
        phone?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: string;
    }>;
    updateUser(userId: string, data: any): Promise<{
        id: string;
        updatedAt: Date;
        name: string;
        email: string;
        role: string;
    }>;
    updateUserRole(userId: string, newRole: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
    }>;
    updateUserPassword(userId: string, newPassword: string): Promise<{
        message: string;
    }>;
    deactivateUser(userId: string): Promise<{
        message: string;
    }>;
    reactivateUser(userId: string): Promise<{
        message: string;
    }>;
    deleteUser(userId: string): Promise<{
        message: string;
    }>;
    getUsersByRole(role: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: string;
    }[]>;
    getUserDashboard(userId: string): Promise<{
        stats: {
            userType: string;
            activeDeals: number;
            closedDeals: number;
            totalCommission: number;
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
        agentProfile: {
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
            role: string;
            userId: string;
            clusterId: string;
            activeDeals: number;
            closedDeals: number;
            performance: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        password: string;
        role: string;
        phone: string | null;
    })[]>;
    getAllInvestors(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
    }[]>;
    searchUsers(query: string, role?: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
    }[]>;
    getUserCountByRole(): Promise<{
        role: any;
        count: any;
    }[]>;
    bulkCreateUsers(users: any[]): Promise<{
        message: string;
        count: number;
    }>;
}
