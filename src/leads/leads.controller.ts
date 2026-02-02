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
    async create(@Body() dto: CreateLeadDto, @Param('user') user: any) {
        // Assuming you have access to the user object from the request (e.g., via a custom decorator or request object)
        // Replace 'user.id' with the correct way to get the current user's id in your app
        return this.leadsService.create(dto, user.id);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Post("assign")
    async assignLeads(@Body() dto: AssignLeadsDto) {
        return this.leadsService.assignLeads(dto);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN", "SALES")
    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: Partial<CreateLeadDto>) {
        return this.leadsService.update(id, dto);
    }
}