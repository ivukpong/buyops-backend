import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class FreelancersService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.freelancer.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findById(id: string) {
        const freelancer = await this.prisma.freelancer.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                cluster: true,
            },
        });

        if (!freelancer) {
            throw new NotFoundException(`Freelancer with ID ${id} not found`);
        }

        return freelancer;
    }

    async create(data: {
        name: string;
        email: string;
        phone: string;
        registeredBy: string;
        registrarName: string;
        registrarType: string;
        cluster: string;
        status: string;
    }) {
        // Check if user with this email exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            // Check if user is already a freelancer
            const existingFreelancer = await this.prisma.freelancer.findUnique({
                where: { userId: existingUser.id },
            });

            if (existingFreelancer) {
                throw new ConflictException("User is already registered as a freelancer");
            }
        }

        // Create user if doesn't exist
        let user;
        if (existingUser) {
            user = existingUser;
        } else {
            const hashedPassword = await bcrypt.hash("password123", 10); // Default password
            user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                    role: "SALES",
                },
            });
        }

        // Create freelancer profile
        const freelancer = await this.prisma.freelancer.create({
            data: {
                userId: user.id,
                registeredBy: data.registeredBy,
                registrarName: data.registrarName,
                registrarType: data.registrarType,
                clusterId: data.cluster,
                status: data.status || "active",
                activeDeals: 0,
                closedDeals: 0,
                totalCommission: 0,
                performance: 0,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return freelancer;
    }

    async update(id: string, data: any) {
        // Check if freelancer exists
        const freelancer = await this.findById(id);

        // Update user info if provided
        if (data.name || data.email) {
            await this.prisma.user.update({
                where: { id: freelancer.userId },
                data: {
                    name: data.name,
                    email: data.email,
                },
            });
        }

        // Update freelancer profile
        const updateData: any = {};
        if (data.cluster) updateData.clusterId = data.cluster;
        if (data.status) updateData.status = data.status;
        if (data.registeredBy) updateData.registeredBy = data.registeredBy;
        if (data.registrarName) updateData.registrarName = data.registrarName;
        if (data.registrarType) updateData.registrarType = data.registrarType;

        return this.prisma.freelancer.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async delete(id: string) {
        // Check if freelancer exists
        const freelancer = await this.findById(id);

        // Check if freelancer has active deals
        // This would require a separate deals/transactions table for freelancers
        // For now, just delete the profile

        // Delete freelancer profile (user remains)
        return this.prisma.freelancer.delete({
            where: { id },
        });
    }

    async getStats() {
        const [
            totalFreelancers,
            activeFreelancers,
            totalCommission,
        ] = await Promise.all([
            this.prisma.freelancer.count(),
            this.prisma.freelancer.count({ where: { status: "active" } }),
            this.prisma.freelancer.aggregate({
                _sum: {
                    totalCommission: true,
                    activeDeals: true,
                    closedDeals: true,
                },
            }),
        ]);

        return {
            totalFreelancers,
            activeFreelancers,
            totalActiveDeals: totalCommission._sum.activeDeals || 0,
            totalClosedDeals: totalCommission._sum.closedDeals || 0,
            totalCommission: totalCommission._sum.totalCommission || 0,
        };
    }

    async getFreelancersByRegistrar(registrarId: string) {
        return this.prisma.freelancer.findMany({
            where: {
                registeredBy: registrarId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async updateFreelancerStats(freelancerId: string) {
        // This would be called after deals are completed
        // For now, just return the freelancer
        return this.findById(freelancerId);
    }
}