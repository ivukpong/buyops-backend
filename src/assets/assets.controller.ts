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
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
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
    // --- SAVED PROPERTIES ENDPOINTS ---
    @UseGuards(JwtAuthGuard)
    @Get('saved')
    async getSavedProperties(@Req() req: Request) {
        // Assume user id is in req.user.id (from JWT)
        return this.assetsService.getSavedProperties(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/save')
    async saveProperty(@Param('id') id: string, @Req() req: Request) {
        return this.assetsService.saveProperty(req.user.id, id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/save')
    async unsaveProperty(@Param('id') id: string, @Req() req: Request) {
        return this.assetsService.unsaveProperty(req.user.id, id);
    }

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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Post()
    async create(@Body() dto: CreateAssetDto) {
        return this.assetsService.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: Partial<CreateAssetDto>) {
        return this.assetsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
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