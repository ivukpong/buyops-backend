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
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
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

    
    @Get()
    async findAll() {
        return this.freelancersService.findAll();
    }

    
    @Get("stats")
    async getStats() {
        return this.freelancersService.getStats();
    }

    
    @Get("by-registrar/:registrarId")
    async getByRegistrar(@Param("registrarId") registrarId: string) {
        return this.freelancersService.getFreelancersByRegistrar(registrarId);
    }

    
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.freelancersService.findById(id);
    }

    
    @Post()
    async create(@Body() dto: CreateFreelancerDto) {
        return this.freelancersService.create(dto);
    }

    
    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: Partial<CreateFreelancerDto>) {
        return this.freelancersService.update(id, dto);
    }

    
    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.freelancersService.delete(id);
    }
}