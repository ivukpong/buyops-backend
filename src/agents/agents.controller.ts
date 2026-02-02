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
import { AgentsService } from "./agents.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";


class CreateAgentDto {
    name!: string;
    email!: string;
    phone?: string;
    cluster?: string;
    role?: string;
    status?: string;
}

@Controller("agents")
export class AgentsController {
    constructor(private agentsService: AgentsService) { }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get()
    async findAll() {
        return this.agentsService.findAll();
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get("stats")
    async getStats() {
        return this.agentsService.getStats();
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.agentsService.findById(id);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Post()
    async create(@Body() dto: CreateAgentDto) {
        return this.agentsService.create(dto);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: Partial<CreateAgentDto>) {
        return this.agentsService.update(id, dto);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("ADMIN")
    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.agentsService.delete(id);
    }
}