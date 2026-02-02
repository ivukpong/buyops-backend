import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards
} from "@nestjs/common";
import { ClustersService } from "./clusters.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";

class CreateClusterDto {
    name!: string;
    code!: string;
    teamLead!: string; // managerId
    location!: string;
    status!: string;
}

@Controller("clusters")
export class ClustersController {
    constructor(private clustersService: ClustersService) { }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get()
    async findAll() {
        return this.clustersService.findAll();
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get("stats")
    async getStats() {
        return this.clustersService.getStats();
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.clustersService.findById(id);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Post()
    async create(@Body() dto: CreateClusterDto) {
        return this.clustersService.create(dto);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: Partial<CreateClusterDto>) {
        return this.clustersService.update(id, dto);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.clustersService.delete(id);
    }
}