import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  /**
   * Find all users with optional filters
   */
  async findAll(filters?: { role?: string; status?: string; search?: string }) {
    const where: any = {};

    if (filters?.role) {
      where.role = filters.role;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    // If filtering by status, we need to check agent/freelancer profiles
    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        agentProfile: {
          select: {
            id: true,
            status: true,
            totalCommission: true,
            activeDeals: true,
            closedDeals: true,
            cluster: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        freelancerProfile: {
          select: {
            id: true,
            status: true,
            totalCommission: true,
            activeDeals: true,
            closedDeals: true,
            cluster: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Apply status filter if provided
    if (filters?.status) {
      return users.filter((user: any) => {
        if (user.agentProfile) {
          return user.agentProfile.status === filters.status;
        }
        if (user.freelancerProfile) {
          return user.freelancerProfile.status === filters.status;
        }
        return filters.status === "active"; // Default users are active
      });
    }

    return users;
  }

  /**
   * Find user by ID
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        agentProfile: {
          include: {
            cluster: true,
            leadsAsLead: {
              take: 10,
              orderBy: { date: "desc" },
              include: {
                asset: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            leadsAsCloser: {
              take: 10,
              orderBy: { date: "desc" },
              include: {
                asset: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        freelancerProfile: {
          include: {
            cluster: true,
          },
        },
        leadsCreated: {
          take: 10,
          orderBy: {
            dateReceived: "desc",
          },
        },
        transactions: {
          take: 10,
          orderBy: {
            date: "desc",
          },
          include: {
            asset: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        agentProfile: {
          select: {
            id: true,
            status: true,
          },
        },
        freelancerProfile: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string) {
    const user = await this.findById(userId);

    if (user.agentProfile) {
      const [activeDeals, closedDeals, totalCommission] = await Promise.all([
        this.prisma.transaction.count({
          where: {
            OR: [
              { leadAgentId: user.agentProfile.id },
              { closerAgentId: user.agentProfile.id },
            ],
            status: "pending",
          },
        }),
        this.prisma.transaction.count({
          where: {
            OR: [
              { leadAgentId: user.agentProfile.id },
              { closerAgentId: user.agentProfile.id },
            ],
            status: "completed",
          },
        }),
        this.prisma.transaction.aggregate({
          where: {
            OR: [
              { leadAgentId: user.agentProfile.id },
              { closerAgentId: user.agentProfile.id },
            ],
            status: "completed",
          },
          _sum: {
            leadCommission: true,
            closerCommission: true,
          },
        }),
      ]);

      return {
        userType: "agent",
        activeDeals,
        closedDeals,
        totalCommission:
          (totalCommission._sum.leadCommission || 0) +
          (totalCommission._sum.closerCommission || 0),
        cluster: user.agentProfile.cluster,
      };
    }

    if (user.freelancerProfile) {
      return {
        userType: "freelancer",
        totalCommission: user.freelancerProfile.totalCommission,
        cluster: user.freelancerProfile.cluster,
        activeDeals: user.freelancerProfile.activeDeals,
        closedDeals: user.freelancerProfile.closedDeals,
      };
    }

    if (user.role === "INVESTOR") {
      const [totalInvested, activeInvestments] = await Promise.all([
        this.prisma.transaction.aggregate({
          where: {
            buyerId: userId,
            status: "completed",
          },
          _sum: { amount: true },
        }),
        this.prisma.transaction.count({
          where: {
            buyerId: userId,
            status: { in: ["pending", "completed"] },
          },
        }),
      ]);

      return {
        userType: "investor",
        totalInvested: totalInvested._sum.amount || 0,
        activeInvestments,
      };
    }

    return {
      userType: user.role.toLowerCase(),
    };
  }

  /**
   * Get user activity
   */
  async getUserActivity(userId: string, limit = 20) {
    const user = await this.findById(userId);
    const activities: any[] = [];

    // Get transactions
    if (user.transactions.length > 0) {
      activities.push(
        ...user.transactions.map((t: any) => ({
          type: "transaction",
          date: t.date,
          description: `Transaction for ₦${t.amount.toLocaleString()}`,
          data: t,
        }))
      );
    }

    // Get created leads
    if (user.leadsCreated.length > 0) {
      activities.push(
        ...user.leadsCreated.map((l: any) => ({
          type: "lead",
          date: l.dateReceived,
          description: `Created lead for ${l.name}`,
          data: l,
        }))
      );
    }

    // Sort by date and limit
    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }

  /**
   * Get user transactions
   */
  async getUserTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { buyerId: userId },
          {
            leadAgent: {
              userId,
            },
          },
          {
            closerAgent: {
              userId,
            },
          },
        ],
      },
      include: {
        asset: {
          select: {
            name: true,
            referenceCode: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  /**
   * Get user leads
   */
  async getUserLeads(userId: string) {
    return this.prisma.lead.findMany({
      where: {
        createdBy: userId,
      },
      include: {
        asset: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        dateReceived: "desc",
      },
    });
  }

  /**
   * Create new user
   */
  async createUser(data: {
    email: string;
    password: string;
    name: string;
    role?: string;
    phone?: string;
  }) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || "USER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  /**
   * Update user
   */
  async updateUser(userId: string, data: any) {
    await this.findById(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, newRole: string) {
    await this.findById(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  /**
   * Update user password (admin only)
   */
  async updateUserPassword(userId: string, newPassword: string) {
    await this.findById(userId);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      message: "Password updated successfully",
    };
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string) {
    const user = await this.findById(userId);

    // If user is an agent, deactivate agent profile
    if (user.agentProfile) {
      await this.prisma.agent.update({
        where: { id: user.agentProfile.id },
        data: { status: "inactive" },
      });
    }

    // If user is a freelancer, deactivate freelancer profile
    if (user.freelancerProfile) {
      await this.prisma.freelancer.update({
        where: { id: user.freelancerProfile.id },
        data: { status: "inactive" },
      });
    }

    return { message: "User deactivated successfully" };
  }

  /**
   * Reactivate user
   */
  async reactivateUser(userId: string) {
    const user = await this.findById(userId);

    // If user is an agent, reactivate agent profile
    if (user.agentProfile) {
      await this.prisma.agent.update({
        where: { id: user.agentProfile.id },
        data: { status: "active" },
      });
    }

    // If user is a freelancer, reactivate freelancer profile
    if (user.freelancerProfile) {
      await this.prisma.freelancer.update({
        where: { id: user.freelancerProfile.id },
        data: { status: "active" },
      });
    }

    return { message: "User reactivated successfully" };
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string) {
    await this.findById(userId);

    // Check for dependencies
    const transactionCount = await this.prisma.transaction.count({
      where: { buyerId: userId },
    });

    if (transactionCount > 0) {
      throw new Error(
        "Cannot delete user with existing transactions. Please deactivate instead."
      );
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: "User deleted successfully" };
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: string) {
    return this.prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get user dashboard data
   */
  async getUserDashboard(userId: string) {
    const stats = await this.getUserStats(userId);
    const recentActivity = await this.getUserActivity(userId, 10);

    return {
      stats,
      recentActivity,
    };
  }

  /**
   * Get all agents
   */
  async getAllAgents() {
    return this.prisma.user.findMany({
      where: {
        agentProfile: {
          isNot: null,
        },
      },
      include: {
        agentProfile: {
          include: {
            cluster: true,
          },
        },
      },
    });
  }

  /**
   * Get all investors
   */
  async getAllInvestors() {
    return this.prisma.user.findMany({
      where: { role: "INVESTOR" },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }

  /**
   * Search users
   */
  async searchUsers(query: string, role?: string) {
    const where: any = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    };

    if (role) {
      where.role = role;
    }

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
      take: 20,
    });
  }

  /**
   * Get user count by role
   */
  async getUserCountByRole() {
    const counts = await this.prisma.user.groupBy({
      by: ["role"],
      _count: true,
    });

    return counts.map((item: any) => ({
      role: item.role,
      count: item._count,
    }));
  }

  /**
   * Bulk create users
   */
  async bulkCreateUsers(users: any[]) {
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
        role: user.role || "USER",
      }))
    );

    const result = await this.prisma.user.createMany({
      data: hashedUsers,
      skipDuplicates: true,
    });

    return {
      message: `${result.count} users created successfully`,
      count: result.count,
    };
  }
}