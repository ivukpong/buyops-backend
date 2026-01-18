import { PrismaService } from "../prisma/prisma.service";
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: {
        source?: string;
        status?: string;
    }): Promise<({
        cluster: {
            id: string;
            name: string;
        } | null;
        asset: {
            id: string;
            name: string;
            location: string;
        } | null;
        creator: {
            id: string;
            email: string;
            name: string | null;
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
    findById(id: string): Promise<{
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
        } | null;
        asset: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            address: string | null;
            status: string;
            location: string;
            referenceCode: string;
            projectStatus: string;
            companyId: string;
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
            leadCommission: number;
            closerCommission: number;
            featured: boolean;
            totalAnnualReturn: number | null;
        } | null;
        creator: {
            id: string;
            email: string;
            name: string | null;
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
            email: string;
            name: string | null;
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
    }>;
    update(id: string, data: any): Promise<{
        cluster: {
            id: string;
            name: string;
        } | null;
        asset: {
            id: string;
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
    convertLead(leadId: string, transactionData: any): Promise<{
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
    }>;
    bulkImportLeads(leads: any[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getLeadHistory(leadId: string): Promise<{
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
        } | null;
        asset: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            address: string | null;
            status: string;
            location: string;
            referenceCode: string;
            projectStatus: string;
            companyId: string;
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
            leadCommission: number;
            closerCommission: number;
            featured: boolean;
            totalAnnualReturn: number | null;
        } | null;
        creator: {
            id: string;
            email: string;
            name: string | null;
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
    }>;
}
