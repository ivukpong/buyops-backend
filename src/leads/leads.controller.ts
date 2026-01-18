import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards
} from "@nestjs/common";
import { LeadsService } from "./leads.service";
import { AuthGuard } from "@nestjs/passport";
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
    createdBy?: string;
}

class AssignLeadsDto {
    leadIds!: string[];
    assignmentType!: "cluster" | "all";
    clusterId?: string;
}

@Controller("leads")
export class LeadsController {
    constructor(private leadsService: LeadsService) { }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN", "SALES")
    @Get()
    async findAll(
        @Query("source") source?: string,
        @Query("status") status?: string
    ) {
        return this.leadsService.findAll({ source, status });
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Get("stats")
    async getStats() {
        return this.leadsService.getStats();
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN", "SALES")
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.leadsService.findById(id);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN", "SALES")
    @Post()
    async create(@Body() dto: CreateLeadDto) {
        return this.leadsService.create(dto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Post("assign")
    async assignLeads(@Body() dto: AssignLeadsDto) {
        return this.leadsService.assignLeads(dto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN", "SALES")
    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: Partial<CreateLeadDto>) {
        return this.leadsService.update(id, dto);
    }
}