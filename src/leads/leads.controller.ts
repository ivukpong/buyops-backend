import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Req
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { IsOptional, IsString } from 'class-validator';
import { LeadsService } from "./leads.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";

class CreateLeadDto {
    name!: string;
    email!: string;
    phone!: string;
    assetInterest!: string;
    budget!: number;
    source!: string;
    leadSource!: string;
    assignedCluster?: string;
    status?: string;
    assignedToId?: string;
    createdBy?: string;
}

class AssignLeadsDto {
    leadIds!: string[];
    assignmentType!: "cluster" | "all";
    clusterId?: string;
}

class AssignSingleLeadDto {
    @IsOptional()
    @IsString()
    assignedToId?: string;

    @IsOptional()
    @IsString()
    clusterId?: string;
}

@Controller("leads")
export class LeadsController {
    constructor(private leadsService: LeadsService) { }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN", "SALES")
    @Get()
    async findAll(
        @Query("source") source?: string,
        @Query("status") status?: string
    ) {
        return this.leadsService.findAll({ source, status });
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get("stats")
    async getStats() {
        return this.leadsService.getStats();
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN", "SALES")
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.leadsService.findById(id);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN", "SALES")
    @Post()
    async create(@Body() dto: CreateLeadDto, @Req() req: any) {
        const createdById = req?.user?.id;
        return this.leadsService.create(dto, createdById);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Post("assign")
    async assignLeads(@Body() dto: AssignLeadsDto) {
        return this.leadsService.assignLeads(dto);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Post(":id/assign")
    async assignSingleLead(@Param("id") id: string, @Body() dto: AssignSingleLeadDto) {
        return this.leadsService.assignSingleLead(id, dto);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Post("bulk-import")
    @UseInterceptors(FileInterceptor("file"))
    async bulkImport(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
        const createdById = req?.user?.id;
        return this.leadsService.bulkImport(file, createdById);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Put(":id/status")
    async updateLeadStatus(@Param("id") id: string, @Body() body: { status: string }) {
        return this.leadsService.updateLeadStatus(id, body.status);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN", "SALES")
    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: Partial<CreateLeadDto>) {
        return this.leadsService.update(id, dto);
    }
}