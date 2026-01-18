import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards
} from "@nestjs/common";
import { AssetsService } from "./assets.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";
import { Company } from "@prisma/client";

export class CreateAssetDto {
    name!: string;
    referenceCode!: string;
    type!: string;
    projectStatus!: string;
    location!: string;
    address!: string;
    companyId!: string;
    company!: Company;
    landSize?: string;
    builtSize?: string;
    constructionStart?: string;
    constructionEnd?: string;
    propertyCategory!: string;
    totalUnits!: number;
    availableUnits?: number;
    unitConfiguration?: string;
    furnishingStatus?: string;
    sharedFacilities?: string[];
    facilityManagement!: boolean;
    ownershipType!: string;
    fractionTotal?: number;
    costPerFraction?: number;
    basePrice!: number;
    markup!: number;
    finalPrice!: number;
    paymentOptions!: string[];
    installmentPeriods?: string[];
    downPaymentAmount?: number;
    offPlanDiscount?: number;
    stageBasedDiscount?: number;
    projectedRentalIncome?: number;
    rentalFrequency?: string;
    operatingCost?: number;
    capitalAppreciation?: number;
    firstPayoutDate?: string;
    constructionStage?: string;
    riskLevel!: string;
    offPlanSecurity?: string;
    exitLiquidity!: string;
    managementMode!: string;
    leadCommission!: number;
    closerCommission!: number;
    status!: string;
    featured?: boolean;
    totalAnnualReturn?: number;
}

@Controller("assets")
export class AssetsController {
    constructor(private assetsService: AssetsService) { }

    @Get()
    async findAll(
        @Query("type") type?: string,
        @Query("status") status?: string,
        @Query("location") location?: string
    ) {
        return this.assetsService.findAll({ type, status, location });
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.assetsService.findById(id);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Post()
    async create(@Body() dto: CreateAssetDto) {
        return this.assetsService.create(dto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: Partial<CreateAssetDto>) {
        return this.assetsService.update(id, dto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.assetsService.delete(id);
    }

    @Get("stats/overview")
    async getStats() {
        return this.assetsService.getStats();
    }
}