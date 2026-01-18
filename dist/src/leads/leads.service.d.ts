import { PrismaService } from "../prisma/prisma.service";
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: {
        source?: string;
        status?: string;
    }): Promise<({
        asset: {
            id: string;
            name: string;
            location: string;
        };
        cluster: {
            id: string;
            name: string;
        };
        creator: {
            id: string;
            name: string;
            email: string;
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
    findById(id: string): Promise<{
        asset: {
            leadCommission: number;
            closerCommission: number;
            id: string;
            companyId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            referenceCode: string;
            type: string;
            projectStatus: string;
            location: string;
            address: string | null;
            landSize: string | null;
            builtSize: string | null;
            constructionStart: Date | null;
            constructionEnd: Date | null;
            propertyCategory: string;
            totalUnits: number;
            availableUnits: number;
            unitConfiguration: string | null;
            furnishingStatus: string | null;
            sharedFacilities: string[];
            facilityManagement: boolean;
            ownershipType: string;
            fractionTotal: number | null;
            costPerFraction: number | null;
            basePrice: number;
            markup: number;
            finalPrice: number;
            paymentOptions: string[];
            installmentPeriods: string[];
            downPaymentAmount: number | null;
            offPlanDiscount: number | null;
            stageBasedDiscount: number | null;
            projectedRentalIncome: number | null;
            rentalFrequency: string | null;
            operatingCost: number | null;
            capitalAppreciation: number | null;
            firstPayoutDate: Date | null;
            constructionStage: string | null;
            riskLevel: string;
            offPlanSecurity: string | null;
            exitLiquidity: string;
            managementMode: string;
            featured: boolean;
            totalAnnualReturn: number | null;
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
        creator: {
            id: string;
            name: string;
            email: string;
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
    }>;
    create(data: {
        name: string;
        email: string;
        phone: string;
        assetInterest: string;
        budget: number;
        source: string;
        leadSource: string;
        createdBy?: string;
    }): Promise<{
        creator: {
            name: string;
            email: string;
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
    }>;
    update(id: string, data: any): Promise<{
        asset: {
            id: string;
            name: string;
        };
        cluster: {
            id: string;
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
    }>;
    assignLeads(data: {
        leadIds: string[];
        assignmentType: "cluster" | "all";
        clusterId?: string;
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getStats(): Promise<{
        totalLeads: number;
        pendingLeads: number;
        assignedLeads: number;
        availableLeads: number;
        convertedLeads: number;
        conversionRate: string;
        leadsBySource: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.LeadGroupByOutputType, "leadSource"[]> & {
            _count: number;
        })[];
    }>;
    getLeadsByCluster(clusterId: string): Promise<({
        asset: {
            name: string;
            location: string;
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
    convertLead(leadId: string, transactionData: any): Promise<{
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
    }>;
    bulkImportLeads(leads: any[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getLeadHistory(leadId: string): Promise<{
        asset: {
            leadCommission: number;
            closerCommission: number;
            id: string;
            companyId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            referenceCode: string;
            type: string;
            projectStatus: string;
            location: string;
            address: string | null;
            landSize: string | null;
            builtSize: string | null;
            constructionStart: Date | null;
            constructionEnd: Date | null;
            propertyCategory: string;
            totalUnits: number;
            availableUnits: number;
            unitConfiguration: string | null;
            furnishingStatus: string | null;
            sharedFacilities: string[];
            facilityManagement: boolean;
            ownershipType: string;
            fractionTotal: number | null;
            costPerFraction: number | null;
            basePrice: number;
            markup: number;
            finalPrice: number;
            paymentOptions: string[];
            installmentPeriods: string[];
            downPaymentAmount: number | null;
            offPlanDiscount: number | null;
            stageBasedDiscount: number | null;
            projectedRentalIncome: number | null;
            rentalFrequency: string | null;
            operatingCost: number | null;
            capitalAppreciation: number | null;
            firstPayoutDate: Date | null;
            constructionStage: string | null;
            riskLevel: string;
            offPlanSecurity: string | null;
            exitLiquidity: string;
            managementMode: string;
            featured: boolean;
            totalAnnualReturn: number | null;
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
        creator: {
            id: string;
            name: string;
            email: string;
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
    }>;
}
