import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
  Put,
  Body,
  Delete,
  Post,
  Req,
  HttpCode,
  HttpStatus
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UsersService } from "./users.service";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

// DTOs
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  newPassword!: string;
}

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) { }

  /**
   * Get all users
   * GET /users
   * Admin only
   */
  @Roles("ADMIN")
  @Get()
  async findAll(
    @Query("role") role?: string,
    @Query("status") status?: string,
    @Query("search") search?: string
  ) {
    return this.usersService.findAll({ role, status, search });
  }

  /**
   * Get current user profile
   * GET /users/me
   * Authenticated users only
   */
  @Get("me")
  async getProfile(@Req() req: any) {
    return this.usersService.findById(req.user.id);
  }

  /**
   * Update current user profile
   * PUT /users/me
   * Authenticated users only
   */
  @Put("me")
  async updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(req.user.id, dto);
  }

  /**
   * Get user by ID
   * GET /users/:id
   * Admin or own profile
   */
  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: any) {
    // Allow users to view their own profile or admins to view any profile
    if (req.user.role !== "ADMIN" && req.user.id !== id) {
      throw new Error("Unauthorized to view this profile");
    }
    return this.usersService.findById(id);
  }

  /**
   * Get user by email
   * GET /users/email/:email
   * Admin only
   */
  @Roles("ADMIN")
  @Get("email/:email")
  async findByEmail(@Param("email") email: string) {
    return this.usersService.findByEmail(email);
  }

  /**
   * Get user statistics
   * GET /users/:id/stats
   * Admin or own stats
   */
  @Get(":id/stats")
  async getUserStats(@Param("id") id: string, @Req() req: any) {
    if (req.user.role !== "ADMIN" && req.user.id !== id) {
      throw new Error("Unauthorized to view these statistics");
    }
    return this.usersService.getUserStats(id);
  }

  /**
   * Get user activity
   * GET /users/:id/activity
   * Admin or own activity
   */
  @Get(":id/activity")
  async getUserActivity(
    @Param("id") id: string,
    @Query("limit") limit?: string,
    @Req() req?: any
  ) {
    if (req.user.role !== "ADMIN" && req.user.id !== id) {
      throw new Error("Unauthorized to view this activity");
    }
    const activityLimit = limit ? parseInt(limit) : 20;
    return this.usersService.getUserActivity(id, activityLimit);
  }

  /**
   * Get user transactions
   * GET /users/:id/transactions
   * Admin or own transactions
   */
  @Get(":id/transactions")
  async getUserTransactions(@Param("id") id: string, @Req() req: any) {
    if (req.user.role !== "ADMIN" && req.user.id !== id) {
      throw new Error("Unauthorized to view these transactions");
    }
    return this.usersService.getUserTransactions(id);
  }

  /**
   * Get user leads
   * GET /users/:id/leads
   * Admin or own leads
   */
  @Get(":id/leads")
  async getUserLeads(@Param("id") id: string, @Req() req: any) {
    if (req.user.role !== "ADMIN" && req.user.id !== id) {
      throw new Error("Unauthorized to view these leads");
    }
    return this.usersService.getUserLeads(id);
  }

  /**
   * Create new user
   * POST /users
   * Admin only
   */
  @Roles("ADMIN")
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  /**
   * Update user
   * PUT /users/:id
   * Admin or own profile (limited)
   */
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: any
  ) {
    // Non-admins can only update their own profile and limited fields
    if (req.user.role !== "ADMIN") {
      if (req.user.id !== id) {
        throw new Error("Unauthorized to update this profile");
      }
      // Remove role from update if not admin
      delete dto.role;
    }

    return this.usersService.updateUser(id, dto);
  }

  /**
   * Update user role
   * PUT /users/:id/role
   * Admin only
   */
  @Roles("ADMIN")
  @Put(":id/role")
  async updateRole(
    @Param("id") id: string,
    @Body("role") role: string
  ) {
    return this.usersService.updateUserRole(id, role);
  }

  /**
   * Update user password
   * PUT /users/:id/password
   * Admin only (for resetting user passwords)
   */
  @Roles("ADMIN")
  @Put(":id/password")
  async updatePassword(
    @Param("id") id: string,
    @Body() dto: UpdatePasswordDto
  ) {
    return this.usersService.updateUserPassword(id, dto.newPassword);
  }

  /**
   * Deactivate user
   * POST /users/:id/deactivate
   * Admin only
   */
  @Roles("ADMIN")
  @Post(":id/deactivate")
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param("id") id: string) {
    return this.usersService.deactivateUser(id);
  }

  /**
   * Reactivate user
   * POST /users/:id/reactivate
   * Admin only
   */
  @Roles("ADMIN")
  @Post(":id/reactivate")
  @HttpCode(HttpStatus.OK)
  async reactivate(@Param("id") id: string) {
    return this.usersService.reactivateUser(id);
  }

  /**
   * Delete user
   * DELETE /users/:id
   * Admin only
   */
  @Roles("ADMIN")
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.usersService.deleteUser(id);
  }

  /**
   * Get users by role
   * GET /users/by-role/:role
   * Admin only
   */
  @Roles("ADMIN")
  @Get("by-role/:role")
  async getUsersByRole(@Param("role") role: string) {
    return this.usersService.getUsersByRole(role);
  }

  /**
   * Get user dashboard data
   * GET /users/:id/dashboard
   * Admin or own dashboard
   */
  @Get(":id/dashboard")
  async getUserDashboard(@Param("id") id: string, @Req() req: any) {
    if (req.user.role !== "ADMIN" && req.user.id !== id) {
      throw new Error("Unauthorized to view this dashboard");
    }
    return this.usersService.getUserDashboard(id);
  }

  /**
   * Get all agents
   * GET /users/agents/all
   * Admin only
   */
  @Roles("ADMIN")
  @Get("agents/all")
  async getAllAgents() {
    return this.usersService.getAllAgents();
  }

  /**
   * Get all investors
   * GET /users/investors/all
   * Admin only
   */
  @Roles("ADMIN")
  @Get("investors/all")
  async getAllInvestors() {
    return this.usersService.getAllInvestors();
  }

  /**
   * Search users
   * GET /users/search/query
   * Admin only
   */
  @Roles("ADMIN")
  @Get("search/query")
  async searchUsers(
    @Query("q") query: string,
    @Query("role") role?: string
  ) {
    return this.usersService.searchUsers(query, role);
  }

  /**
   * Get user count by role
   * GET /users/count/by-role
   * Admin only
   */
  @Roles("ADMIN")
  @Get("count/by-role")
  async getUserCountByRole() {
    return this.usersService.getUserCountByRole();
  }

  /**
   * Bulk create users
   * POST /users/bulk-create
   * Admin only
   */
  @Roles("ADMIN")
  @Post("bulk-create")
  @HttpCode(HttpStatus.CREATED)
  async bulkCreate(@Body("users") users: CreateUserDto[]) {
    return this.usersService.bulkCreateUsers(users);
  }
}