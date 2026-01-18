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
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";

class CreateAgentDto {
    name!: string;
    email!: string;
    phone!: string;
    cluster!: string;
    role!: string;
    status!: string;
}

@Controller("agents")
export class AgentsController {
    constructor(private agentsService: AgentsService) { }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Get()
    async findAll() {
        return this.agentsService.findAll();
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Get("stats")
    async getStats() {
        return this.agentsService.getStats();
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.agentsService.findById(id);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Post()
    async create(@Body() dto: CreateAgentDto) {
        return this.agentsService.create(dto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: Partial<CreateAgentDto>) {
        return this.agentsService.update(id, dto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.agentsService.delete(id);
    }
}