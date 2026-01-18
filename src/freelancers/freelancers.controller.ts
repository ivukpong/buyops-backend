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
import { FreelancersService } from "./freelancers.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";

class CreateFreelancerDto {
    name!: string;
    email!: string;
    phone!: string;
    registeredBy!: string;
    registrarName!: string;
    registrarType!: string;
    cluster!: string;
    status!: string;
}

@Controller("freelancers")
export class FreelancersController {
    constructor(private freelancersService: FreelancersService) { }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Get()
    async findAll() {
        return this.freelancersService.findAll();
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Get("stats")
    async getStats() {
        return this.freelancersService.getStats();
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Get("by-registrar/:registrarId")
    async getByRegistrar(@Param("registrarId") registrarId: string) {
        return this.freelancersService.getFreelancersByRegistrar(registrarId);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.freelancersService.findById(id);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Post()
    async create(@Body() dto: CreateFreelancerDto) {
        return this.freelancersService.create(dto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: Partial<CreateFreelancerDto>) {
        return this.freelancersService.update(id, dto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("ADMIN")
    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.freelancersService.delete(id);
    }
}