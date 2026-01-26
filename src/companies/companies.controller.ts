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
import { CompaniesService } from "./companies.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller("companies")
export class CompaniesController {
    constructor(private companiesService: CompaniesService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Get()
    async findAll() {
        return this.companiesService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Get(":id")
    async findOne(@Param("id") id: string) {
        console.log("Fetching company with ID:", id);
        return this.companiesService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Post()
    async create(@Body() dto: CreateCompanyDto) {
        return this.companiesService.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: Partial<CreateCompanyDto>) {
        return this.companiesService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.companiesService.delete(id);
    }
}