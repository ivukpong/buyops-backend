/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/agents/agents.controller.ts":
/*!*****************************************!*\
  !*** ./src/agents/agents.controller.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AgentsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const agents_service_1 = __webpack_require__(/*! ./agents.service */ "./src/agents/agents.service.ts");
class CreateAgentDto {
}
let AgentsController = class AgentsController {
    constructor(agentsService) {
        this.agentsService = agentsService;
    }
    async findAll() {
        return this.agentsService.findAll();
    }
    async getStats() {
        return this.agentsService.getStats();
    }
    async findOne(id) {
        return this.agentsService.findById(id);
    }
    async create(dto) {
        return this.agentsService.create(dto);
    }
    async update(id, dto) {
        return this.agentsService.update(id, dto);
    }
    async remove(id) {
        return this.agentsService.delete(id);
    }
};
exports.AgentsController = AgentsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAgentDto]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "remove", null);
exports.AgentsController = AgentsController = __decorate([
    (0, common_1.Controller)("agents"),
    __metadata("design:paramtypes", [typeof (_a = typeof agents_service_1.AgentsService !== "undefined" && agents_service_1.AgentsService) === "function" ? _a : Object])
], AgentsController);


/***/ }),

/***/ "./src/agents/agents.module.ts":
/*!*************************************!*\
  !*** ./src/agents/agents.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AgentsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const agents_controller_1 = __webpack_require__(/*! ./agents.controller */ "./src/agents/agents.controller.ts");
const agents_service_1 = __webpack_require__(/*! ./agents.service */ "./src/agents/agents.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let AgentsModule = class AgentsModule {
};
exports.AgentsModule = AgentsModule;
exports.AgentsModule = AgentsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [agents_controller_1.AgentsController],
        providers: [agents_service_1.AgentsService],
        exports: [agents_service_1.AgentsService],
    })
], AgentsModule);


/***/ }),

/***/ "./src/agents/agents.service.ts":
/*!**************************************!*\
  !*** ./src/agents/agents.service.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AgentsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const bcrypt = __importStar(__webpack_require__(/*! bcrypt */ "bcrypt"));
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let AgentsService = class AgentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const agents = await this.prisma.agent.findMany({
            include: {
                user: { select: { id: true, email: true, name: true, phone: true, role: true } },
                cluster: { select: { id: true, name: true } },
                _count: { select: { leadTransactions: true } },
            },
            orderBy: { status: 'asc' },
        });
        return agents.map(agent => ({
            id: agent.id,
            name: agent.user?.name ?? "",
            email: agent.user?.email ?? "",
            phone: agent.user?.phone ?? "",
            cluster: agent.cluster?.name ?? "",
            clusterId: agent.cluster?.id ?? "",
            role: agent.user?.role ?? "AGENT",
            status: agent.status?.toLowerCase() ?? "pending",
            activeDeals: agent._count.leadTransactions,
            closedDeals: agent.closedDeals,
            totalCommission: agent.totalCommission,
            performance: agent.closedDeals > 0 ? Math.min(100, Math.round((agent.closedDeals / 10) * 100)) : 0,
        }));
    }
    async findById(id) {
        const agent = await this.prisma.agent.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: true,
                assignedLeads: { orderBy: { createdAt: 'desc' }, take: 10 },
                leadTransactions: { orderBy: { date: 'desc' }, take: 10 },
                closerTransactions: { orderBy: { date: 'desc' }, take: 10 },
                commissions: { orderBy: { createdAt: 'desc' }, take: 10 },
            },
        });
        if (!agent)
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        return agent;
    }
    async create(data) {
        if (!data.name)
            throw new common_1.BadRequestException('Name is required');
        if (!data.email)
            throw new common_1.BadRequestException('Email is required');
        let user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (user) {
            const existing = await this.prisma.agent.findUnique({ where: { userId: user.id } });
            if (existing)
                throw new common_1.ConflictException('User is already registered as an agent');
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    name: data.name,
                    phone: data.phone,
                    role: (data.role ? client_1.UserRole[data.role.toUpperCase()] : client_1.UserRole.AGENT),
                },
            });
        }
        else {
            const hashedPassword = await bcrypt.hash('password123', 10);
            user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                    phone: data.phone,
                    role: (data.role ? client_1.UserRole[data.role.toUpperCase()] : client_1.UserRole.AGENT),
                },
            });
        }
        return this.prisma.agent.create({
            data: {
                userId: user.id,
                clusterId: data.cluster || null,
                status: data.status || 'PENDING',
                closedDeals: 0,
                totalCommission: 0,
            },
            include: {
                user: { select: { id: true, email: true, name: true, phone: true, role: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, data) {
        const agent = await this.findById(id);
        if (data.name || data.email || data.phone || data.role) {
            await this.prisma.user.update({
                where: { id: agent.userId },
                data: {
                    ...(data.name ? { name: data.name } : {}),
                    ...(data.email ? { email: data.email } : {}),
                    ...(data.phone ? { phone: data.phone } : {}),
                    ...(data.role ? { role: data.role.toUpperCase() } : {}),
                },
            });
        }
        const updateData = {};
        if (data.cluster !== undefined)
            updateData.clusterId = data.cluster;
        if (data.status !== undefined)
            updateData.status = data.status;
        return this.prisma.agent.update({
            where: { id },
            data: updateData,
            include: {
                user: { select: { id: true, email: true, name: true, phone: true, role: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.agent.delete({ where: { id } });
        return { message: 'Agent deleted successfully', id };
    }
    async getStats() {
        const [total, active, pending] = await Promise.all([
            this.prisma.agent.count(),
            this.prisma.agent.count({ where: { status: 'ACTIVE' } }),
            this.prisma.agent.count({ where: { status: 'PENDING' } }),
        ]);
        const commissionAgg = await this.prisma.agent.aggregate({ _sum: { totalCommission: true, closedDeals: true } });
        return {
            totalAgents: total,
            activeAgents: active,
            pendingAgents: pending,
            totalClosedDeals: commissionAgg._sum.closedDeals || 0,
            totalCommission: commissionAgg._sum.totalCommission || 0,
        };
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AgentsService);


/***/ }),

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ "./src/auth/auth.module.ts");
const users_module_1 = __webpack_require__(/*! ./users/users.module */ "./src/users/users.module.ts");
const assets_module_1 = __webpack_require__(/*! ./assets/assets.module */ "./src/assets/assets.module.ts");
const companies_module_1 = __webpack_require__(/*! ./companies/companies.module */ "./src/companies/companies.module.ts");
const agents_module_1 = __webpack_require__(/*! ./agents/agents.module */ "./src/agents/agents.module.ts");
const clusters_module_1 = __webpack_require__(/*! ./clusters/clusters.module */ "./src/clusters/clusters.module.ts");
const leads_module_1 = __webpack_require__(/*! ./leads/leads.module */ "./src/leads/leads.module.ts");
const transactions_module_1 = __webpack_require__(/*! ./transactions/transactions.module */ "./src/transactions/transactions.module.ts");
const installments_module_1 = __webpack_require__(/*! ./installments/installments.module */ "./src/installments/installments.module.ts");
const notification_module_1 = __webpack_require__(/*! ./notification/notification.module */ "./src/notification/notification.module.ts");
const sales_module_1 = __webpack_require__(/*! ./sales/sales.module */ "./src/sales/sales.module.ts");
const investments_module_1 = __webpack_require__(/*! ./investments/investments.module */ "./src/investments/investments.module.ts");
const dashboard_module_1 = __webpack_require__(/*! ./dashboard/dashboard.module */ "./src/dashboard/dashboard.module.ts");
const reports_module_1 = __webpack_require__(/*! ./reports/reports.module */ "./src/reports/reports.module.ts");
const freelancers_module_1 = __webpack_require__(/*! ./freelancers/freelancers.module */ "./src/freelancers/freelancers.module.ts");
const prisma_module_1 = __webpack_require__(/*! ./prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || '3600s' },
                }),
                inject: [config_1.ConfigService],
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            assets_module_1.AssetsModule,
            companies_module_1.CompaniesModule,
            agents_module_1.AgentsModule,
            clusters_module_1.ClustersModule,
            leads_module_1.LeadsModule,
            transactions_module_1.TransactionsModule,
            installments_module_1.InstallmentsModule,
            notification_module_1.NotificationModule,
            sales_module_1.SalesModule,
            investments_module_1.InvestmentsModule,
            dashboard_module_1.DashboardModule,
            reports_module_1.ReportsModule,
            freelancers_module_1.FreelancersModule,
        ],
    })
], AppModule);


/***/ }),

/***/ "./src/assets/assets.controller.ts":
/*!*****************************************!*\
  !*** ./src/assets/assets.controller.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const assets_service_1 = __webpack_require__(/*! ./assets.service */ "./src/assets/assets.service.ts");
let AssetsController = class AssetsController {
    constructor(assetsService) {
        this.assetsService = assetsService;
    }
    async findAll(query) {
        return this.assetsService.findAll(query);
    }
    async findOne(id) {
        return this.assetsService.findById(id);
    }
    async create(createAssetDto) {
        return this.assetsService.create(createAssetDto);
    }
    async update(id, updateAssetDto) {
        return this.assetsService.update(id, updateAssetDto);
    }
    async delete(id) {
        return this.assetsService.delete(id);
    }
    async publish(id) {
        return this.assetsService.publish(id);
    }
    async unpublish(id) {
        return this.assetsService.unpublish(id);
    }
    async addImage(id, imageData) {
        return this.assetsService.addImage(id, imageData);
    }
    async deleteImage(id, imageId) {
        return this.assetsService.deleteImage(id, imageId);
    }
    async addDocument(id, documentData) {
        return this.assetsService.addDocument(id, documentData);
    }
    async deleteDocument(id, documentId) {
        return this.assetsService.deleteDocument(id, documentId);
    }
};
exports.AssetsController = AssetsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':id/publish'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "publish", null);
__decorate([
    (0, common_1.Put)(':id/unpublish'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "unpublish", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "addImage", null);
__decorate([
    (0, common_1.Delete)(':id/images/:imageId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "addDocument", null);
__decorate([
    (0, common_1.Delete)(':id/documents/:documentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "deleteDocument", null);
exports.AssetsController = AssetsController = __decorate([
    (0, common_1.Controller)('assets'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [typeof (_a = typeof assets_service_1.AssetsService !== "undefined" && assets_service_1.AssetsService) === "function" ? _a : Object])
], AssetsController);


/***/ }),

/***/ "./src/assets/assets.module.ts":
/*!*************************************!*\
  !*** ./src/assets/assets.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const assets_controller_1 = __webpack_require__(/*! ./assets.controller */ "./src/assets/assets.controller.ts");
const assets_service_1 = __webpack_require__(/*! ./assets.service */ "./src/assets/assets.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let AssetsModule = class AssetsModule {
};
exports.AssetsModule = AssetsModule;
exports.AssetsModule = AssetsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [assets_controller_1.AssetsController],
        providers: [assets_service_1.AssetsService],
        exports: [assets_service_1.AssetsService],
    })
], AssetsModule);


/***/ }),

/***/ "./src/assets/assets.service.ts":
/*!**************************************!*\
  !*** ./src/assets/assets.service.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let AssetsService = class AssetsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async publish(id) {
        await this.findById(id);
        return this.prisma.asset.update({
            where: { id },
            data: { status: 'published' },
        });
    }
    async unpublish(id) {
        await this.findById(id);
        return this.prisma.asset.update({
            where: { id },
            data: { status: 'draft' },
        });
    }
    async deleteImage(assetId, imageId) {
        await this.findById(assetId);
        return this.prisma.assetImage.delete({ where: { id: imageId } });
    }
    async deleteDocument(assetId, documentId) {
        await this.findById(assetId);
        return this.prisma.assetDocument.delete({ where: { id: documentId } });
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.type)
            where.type = filters.type;
        if (filters?.companyId)
            where.companyId = filters.companyId;
        const assets = await this.prisma.asset.findMany({
            where,
            include: {
                company: { select: { id: true, name: true } },
                images: { orderBy: { order: 'asc' } },
                documents: true,
                leads: { orderBy: { createdAt: 'desc' }, take: 10 },
                transactions: { orderBy: { date: 'desc' }, take: 10 },
                installmentPlans: true,
                _count: { select: { leads: true, transactions: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return assets.map(asset => ({
            id: asset.id,
            title: asset.title ?? asset.name,
            type: asset.type,
            price: asset.price,
            priceRange: asset.priceRange,
            commission: asset.commission,
            commissionRate: asset.commissionRate,
            location: asset.location,
            status: asset.status,
            projectStatus: asset.projectStatus,
            area: asset.area,
            units: asset.units,
            bedrooms: asset.bedrooms,
            bathrooms: asset.bathrooms,
            parking: asset.parking,
            furnished: asset.furnished,
            facilities: asset.facilities ?? [],
            ownershipOptions: asset.ownershipOptions ?? [],
            fractionCost: asset.fractionCost,
            fundingStatus: asset.fundingStatus,
            rentalYield: asset.rentalYield,
            capitalAppreciation: asset.capitalAppreciation,
            totalReturns: asset.totalReturns,
            riskLevel: asset.riskLevel,
            constructionStage: asset.constructionStage,
            images: asset.images ?? 0,
            virtualTours: asset.virtualTours ?? 0,
            documents: asset.documents ?? 0,
            description: asset.description,
            leads: asset.leads ?? [],
            projectedRentalIncome: Number(asset.projectedRentalIncome) || 0,
        }));
    }
    async findById(id) {
        const asset = await this.prisma.asset.findUnique({
            where: { id },
            include: {
                company: true,
                images: { orderBy: { order: 'asc' } },
                documents: true,
                leads: { orderBy: { createdAt: 'desc' }, take: 10 },
                transactions: { orderBy: { date: 'desc' }, take: 10 },
                installmentPlans: true,
                _count: { select: { leads: true, transactions: true } },
            },
        });
        if (!asset)
            throw new common_1.NotFoundException(`Asset with ID ${id} not found`);
        return asset;
    }
    async create(data) {
        if (!data.name)
            throw new common_1.BadRequestException('Asset name is required');
        if (!data.companyId)
            throw new common_1.BadRequestException('Company ID is required');
        const company = await this.prisma.company.findUnique({ where: { id: data.companyId } });
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        return this.prisma.asset.create({
            data: {
                name: data.name,
                companyId: data.companyId,
                type: data.type || null,
                status: data.status || 'draft',
                location: data.location || null,
                description: data.description || null,
                totalUnits: data.totalUnits ? parseInt(data.totalUnits) : null,
                availableUnits: data.availableUnits ? parseInt(data.availableUnits) : null,
                projectedRentalIncome: data.projectedRentalIncome ? parseFloat(data.projectedRentalIncome) : null,
                rentalYieldMin: data.rentalYieldMin ? parseFloat(data.rentalYieldMin) : null,
                rentalYieldMax: data.rentalYieldMax ? parseFloat(data.rentalYieldMax) : null,
                capitalAppreciation: data.capitalAppreciation ? parseFloat(data.capitalAppreciation) : null,
                capitalAppreciationMin: data.capitalAppreciationMin ? parseFloat(data.capitalAppreciationMin) : null,
                capitalAppreciationMax: data.capitalAppreciationMax ? parseFloat(data.capitalAppreciationMax) : null,
                totalReturnsMin: data.totalReturnsMin ? parseFloat(data.totalReturnsMin) : null,
                totalReturnsMax: data.totalReturnsMax ? parseFloat(data.totalReturnsMax) : null,
                riskLevel: data.riskLevel || null,
                riskFactors: data.riskFactors || [],
            },
            include: { company: { select: { id: true, name: true } } },
        });
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.type !== undefined)
            updateData.type = data.type;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.location !== undefined)
            updateData.location = data.location;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.companyId !== undefined)
            updateData.companyId = data.companyId;
        if (data.totalUnits !== undefined)
            updateData.totalUnits = parseInt(data.totalUnits);
        if (data.availableUnits !== undefined)
            updateData.availableUnits = parseInt(data.availableUnits);
        if (data.riskLevel !== undefined)
            updateData.riskLevel = data.riskLevel;
        return this.prisma.asset.update({
            where: { id },
            data: updateData,
            include: { company: { select: { id: true, name: true } } },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.asset.delete({ where: { id } });
        return { message: 'Asset deleted successfully', id };
    }
    async addImage(assetId, imageData) {
        await this.findById(assetId);
        return this.prisma.assetImage.create({
            data: {
                assetId,
                url: imageData.url,
                caption: imageData.caption || null,
                order: imageData.order || 0,
            },
        });
    }
    async removeImage(imageId) {
        return this.prisma.assetImage.delete({ where: { id: imageId } });
    }
    async addDocument(assetId, docData) {
        await this.findById(assetId);
        return this.prisma.assetDocument.create({
            data: {
                assetId,
                url: docData.url,
                title: docData.title || null,
                type: docData.type || null,
            },
        });
    }
    async removeDocument(docId) {
        return this.prisma.assetDocument.delete({ where: { id: docId } });
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AssetsService);


/***/ }),

/***/ "./src/auth/auth.controller.ts":
/*!*************************************!*\
  !*** ./src/auth/auth.controller.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = exports.RefreshTokenDto = exports.RegisterDto = exports.LoginDto = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/auth/auth.service.ts");
const users_service_1 = __webpack_require__(/*! ../users/users.service */ "./src/users/users.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ./jwt-auth.guard */ "./src/auth/jwt-auth.guard.ts");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof client_1.UserRole !== "undefined" && client_1.UserRole) === "function" ? _a : Object)
], RegisterDto.prototype, "role", void 0);
class RefreshTokenDto {
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);
let AuthController = class AuthController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async login(dto) {
        const user = await this.authService.validateUser(dto.email, dto.password);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.authService.login(user);
    }
    async register(dto) {
        return this.authService.register(dto);
    }
    async refreshToken(dto) {
        return this.authService.refreshToken(dto.refreshToken);
    }
    async getProfile(req) {
        return this.usersService.findById(req.user.id);
    }
    async updateProfile(req, dto) {
        return this.usersService.updateUser(req.user.id, dto);
    }
    async changePassword(req, body) {
        return this.authService.changePassword(req.user.id, body.currentPassword, body.newPassword);
    }
    async logout(req) {
        return this.authService.logout(req.user.id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object, typeof (_c = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _c : Object])
], AuthController);


/***/ }),

/***/ "./src/auth/auth.module.ts":
/*!*********************************!*\
  !*** ./src/auth/auth.module.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/auth/auth.controller.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/auth/auth.service.ts");
const jwt_strategy_1 = __webpack_require__(/*! ./jwt.strategy */ "./src/auth/jwt.strategy.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
const users_service_1 = __webpack_require__(/*! src/users/users.service */ "./src/users/users.service.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'buyops26',
                signOptions: { expiresIn: '7d' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, users_service_1.UsersService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),

/***/ "./src/auth/auth.service.ts":
/*!**********************************!*\
  !*** ./src/auth/auth.service.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const bcrypt = __importStar(__webpack_require__(/*! bcrypt */ "bcrypt"));
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user)
            return null;
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
            return null;
        const { password: _, ...result } = user;
        return result;
    }
    async login(user) {
        console.log('LOGIN USER:', user);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name || user.email.split('@')[0],
                role: user.role || 'USER',
            },
        };
    }
    async register(data) {
        const normalizedEmail = data.email.trim().toLowerCase();
        const existing = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const strongPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!strongPassword.test(data.password)) {
            throw new common_1.ConflictException('Password must be at least 8 characters long and include a number and a special character.');
        }
        const hashed = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: normalizedEmail,
                password: hashed,
                name: data.name || normalizedEmail.split('@')[0],
                role: data.role || client_1.UserRole.USER,
            },
        });
        const { password: _, ...result } = user;
        return this.login(result);
    }
    async validateToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, email: true, name: true, role: true },
            });
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            return user;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, email: true, name: true, role: true },
            });
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            return this.login(user);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        const hashed = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashed },
        });
        return { message: 'Password changed successfully' };
    }
    async forgotPassword(email) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            return { message: 'If an account exists, a reset link has been sent.' };
        }
        const resetToken = this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '1h' });
        console.log(`Reset password token for ${email}: ${resetToken}`);
        return {
            message: 'If an account exists, a reset link has been sent.',
        };
    }
    async resetPassword(token, newPassword) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user)
                throw new common_1.UnauthorizedException('Invalid reset token');
            const hashed = await bcrypt.hash(newPassword, 10);
            await this.prisma.user.update({
                where: { id: user.id },
                data: { password: hashed },
            });
            return { message: 'Password reset successfully' };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
    }
    async verifyEmail(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user)
                throw new common_1.UnauthorizedException('Invalid verification token');
            return { message: 'Email verified successfully' };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired verification token');
        }
    }
    async resendVerificationEmail(email) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            return { message: 'If an account exists, a verification link has been sent.' };
        }
        const verificationToken = this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '24h' });
        console.log(`Verification token for ${email}: ${verificationToken}`);
        return {
            message: 'If an account exists, a verification link has been sent.',
        };
    }
    async logout(userId) {
        return { message: 'Logged out successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),

/***/ "./src/auth/jwt-auth.guard.ts":
/*!************************************!*\
  !*** ./src/auth/jwt-auth.guard.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (request.method === 'OPTIONS') {
            return true;
        }
        return super.canActivate(context);
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),

/***/ "./src/auth/jwt.strategy.ts":
/*!**********************************!*\
  !*** ./src/auth/jwt.strategy.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(prisma) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
        this.prisma = prisma;
    }
    async validate(payload) {
        const userId = payload?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException("Invalid token: missing user identifier");
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),

/***/ "./src/clusters/clusters.controller.ts":
/*!*********************************************!*\
  !*** ./src/clusters/clusters.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClustersController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const clusters_service_1 = __webpack_require__(/*! ./clusters.service */ "./src/clusters/clusters.service.ts");
class CreateClusterDto {
}
let ClustersController = class ClustersController {
    constructor(clustersService) {
        this.clustersService = clustersService;
    }
    async findAll() {
        return this.clustersService.findAll();
    }
    async getStats() {
        return this.clustersService.getStats();
    }
    async findOne(id) {
        return this.clustersService.findById(id);
    }
    async create(dto) {
        return this.clustersService.create(dto);
    }
    async update(id, dto) {
        return this.clustersService.update(id, dto);
    }
    async remove(id) {
        return this.clustersService.delete(id);
    }
};
exports.ClustersController = ClustersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateClusterDto]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "remove", null);
exports.ClustersController = ClustersController = __decorate([
    (0, common_1.Controller)("clusters"),
    __metadata("design:paramtypes", [typeof (_a = typeof clusters_service_1.ClustersService !== "undefined" && clusters_service_1.ClustersService) === "function" ? _a : Object])
], ClustersController);


/***/ }),

/***/ "./src/clusters/clusters.module.ts":
/*!*****************************************!*\
  !*** ./src/clusters/clusters.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClustersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const clusters_controller_1 = __webpack_require__(/*! ./clusters.controller */ "./src/clusters/clusters.controller.ts");
const clusters_service_1 = __webpack_require__(/*! ./clusters.service */ "./src/clusters/clusters.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let ClustersModule = class ClustersModule {
};
exports.ClustersModule = ClustersModule;
exports.ClustersModule = ClustersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [clusters_controller_1.ClustersController],
        providers: [clusters_service_1.ClustersService],
        exports: [clusters_service_1.ClustersService],
    })
], ClustersModule);


/***/ }),

/***/ "./src/clusters/clusters.service.ts":
/*!******************************************!*\
  !*** ./src/clusters/clusters.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClustersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let ClustersService = class ClustersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const clusters = await this.prisma.cluster.findMany({
            include: {
                manager: { select: { id: true, name: true, email: true } },
                agents: {
                    include: {
                        user: { select: { id: true, name: true } },
                    },
                },
                freelancers: {
                    include: { user: { select: { id: true, name: true } } },
                },
                _count: { select: { agents: true, freelancers: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return await Promise.all(clusters.map(async (cluster) => {
            const teamLead = cluster.manager?.name ?? "";
            const agents = cluster._count.agents;
            const agentIds = cluster.agents.map(a => a.id);
            const activeAssets = await this.prisma.asset.count({
                where: {
                    status: { in: ['published', 'active'] },
                },
            });
            const totalCommission = await this.prisma.agent.aggregate({
                where: { clusterId: cluster.id },
                _sum: { totalCommission: true },
            });
            return {
                id: cluster.id,
                name: cluster.name,
                teamLead,
                agents,
                activeAssets,
                totalCommission: totalCommission._sum.totalCommission || 0,
                status: cluster.status,
                location: cluster.location,
                code: cluster.code,
            };
        }));
    }
    async findById(id) {
        const cluster = await this.prisma.cluster.findUnique({
            where: { id },
            include: {
                manager: { select: { id: true, name: true, email: true } },
                agents: {
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                        assignedLeads: true,
                        leadTransactions: true,
                        closerTransactions: true,
                    },
                },
                freelancers: {
                    include: { user: { select: { id: true, name: true, email: true } } },
                },
            },
        });
        if (!cluster)
            throw new common_1.NotFoundException(`Cluster with ID ${id} not found`);
        return cluster;
    }
    async create(data) {
        if (!data.name)
            throw new common_1.BadRequestException('Cluster name is required');
        return this.prisma.cluster.create({
            data: {
                name: data.name,
                code: data.code || null,
                status: data.status || 'active',
                location: data.location || null,
                managerId: data.teamLead || null,
            },
            include: {
                manager: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.code !== undefined)
            updateData.code = data.code;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.location !== undefined)
            updateData.location = data.location;
        if (data.teamLead !== undefined)
            updateData.managerId = data.teamLead;
        return this.prisma.cluster.update({
            where: { id },
            data: updateData,
            include: { manager: { select: { id: true, name: true } } },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.cluster.delete({ where: { id } });
        return { message: 'Cluster deleted successfully', id };
    }
    async getStats() {
        const [total, active, agents, freelancers] = await Promise.all([
            this.prisma.cluster.count(),
            this.prisma.cluster.count({ where: { status: 'active' } }),
            this.prisma.agent.count(),
            this.prisma.freelancer.count(),
        ]);
        return { totalClusters: total, activeClusters: active, totalAgents: agents, totalFreelancers: freelancers };
    }
};
exports.ClustersService = ClustersService;
exports.ClustersService = ClustersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ClustersService);


/***/ }),

/***/ "./src/common/roles.decorator.ts":
/*!***************************************!*\
  !*** ./src/common/roles.decorator.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
exports.ROLES_KEY = "roles";
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),

/***/ "./src/common/roles.guard.ts":
/*!***********************************!*\
  !*** ./src/common/roles.guard.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const roles_decorator_1 = __webpack_require__(/*! ./roles.decorator */ "./src/common/roles.decorator.ts");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user)
            return false;
        return requiredRoles.includes(user.role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),

/***/ "./src/companies/companies.controller.ts":
/*!***********************************************!*\
  !*** ./src/companies/companies.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompaniesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const companies_service_1 = __webpack_require__(/*! ./companies.service */ "./src/companies/companies.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! src/auth/jwt-auth.guard */ "./src/auth/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../common/roles.guard */ "./src/common/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../common/roles.decorator */ "./src/common/roles.decorator.ts");
const create_company_dto_1 = __webpack_require__(/*! ./dto/create-company.dto */ "./src/companies/dto/create-company.dto.ts");
let CompaniesController = class CompaniesController {
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    async findAll() {
        return this.companiesService.findAll();
    }
    async findOne(id) {
        console.log("Fetching company with ID:", id);
        return this.companiesService.findById(id);
    }
    async create(dto) {
        try {
            return await this.companiesService.create(dto);
        }
        catch (err) {
            if (err.name === 'ValidationError' || err.status === 400) {
                throw err;
            }
            throw new Error('Invalid company data: ' + (err.message || err));
        }
    }
    async update(id, dto) {
        return this.companiesService.update(id, dto);
    }
    async remove(id) {
        return this.companiesService.delete(id);
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_company_dto_1.CreateCompanyDto !== "undefined" && create_company_dto_1.CreateCompanyDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof Partial !== "undefined" && Partial) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "remove", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, common_1.Controller)("companies"),
    __metadata("design:paramtypes", [typeof (_a = typeof companies_service_1.CompaniesService !== "undefined" && companies_service_1.CompaniesService) === "function" ? _a : Object])
], CompaniesController);


/***/ }),

/***/ "./src/companies/companies.module.ts":
/*!*******************************************!*\
  !*** ./src/companies/companies.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompaniesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const companies_controller_1 = __webpack_require__(/*! ./companies.controller */ "./src/companies/companies.controller.ts");
const companies_service_1 = __webpack_require__(/*! ./companies.service */ "./src/companies/companies.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let CompaniesModule = class CompaniesModule {
};
exports.CompaniesModule = CompaniesModule;
exports.CompaniesModule = CompaniesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [companies_controller_1.CompaniesController],
        providers: [companies_service_1.CompaniesService],
        exports: [companies_service_1.CompaniesService],
    })
], CompaniesModule);


/***/ }),

/***/ "./src/companies/companies.service.ts":
/*!********************************************!*\
  !*** ./src/companies/companies.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompaniesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let CompaniesService = class CompaniesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const companies = await this.prisma.company.findMany({
            include: {
                assets: { select: { id: true, name: true, type: true, status: true } },
                _count: { select: { assets: true, transactions: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return companies.map(company => ({
            ...company,
            activeAssets: company.assets.filter(asset => asset.status === 'AVAILABLE').length,
            totalTransactions: company._count.transactions,
        }));
    }
    async findById(id) {
        if (!id || id.trim() === '')
            throw new common_1.BadRequestException('Company ID is required');
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: {
                assets: { select: { id: true, name: true, type: true, status: true } },
                transactions: { select: { id: true, totalAmount: true, status: true, date: true }, take: 10, orderBy: { date: 'desc' } },
                _count: { select: { assets: true, transactions: true } },
            },
        });
        if (!company)
            throw new common_1.NotFoundException(`Company with ID ${id} not found`);
        return company;
    }
    async create(data) {
        try {
            if (!data.name || !data.name.trim())
                throw new common_1.BadRequestException('Company name is required');
            if (!data.email || !data.email.trim())
                throw new common_1.BadRequestException('Email is required');
            if (!data.type || !['developer', 'realtor', 'partner', 'consultant', 'investor'].includes(data.type)) {
                throw new common_1.BadRequestException('Company type is required and must be one of: developer, realtor, partner, consultant, investor');
            }
            const existing = await this.prisma.company.findFirst({ where: { email: data.email.toLowerCase().trim() } });
            if (existing)
                throw new common_1.ConflictException('A company with this email already exists');
            const company = await this.prisma.company.create({
                data: {
                    name: data.name.trim(),
                    type: data.type,
                    email: data.email.toLowerCase().trim(),
                    phone: data.phone?.trim() || null,
                    status: data.status || 'active',
                    contactPerson: data.contactPerson?.trim() || null,
                    address: data.address?.trim() || null,
                    commissionRate: data.commissionRate ? parseFloat(data.commissionRate) : 0,
                    paymentTerms: data.paymentTerms?.trim() || null,
                    agreementStartDate: data.agreementStartDate ? new Date(data.agreementStartDate) : null,
                    agreementExpiryDate: data.agreementExpiryDate ? new Date(data.agreementExpiryDate) : null,
                    registrationNumber: data.registrationNumber?.trim() || null,
                    notes: data.notes?.trim() || null,
                    accountName: data.accountName?.trim() || null,
                    bankName: data.bankName?.trim() || null,
                    accountNumber: data.accountNumber?.trim() || null,
                },
                include: { _count: { select: { assets: true, transactions: true } } },
            });
            return company;
        }
        catch (error) {
            if (error.code === 'P2002') {
                const field = error.meta?.target?.[0] || 'field';
                throw new common_1.ConflictException(`A company with this ${field} already exists`);
            }
            if (error instanceof common_1.BadRequestException || error instanceof common_1.ConflictException)
                throw error;
            console.error('Company creation error:', error);
            throw new common_1.InternalServerErrorException('Failed to create company');
        }
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name.trim();
        if (data.type !== undefined)
            updateData.type = data.type;
        if (data.email !== undefined)
            updateData.email = data.email.toLowerCase().trim();
        if (data.phone !== undefined)
            updateData.phone = data.phone?.trim();
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.contactPerson !== undefined)
            updateData.contactPerson = data.contactPerson?.trim();
        if (data.address !== undefined)
            updateData.address = data.address?.trim();
        if (data.commissionRate !== undefined)
            updateData.commissionRate = parseFloat(data.commissionRate);
        if (data.paymentTerms !== undefined)
            updateData.paymentTerms = data.paymentTerms?.trim();
        if (data.agreementStartDate !== undefined)
            updateData.agreementStartDate = new Date(data.agreementStartDate);
        if (data.agreementExpiryDate !== undefined)
            updateData.agreementExpiryDate = new Date(data.agreementExpiryDate);
        if (data.registrationNumber !== undefined)
            updateData.registrationNumber = data.registrationNumber?.trim();
        if (data.notes !== undefined)
            updateData.notes = data.notes?.trim();
        if (data.accountName !== undefined)
            updateData.accountName = data.accountName?.trim();
        if (data.bankName !== undefined)
            updateData.bankName = data.bankName?.trim();
        if (data.accountNumber !== undefined)
            updateData.accountNumber = data.accountNumber?.trim();
        return this.prisma.company.update({
            where: { id },
            data: updateData,
            include: { _count: { select: { assets: true, transactions: true } } },
        });
    }
    async delete(id) {
        await this.findById(id);
        const activeAssets = await this.prisma.asset.count({ where: { companyId: id, status: 'published' } });
        if (activeAssets > 0)
            throw new common_1.BadRequestException(`Cannot delete company with ${activeAssets} active assets.`);
        const txCount = await this.prisma.transaction.count({ where: { companyId: id } });
        if (txCount > 0)
            throw new common_1.BadRequestException(`Cannot delete company with ${txCount} transactions.`);
        await this.prisma.company.delete({ where: { id } });
        return { message: 'Company deleted successfully', id };
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CompaniesService);


/***/ }),

/***/ "./src/companies/dto/create-company.dto.ts":
/*!*************************************************!*\
  !*** ./src/companies/dto/create-company.dto.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FilterCompaniesDto = exports.UpdateCompanyDto = exports.CreateCompanyDto = exports.CompanyStatusEnum = exports.CompanyTypeEnum = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
var CompanyTypeEnum;
(function (CompanyTypeEnum) {
    CompanyTypeEnum["DEVELOPER"] = "developer";
    CompanyTypeEnum["REALTOR"] = "realtor";
    CompanyTypeEnum["PARTNER"] = "partner";
    CompanyTypeEnum["CONSULTANT"] = "consultant";
    CompanyTypeEnum["INVESTOR"] = "investor";
})(CompanyTypeEnum || (exports.CompanyTypeEnum = CompanyTypeEnum = {}));
var CompanyStatusEnum;
(function (CompanyStatusEnum) {
    CompanyStatusEnum["ACTIVE"] = "active";
    CompanyStatusEnum["INACTIVE"] = "inactive";
    CompanyStatusEnum["SUSPENDED"] = "suspended";
})(CompanyStatusEnum || (exports.CompanyStatusEnum = CompanyStatusEnum = {}));
class CreateCompanyDto {
}
exports.CreateCompanyDto = CreateCompanyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Company name is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'Company name must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(200, { message: 'Company name must not exceed 200 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(CompanyTypeEnum, {
        message: 'Company type must be one of: developer, realtor, partner, consultant, investor'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Company type is required' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Registration number must not exceed 50 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyStatusEnum, {
        message: 'Status must be one of: active, inactive, suspended'
    }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Contact person name is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'Contact person name must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Contact person name must not exceed 100 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "contactPerson", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.trim().toLowerCase()),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number is required' }),
    (0, class_validator_1.Matches)(/^[+]?[\d\s()-]+$/, {
        message: 'Please provide a valid phone number (digits, spaces, +, -, () allowed)'
    }),
    (0, class_validator_1.MinLength)(10, { message: 'Phone number must be at least 10 characters' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Phone number must not exceed 20 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Address must not exceed 500 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Agreement start date must be a valid date (YYYY-MM-DD)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Agreement start date is required' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "agreementStartDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Agreement expiry date must be a valid date (YYYY-MM-DD)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Agreement expiry date is required' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "agreementExpiryDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Commission rate must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Commission rate cannot be negative' }),
    (0, class_validator_1.Max)(100, { message: 'Commission rate cannot exceed 100' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Commission rate is required' }),
    __metadata("design:type", Number)
], CreateCompanyDto.prototype, "commissionRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Payment terms must not exceed 500 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Account name must not exceed 100 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "accountName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Bank name must not exceed 100 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "bankName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[\d]+$/, { message: 'Account number must contain only digits' }),
    (0, class_validator_1.MinLength)(10, { message: 'Account number must be at least 10 digits' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Account number must not exceed 20 digits' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "accountNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000, { message: 'Notes must not exceed 1000 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "notes", void 0);
class UpdateCompanyDto {
}
exports.UpdateCompanyDto = UpdateCompanyDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyTypeEnum, {
        message: 'Company type must be one of: developer, realtor, partner, consultant, investor'
    }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyStatusEnum, {
        message: 'Status must be one of: active, inactive, suspended'
    }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "contactPerson", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim().toLowerCase()),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[+]?[\d\s()-]+$/, { message: 'Please provide a valid phone number' }),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "agreementStartDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "agreementExpiryDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateCompanyDto.prototype, "commissionRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "accountName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "bankName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[\d]+$/),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "accountNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "notes", void 0);
class FilterCompaniesDto {
}
exports.FilterCompaniesDto = FilterCompaniesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyTypeEnum),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyStatusEnum),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['asc', 'desc']),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterCompaniesDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], FilterCompaniesDto.prototype, "limit", void 0);


/***/ }),

/***/ "./src/dashboard/dashboard.controller.ts":
/*!***********************************************!*\
  !*** ./src/dashboard/dashboard.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const dashboard_service_1 = __webpack_require__(/*! ./dashboard.service */ "./src/dashboard/dashboard.service.ts");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const roles_guard_1 = __webpack_require__(/*! ../common/roles.guard */ "./src/common/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../common/roles.decorator */ "./src/common/roles.decorator.ts");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getOverview() {
        return this.dashboardService.getOverview();
    }
    getRecentTransactions() {
        return this.dashboardService.getRecentTransactions();
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)('overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getOverview", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)('recent-transactions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getRecentTransactions", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [typeof (_a = typeof dashboard_service_1.DashboardService !== "undefined" && dashboard_service_1.DashboardService) === "function" ? _a : Object])
], DashboardController);


/***/ }),

/***/ "./src/dashboard/dashboard.module.ts":
/*!*******************************************!*\
  !*** ./src/dashboard/dashboard.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const dashboard_service_1 = __webpack_require__(/*! ./dashboard.service */ "./src/dashboard/dashboard.service.ts");
const dashboard_controller_1 = __webpack_require__(/*! ./dashboard.controller */ "./src/dashboard/dashboard.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [dashboard_service_1.DashboardService],
        controllers: [dashboard_controller_1.DashboardController],
    })
], DashboardModule);


/***/ }),

/***/ "./src/dashboard/dashboard.service.ts":
/*!********************************************!*\
  !*** ./src/dashboard/dashboard.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview() {
        const [totalAgents, activeClusters, totalRevenue, totalCommissions, activeAssets, assetTypeCounts, salesVolume,] = await Promise.all([
            this.prisma.agent.count(),
            this.prisma.cluster.count({ where: { status: 'active' } }),
            this.prisma.transaction.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { totalAmount: true },
            }),
            this.prisma.transaction.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { totalCommission: true },
            }),
            this.prisma.asset.count({ where: { status: 'published' } }),
            this.prisma.asset.groupBy({
                by: ['type'],
                _count: { type: true },
                where: { status: 'published' },
            }),
            this.prisma.$queryRawUnsafe(`
        SELECT 
          TO_CHAR("createdAt", 'YYYY-MM') AS month,
          COUNT(*) AS sales,
          SUM("totalAmount") AS revenue
        FROM "Transaction"
        WHERE status = 'COMPLETED'
        GROUP BY month
        ORDER BY month
        LIMIT 12
      `),
        ]);
        function calcChange(current, previous) {
            if (previous === undefined || previous === null)
                return 'N/A';
            if (previous === 0)
                return current > 0 ? 'New' : '0%';
            const change = ((current - previous) / previous) * 100;
            return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
        }
        const prevAgents = 0;
        const prevClusters = 0;
        const prevRevenue = 0;
        const prevCommissions = 0;
        const kpis = [
            {
                title: "Total Agents",
                value: totalAgents,
                icon: "building",
                trend: "up",
                change: calcChange(totalAgents, prevAgents),
            },
            {
                title: "Active Clusters",
                value: activeClusters,
                icon: "trendingUp",
                trend: "up",
                change: calcChange(activeClusters, prevClusters),
            },
            {
                title: "Total Revenue",
                value: `₦${(totalRevenue._sum.totalAmount || 0).toLocaleString()}`,
                icon: "dollarSign",
                trend: "up",
                change: calcChange(Number(totalRevenue._sum.totalAmount || 0), prevRevenue),
            },
            {
                title: "Total Commissions",
                value: `₦${(totalCommissions._sum.totalCommission || 0).toLocaleString()}`,
                icon: "receipt",
                trend: "up",
                change: calcChange(Number(totalCommissions._sum.totalCommission || 0), prevCommissions),
            },
        ];
        const colors = ["#4c51bf", "#10b981", "#f59e42", "#e53e3e", "#6b7280"];
        const assetDistribution = assetTypeCounts.map((item, idx) => ({
            name: item.type || "Other",
            value: item._count.type,
            color: colors[idx % colors.length],
        }));
        const salesVolumeData = salesVolume.map((row) => ({
            month: row.month,
            sales: Number(row.sales),
            revenue: Number(row.revenue) / 1000,
        }));
        return {
            kpis,
            assetDistribution,
            salesVolume: salesVolumeData,
        };
    }
    async getRecentTransactions() {
        return this.prisma.transaction.findMany({
            take: 10,
            orderBy: { date: 'desc' },
            include: {
                asset: { select: { id: true, name: true, type: true } },
                buyer: { select: { id: true, name: true } },
                company: { select: { id: true, name: true } },
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
            },
        });
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], DashboardService);


/***/ }),

/***/ "./src/freelancers/freelancers.controller.ts":
/*!***************************************************!*\
  !*** ./src/freelancers/freelancers.controller.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FreelancersController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const freelancers_service_1 = __webpack_require__(/*! ./freelancers.service */ "./src/freelancers/freelancers.service.ts");
class CreateFreelancerDto {
}
let FreelancersController = class FreelancersController {
    constructor(freelancersService) {
        this.freelancersService = freelancersService;
    }
    async findAll() {
        return this.freelancersService.findAll();
    }
    async getStats() {
        return this.freelancersService.getStats();
    }
    async getByRegistrar(registrarId) {
        return this.freelancersService.getFreelancersByRegistrar(registrarId);
    }
    async findOne(id) {
        return this.freelancersService.findById(id);
    }
    async create(dto) {
        return this.freelancersService.create(dto);
    }
    async update(id, dto) {
        return this.freelancersService.update(id, dto);
    }
    async remove(id) {
        return this.freelancersService.delete(id);
    }
};
exports.FreelancersController = FreelancersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)("by-registrar/:registrarId"),
    __param(0, (0, common_1.Param)("registrarId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "getByRegistrar", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateFreelancerDto]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "remove", null);
exports.FreelancersController = FreelancersController = __decorate([
    (0, common_1.Controller)("freelancers"),
    __metadata("design:paramtypes", [typeof (_a = typeof freelancers_service_1.FreelancersService !== "undefined" && freelancers_service_1.FreelancersService) === "function" ? _a : Object])
], FreelancersController);


/***/ }),

/***/ "./src/freelancers/freelancers.module.ts":
/*!***********************************************!*\
  !*** ./src/freelancers/freelancers.module.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FreelancersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const freelancers_controller_1 = __webpack_require__(/*! ./freelancers.controller */ "./src/freelancers/freelancers.controller.ts");
const freelancers_service_1 = __webpack_require__(/*! ./freelancers.service */ "./src/freelancers/freelancers.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let FreelancersModule = class FreelancersModule {
};
exports.FreelancersModule = FreelancersModule;
exports.FreelancersModule = FreelancersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [freelancers_controller_1.FreelancersController],
        providers: [freelancers_service_1.FreelancersService],
        exports: [freelancers_service_1.FreelancersService],
    })
], FreelancersModule);


/***/ }),

/***/ "./src/freelancers/freelancers.service.ts":
/*!************************************************!*\
  !*** ./src/freelancers/freelancers.service.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FreelancersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const bcrypt = __importStar(__webpack_require__(/*! bcrypt */ "bcrypt"));
let FreelancersService = class FreelancersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const freelancers = await this.prisma.freelancer.findMany({
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return freelancers.map(freelancer => ({
            id: freelancer.id,
            name: freelancer.user?.name ?? "",
            email: freelancer.user?.email ?? "",
            registeredBy: freelancer.registeredBy ?? "",
            registrarName: freelancer.registrarName ?? "",
            registrarType: freelancer.registrarType ?? "",
            cluster: freelancer.cluster?.name ?? "",
            clusterId: freelancer.cluster?.id ?? "",
            activeDeals: freelancer.activeDeals ?? 0,
            closedDeals: freelancer.closedDeals ?? 0,
            totalCommission: freelancer.totalCommission ?? 0,
            performance: freelancer.closedDeals > 0 ? Math.min(100, Math.round((freelancer.closedDeals / 10) * 100)) : 0,
            status: freelancer.status?.toLowerCase() ?? "pending",
        }));
    }
    async findById(id) {
        const freelancer = await this.prisma.freelancer.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: true,
            },
        });
        if (!freelancer)
            throw new common_1.NotFoundException(`Freelancer with ID ${id} not found`);
        return freelancer;
    }
    async create(data) {
        let user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (user) {
            const existing = await this.prisma.freelancer.findUnique({ where: { userId: user.id } });
            if (existing)
                throw new common_1.ConflictException('User is already registered as a freelancer');
        }
        else {
            const hashedPassword = await bcrypt.hash('password123', 10);
            user = await this.prisma.user.create({
                data: { email: data.email, password: hashedPassword, name: data.name, role: 'FREELANCER' },
            });
        }
        return this.prisma.freelancer.create({
            data: {
                userId: user.id,
                clusterId: data.cluster || null,
                status: data.status || 'PENDING',
                registeredBy: data.registeredBy || null,
                registrarName: data.registrarName || null,
                registrarType: data.registrarType || null,
                activeDeals: 0,
                closedDeals: 0,
                totalCommission: 0,
            },
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, data) {
        const freelancer = await this.findById(id);
        if (data.name || data.email) {
            await this.prisma.user.update({
                where: { id: freelancer.userId },
                data: {
                    ...(data.name ? { name: data.name } : {}),
                    ...(data.email ? { email: data.email } : {}),
                },
            });
        }
        const updateData = {};
        if (data.cluster)
            updateData.clusterId = data.cluster;
        if (data.status)
            updateData.status = data.status;
        if (data.registeredBy !== undefined)
            updateData.registeredBy = data.registeredBy;
        if (data.registrarName !== undefined)
            updateData.registrarName = data.registrarName;
        if (data.registrarType !== undefined)
            updateData.registrarType = data.registrarType;
        return this.prisma.freelancer.update({
            where: { id },
            data: updateData,
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.freelancer.delete({ where: { id } });
        return { message: 'Freelancer deleted successfully', id };
    }
    async getStats() {
        const [total, active, agg] = await Promise.all([
            this.prisma.freelancer.count(),
            this.prisma.freelancer.count({ where: { status: 'ACTIVE' } }),
            this.prisma.freelancer.aggregate({
                _sum: { totalCommission: true, activeDeals: true, closedDeals: true },
            }),
        ]);
        return {
            totalFreelancers: total,
            activeFreelancers: active,
            totalActiveDeals: agg._sum.activeDeals || 0,
            totalClosedDeals: agg._sum.closedDeals || 0,
            totalCommission: agg._sum.totalCommission || 0,
        };
    }
    async getFreelancersByRegistrar(registrarId) {
        return this.prisma.freelancer.findMany({
            where: { registeredBy: registrarId },
            include: {
                user: { select: { id: true, name: true, email: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
};
exports.FreelancersService = FreelancersService;
exports.FreelancersService = FreelancersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], FreelancersService);


/***/ }),

/***/ "./src/installments/installments.controller.ts":
/*!*****************************************************!*\
  !*** ./src/installments/installments.controller.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstallmentsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const installments_service_1 = __webpack_require__(/*! ./installments.service */ "./src/installments/installments.service.ts");
class CreateInstallmentPlanDto {
}
class SendReminderDto {
}
let InstallmentsController = class InstallmentsController {
    constructor(installmentsService) {
        this.installmentsService = installmentsService;
    }
    async findAll(status) {
        return this.installmentsService.findAll({ status });
    }
    async getStats() {
        return this.installmentsService.getStats();
    }
    async findOne(id) {
        return this.installmentsService.findById(id);
    }
    async getSchedule(id) {
        return this.installmentsService.getInstallmentSchedule(id);
    }
    async create(dto) {
        return this.installmentsService.create(dto);
    }
    async sendReminder(dto) {
        return this.installmentsService.sendPaymentReminder(dto);
    }
    async recordPayment(id, installmentId, body) {
        return this.installmentsService.recordPayment(id, installmentId, body);
    }
    async getUpcoming() {
        return this.installmentsService.findAll({ status: "upcoming" });
    }
    async getOverdue() {
        return this.installmentsService.findAll({ status: "overdue" });
    }
};
exports.InstallmentsController = InstallmentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(":id/schedule"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "getSchedule", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateInstallmentPlanDto]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("reminders/send"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendReminderDto]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "sendReminder", null);
__decorate([
    (0, common_1.Put)(":id/installments/:installmentId/pay"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("installmentId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Get)("upcoming"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "getUpcoming", null);
__decorate([
    (0, common_1.Get)("overdue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "getOverdue", null);
exports.InstallmentsController = InstallmentsController = __decorate([
    (0, common_1.Controller)("installments"),
    __metadata("design:paramtypes", [typeof (_a = typeof installments_service_1.InstallmentsService !== "undefined" && installments_service_1.InstallmentsService) === "function" ? _a : Object])
], InstallmentsController);


/***/ }),

/***/ "./src/installments/installments.module.ts":
/*!*************************************************!*\
  !*** ./src/installments/installments.module.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstallmentsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const installments_controller_1 = __webpack_require__(/*! ./installments.controller */ "./src/installments/installments.controller.ts");
const installments_service_1 = __webpack_require__(/*! ./installments.service */ "./src/installments/installments.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let InstallmentsModule = class InstallmentsModule {
};
exports.InstallmentsModule = InstallmentsModule;
exports.InstallmentsModule = InstallmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [installments_controller_1.InstallmentsController],
        providers: [installments_service_1.InstallmentsService],
        exports: [installments_service_1.InstallmentsService],
    })
], InstallmentsModule);


/***/ }),

/***/ "./src/installments/installments.service.ts":
/*!**************************************************!*\
  !*** ./src/installments/installments.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstallmentsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let InstallmentsService = class InstallmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status && filters.status !== 'all') {
            where.status = filters.status.toUpperCase();
        }
        const plans = await this.prisma.installmentPlan.findMany({
            where,
            include: {
                asset: { select: { name: true } },
                company: { select: { name: true } },
                leadAgent: { include: { user: { select: { name: true } } } },
                closerAgent: { include: { user: { select: { name: true } } } },
                installments: { orderBy: { dueDate: 'asc' } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return plans.map(plan => ({
            id: plan.id,
            asset: plan.asset?.name ?? "",
            buyer: plan.buyerName ?? "",
            buyerEmail: plan.buyerEmail ?? "",
            buyerPhone: plan.buyerPhone ?? "",
            totalAmount: plan.totalAmount,
            downPayment: plan.downPayment,
            paidAmount: plan.paidAmount,
            remainingBalance: plan.remainingBalance,
            numberOfInstallments: plan.numberOfInstallments,
            completedInstallments: plan.completedInstallments,
            installmentAmount: plan.installmentAmount,
            frequency: plan.frequency,
            startDate: plan.startDate?.toISOString().split("T")[0] ?? "",
            nextDueDate: plan.nextDueDate?.toISOString().split("T")[0] ?? "",
            status: plan.status?.toLowerCase(),
            company: plan.company?.name ?? "",
            leadAgent: plan.leadAgent?.user?.name ?? "",
            closerAgent: plan.closerAgent?.user?.name ?? "",
            installments: plan.installments.map(inst => ({
                id: inst.id,
                dueDate: inst.dueDate?.toISOString().split("T")[0] ?? "",
                amount: inst.amount,
                paidAmount: inst.paidAmount,
                status: inst.status?.toLowerCase(),
                paidDate: inst.paidDate ? inst.paidDate.toISOString().split("T")[0] : null,
                paymentMethod: inst.paymentMethod ?? "",
            })),
        }));
    }
    async create(dto) {
        return this.prisma.installmentPlan.create({
            data: {
                ...dto,
                companyId: dto.companyId,
                remainingBalance: dto.totalAmount - (dto.downPayment || 0),
                paidAmount: 0,
                installmentAmount: dto.totalAmount / dto.numberOfInstallments,
            },
        });
    }
    async findById(id) {
        const plan = await this.prisma.installmentPlan.findUnique({
            where: { id },
            include: {
                asset: true,
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                installments: {
                    orderBy: {
                        dueDate: "asc",
                    },
                },
            },
        });
        if (!plan) {
            throw new common_1.NotFoundException(`Installment plan with ID ${id} not found`);
        }
        return plan;
    }
    async getInstallmentSchedule(planId) {
        const plan = await this.findById(planId);
        return plan.installments;
    }
    async recordPayment(planId, installmentId, data) {
        const plan = await this.findById(planId);
        const installment = await this.prisma.installment.findUnique({
            where: { id: installmentId },
        });
        if (!installment) {
            throw new common_1.NotFoundException(`Installment with ID ${installmentId} not found`);
        }
        const updatedInstallment = await this.prisma.installment.update({
            where: { id: installmentId },
            data: {
                paidAmount: installment.paidAmount + data.amount,
                status: installment.paidAmount + data.amount >= installment.amount ? "PAID" : "PARTIAL",
                paidDate: new Date(),
                paymentMethod: data.paymentMethod,
            },
        });
        const newPaidAmount = plan.paidAmount + data.amount;
        const completedInstallments = await this.prisma.installment.count({
            where: {
                installmentPlanId: planId,
                status: "PAID",
            },
        });
        const nextInstallment = await this.prisma.installment.findFirst({
            where: {
                installmentPlanId: planId,
                status: { in: ["PENDING", "UPCOMING", "OVERDUE"] },
            },
            orderBy: {
                dueDate: "asc",
            },
        });
        const isCompleted = newPaidAmount >= plan.remainingBalance;
        await this.prisma.installmentPlan.update({
            where: { id: planId },
            data: {
                paidAmount: newPaidAmount,
                completedInstallments,
                nextDueDate: nextInstallment?.dueDate || null,
                status: isCompleted ? "COMPLETED" : "ACTIVE",
            },
        });
        return updatedInstallment;
    }
    async sendPaymentReminder(data) {
        const installment = await this.prisma.installment.findUnique({
            where: { id: data.installmentId },
            include: {
                installmentPlan: {
                    include: {
                        asset: { select: { name: true } },
                        leadAgent: { include: { user: { select: { name: true, email: true } } } },
                    },
                },
            },
        });
        if (!installment) {
            throw new common_1.NotFoundException(`Installment with ID ${data.installmentId} not found`);
        }
        const agentEmail = installment.installmentPlan?.leadAgent?.user?.email || 'unknown';
        console.log(`Sending ${data.method} reminder for asset "${installment.installmentPlan?.asset?.name}" to agent ${agentEmail}`);
        return {
            message: "Reminder sent successfully",
            installmentId: data.installmentId,
            method: data.method,
            sentAt: new Date(),
        };
    }
    async getStats() {
        const [activePlans, completedPlans, totalOutstanding, totalCollected, overduePayments,] = await Promise.all([
            this.prisma.installmentPlan.count({ where: { status: "ACTIVE" } }),
            this.prisma.installmentPlan.count({ where: { status: "COMPLETED" } }),
            this.prisma.installmentPlan.aggregate({
                where: { status: "ACTIVE" },
                _sum: {
                    remainingBalance: true,
                    paidAmount: true,
                },
            }),
            this.prisma.installmentPlan.aggregate({
                _sum: {
                    paidAmount: true,
                },
            }),
            this.prisma.installment.count({
                where: { status: "OVERDUE" },
            }),
        ]);
        const outstanding = (totalOutstanding._sum.remainingBalance || 0) -
            (totalOutstanding._sum.paidAmount || 0);
        return {
            activePlans,
            completedPlans,
            totalOutstanding: outstanding,
            totalCollected: totalCollected._sum.paidAmount || 0,
            overduePayments,
        };
    }
    async updateInstallmentStatuses() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await this.prisma.installment.updateMany({
            where: {
                dueDate: { lt: today },
                status: { in: ["PENDING", "UPCOMING"] },
            },
            data: {
                status: "OVERDUE",
            },
        });
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        await this.prisma.installment.updateMany({
            where: {
                dueDate: { lte: weekFromNow, gte: today },
                status: "UPCOMING",
            },
            data: {
                status: "PENDING",
            },
        });
    }
    async generateInstallmentSchedule(planId, data) {
        const installments = [];
        const { numberOfInstallments, installmentAmount, frequency, startDate } = data;
        for (let i = 0; i < numberOfInstallments; i++) {
            const dueDate = this.calculateDueDate(startDate, frequency, i);
            installments.push({
                installmentPlanId: planId,
                dueDate,
                amount: installmentAmount,
                paidAmount: 0,
                status: i === 0 ? "PENDING" : "UPCOMING",
            });
        }
        await this.prisma.installment.createMany({
            data: installments,
        });
    }
    calculateDueDate(startDate, frequency, index) {
        const dueDate = new Date(startDate);
        switch (frequency.toLowerCase()) {
            case "weekly":
                dueDate.setDate(dueDate.getDate() + (index * 7));
                break;
            case "bi-weekly":
                dueDate.setDate(dueDate.getDate() + (index * 14));
                break;
            case "monthly":
                dueDate.setMonth(dueDate.getMonth() + index);
                break;
            case "quarterly":
                dueDate.setMonth(dueDate.getMonth() + (index * 3));
                break;
            default:
                dueDate.setMonth(dueDate.getMonth() + index);
        }
        return dueDate;
    }
};
exports.InstallmentsService = InstallmentsService;
exports.InstallmentsService = InstallmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], InstallmentsService);


/***/ }),

/***/ "./src/investments/investments.controller.ts":
/*!***************************************************!*\
  !*** ./src/investments/investments.controller.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvestmentsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const investments_service_1 = __webpack_require__(/*! ./investments.service */ "./src/investments/investments.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/jwt-auth.guard */ "./src/auth/jwt-auth.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../common/roles.decorator */ "./src/common/roles.decorator.ts");
const roles_guard_1 = __webpack_require__(/*! ../common/roles.guard */ "./src/common/roles.guard.ts");
let InvestmentsController = class InvestmentsController {
    constructor(svc) {
        this.svc = svc;
    }
    async myInvestments(req) {
        return this.svc.findByUser(req.user.id);
    }
    async summary(req) {
        return this.svc.getInvestmentSummary(req.user.id);
    }
    async all() {
        return this.svc.findAll();
    }
};
exports.InvestmentsController = InvestmentsController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentsController.prototype, "myInvestments", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentsController.prototype, "summary", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestmentsController.prototype, "all", null);
exports.InvestmentsController = InvestmentsController = __decorate([
    (0, common_1.Controller)('investments'),
    __metadata("design:paramtypes", [typeof (_a = typeof investments_service_1.InvestmentsService !== "undefined" && investments_service_1.InvestmentsService) === "function" ? _a : Object])
], InvestmentsController);


/***/ }),

/***/ "./src/investments/investments.module.ts":
/*!***********************************************!*\
  !*** ./src/investments/investments.module.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvestmentsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const investments_controller_1 = __webpack_require__(/*! ./investments.controller */ "./src/investments/investments.controller.ts");
const investments_service_1 = __webpack_require__(/*! ./investments.service */ "./src/investments/investments.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let InvestmentsModule = class InvestmentsModule {
};
exports.InvestmentsModule = InvestmentsModule;
exports.InvestmentsModule = InvestmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [investments_controller_1.InvestmentsController],
        providers: [investments_service_1.InvestmentsService],
    })
], InvestmentsModule);


/***/ }),

/***/ "./src/investments/investments.service.ts":
/*!************************************************!*\
  !*** ./src/investments/investments.service.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvestmentsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let InvestmentsService = class InvestmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUser(userId) {
        return this.prisma.transaction.findMany({
            where: { buyerId: userId },
            include: {
                asset: { select: { id: true, name: true, type: true, location: true } },
                company: { select: { id: true, name: true } },
                installments: { orderBy: { dueDate: 'asc' } },
                installmentPlans: true,
            },
            orderBy: { date: 'desc' },
        });
    }
    async findAll() {
        return this.prisma.transaction.findMany({
            include: {
                asset: { select: { id: true, name: true, type: true } },
                buyer: { select: { id: true, name: true, email: true } },
                company: { select: { id: true, name: true } },
            },
            orderBy: { date: 'desc' },
        });
    }
    async getInvestmentSummary(userId) {
        const agg = await this.prisma.transaction.aggregate({
            where: { buyerId: userId },
            _sum: { totalAmount: true },
            _count: true,
        });
        return {
            totalInvestments: agg._count,
            totalInvested: agg._sum.totalAmount || 0,
        };
    }
};
exports.InvestmentsService = InvestmentsService;
exports.InvestmentsService = InvestmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], InvestmentsService);


/***/ }),

/***/ "./src/leads/leads.controller.ts":
/*!***************************************!*\
  !*** ./src/leads/leads.controller.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeadsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const leads_service_1 = __webpack_require__(/*! ./leads.service */ "./src/leads/leads.service.ts");
class CreateLeadDto {
}
class AssignLeadsDto {
}
let LeadsController = class LeadsController {
    constructor(leadsService) {
        this.leadsService = leadsService;
    }
    async findAll(source, status) {
        return this.leadsService.findAll({ source, status });
    }
    async getStats() {
        return this.leadsService.getStats();
    }
    async findOne(id) {
        return this.leadsService.findById(id);
    }
    async create(dto, user) {
        return this.leadsService.create(dto, user.id);
    }
    async assignLeads(dto) {
        return this.leadsService.assignLeads(dto);
    }
    async update(id, dto) {
        return this.leadsService.update(id, dto);
    }
};
exports.LeadsController = LeadsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("source")),
    __param(1, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLeadDto, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("assign"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AssignLeadsDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "assignLeads", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "update", null);
exports.LeadsController = LeadsController = __decorate([
    (0, common_1.Controller)("leads"),
    __metadata("design:paramtypes", [typeof (_a = typeof leads_service_1.LeadsService !== "undefined" && leads_service_1.LeadsService) === "function" ? _a : Object])
], LeadsController);


/***/ }),

/***/ "./src/leads/leads.module.ts":
/*!***********************************!*\
  !*** ./src/leads/leads.module.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeadsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const leads_controller_1 = __webpack_require__(/*! ./leads.controller */ "./src/leads/leads.controller.ts");
const leads_service_1 = __webpack_require__(/*! ./leads.service */ "./src/leads/leads.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let LeadsModule = class LeadsModule {
};
exports.LeadsModule = LeadsModule;
exports.LeadsModule = LeadsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [leads_controller_1.LeadsController],
        providers: [leads_service_1.LeadsService],
        exports: [leads_service_1.LeadsService],
    })
], LeadsModule);


/***/ }),

/***/ "./src/leads/leads.service.ts":
/*!************************************!*\
  !*** ./src/leads/leads.service.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeadsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let LeadsService = class LeadsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assignLeads(dto) {
        if (dto.assignmentType === 'all') {
            await this.prisma.lead.updateMany({
                where: { id: { in: dto.leadIds } },
                data: { status: 'available', assignedCluster: null, assignedToId: null },
            });
        }
        else if (dto.assignmentType === 'cluster' && dto.clusterId) {
            await this.prisma.lead.updateMany({
                where: { id: { in: dto.leadIds } },
                data: { status: 'assigned', assignedCluster: dto.clusterId },
            });
        }
        else {
            throw new common_1.BadRequestException('Invalid assignment type or missing clusterId');
        }
        return { message: 'Leads assigned', ...dto };
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.assetId)
            where.assetId = filters.assetId;
        if (filters?.assignedToId)
            where.assignedToId = filters.assignedToId;
        if (filters?.source)
            where.source = filters.source;
        return this.prisma.lead.findMany({
            where,
            include: {
                asset: { select: { id: true, name: true, type: true, location: true } },
                assignedTo: { include: { user: { select: { id: true, name: true } } } },
                createdBy: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const lead = await this.prisma.lead.findUnique({
            where: { id },
            include: {
                asset: true,
                assignedTo: { include: { user: true, cluster: true } },
                createdBy: { select: { id: true, name: true, email: true } },
            },
        });
        if (!lead)
            throw new common_1.NotFoundException(`Lead with ID ${id} not found`);
        return lead;
    }
    async create(data, createdById) {
        if (!data.name)
            throw new common_1.BadRequestException('Lead name is required');
        if (!data.email)
            throw new common_1.BadRequestException('Email is required');
        return this.prisma.lead.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone || null,
                assetInterest: data.assetInterest || null,
                budget: data.budget ? parseFloat(data.budget) : null,
                source: data.source || null,
                leadSource: data.leadSource || "investor-app",
                location: data.location || null,
                notes: data.notes || null,
                status: data.status || "pending",
                assignedToId: data.assignedToId || null,
                assignedCluster: data.assignedCluster || null,
                createdById,
                dateReceived: data.dateReceived ? new Date(data.dateReceived) : new Date(),
            },
            include: {
                asset: { select: { id: true, name: true } },
                assignedTo: { include: { user: { select: { id: true, name: true } } } },
                createdBy: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.phone !== undefined)
            updateData.phone = data.phone;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.budget !== undefined)
            updateData.budget = parseFloat(data.budget);
        if (data.source !== undefined)
            updateData.source = data.source;
        if (data.leadSource !== undefined)
            updateData.leadSource = data.leadSource;
        if (data.location !== undefined)
            updateData.location = data.location;
        if (data.notes !== undefined)
            updateData.notes = data.notes;
        if (data.assetInterest !== undefined)
            updateData.assetInterest = data.assetInterest;
        if (data.assignedToId !== undefined)
            updateData.assignedToId = data.assignedToId;
        if (data.assignedCluster !== undefined)
            updateData.assignedCluster = data.assignedCluster;
        return this.prisma.lead.update({
            where: { id },
            data: updateData,
            include: {
                asset: { select: { id: true, name: true } },
                assignedTo: { include: { user: { select: { id: true, name: true } } } },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.lead.delete({ where: { id } });
        return { message: 'Lead deleted successfully', id };
    }
    async getStats() {
        const [total, byStatus] = await Promise.all([
            this.prisma.lead.count(),
            this.prisma.lead.groupBy({
                by: ['status'],
                _count: true,
            }),
        ]);
        return {
            total,
            byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
        };
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], LeadsService);


/***/ }),

/***/ "./src/notification/cron.service.ts":
/*!******************************************!*\
  !*** ./src/notification/cron.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CronService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const notification_service_1 = __webpack_require__(/*! ./notification.service */ "./src/notification/notification.service.ts");
let CronService = class CronService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async sendInstallmentReminders() {
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        const upcomingInstallments = await this.prisma.installment.findMany({
            where: {
                dueDate: {
                    gte: new Date(),
                    lte: threeDaysFromNow,
                },
                status: 'PENDING',
            },
        });
        for (const installment of upcomingInstallments) {
            await this.notificationService.notifyInstallmentDue(installment.id);
        }
    }
    async sendOverdueNotifications() {
        const overdueInstallments = await this.prisma.installment.findMany({
            where: {
                dueDate: { lt: new Date() },
                status: 'PENDING',
            },
        });
        for (const installment of overdueInstallments) {
            await this.notificationService.notifyInstallmentOverdue(installment.id);
            await this.prisma.installment.update({
                where: { id: installment.id },
                data: { status: 'OVERDUE' },
            });
        }
    }
};
exports.CronService = CronService;
__decorate([
    (0, schedule_1.Cron)('0 9 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "sendInstallmentReminders", null);
__decorate([
    (0, schedule_1.Cron)('0 10 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "sendOverdueNotifications", null);
exports.CronService = CronService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], CronService);


/***/ }),

/***/ "./src/notification/email.service.ts":
/*!*******************************************!*\
  !*** ./src/notification/email.service.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const nodemailer = __importStar(__webpack_require__(/*! nodemailer */ "nodemailer"));
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
    async sendEmail(options) {
        await this.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);


/***/ }),

/***/ "./src/notification/in-app-templates.ts":
/*!**********************************************!*\
  !*** ./src/notification/in-app-templates.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getInAppTemplate = getInAppTemplate;
function getInAppTemplate(type, data) {
    switch (type) {
        case 'deal_created':
            return {
                title: 'New Deal Created',
                message: `A new deal for "${data.assetName || 'an asset'}" worth ₦${(data.totalAmount || 0).toLocaleString()} has been created.`,
            };
        case 'payment_ready':
            return {
                title: 'Payment Due',
                message: `Your next installment of ₦${(data.installmentAmount || 0).toLocaleString()} is due on ${data.dueDate || 'the next due date'}.`,
            };
        case 'deal_closed':
            return {
                title: 'Deal Closed',
                message: `The deal for "${data.assetName || 'an asset'}" has been successfully closed.`,
            };
        default:
            return {
                title: 'Notification',
                message: data.message || 'You have a new notification.',
            };
    }
}


/***/ }),

/***/ "./src/notification/notification.controller.ts":
/*!*****************************************************!*\
  !*** ./src/notification/notification.controller.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/jwt-auth.guard */ "./src/auth/jwt-auth.guard.ts");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let NotificationController = class NotificationController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getNotifications(req) {
        return this.prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async getUnreadCount(req) {
        const count = await this.prisma.notification.count({
            where: { userId: req.user.id, read: false },
        });
        return { count };
    }
    async markAsRead(id) {
        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
    async markAllAsRead(req) {
        return this.prisma.notification.updateMany({
            where: { userId: req.user.id, read: false },
            data: { read: true },
        });
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('unread'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Put)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Put)('read-all'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllAsRead", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], NotificationController);


/***/ }),

/***/ "./src/notification/notification.module.ts":
/*!*************************************************!*\
  !*** ./src/notification/notification.module.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const notification_controller_1 = __webpack_require__(/*! ./notification.controller */ "./src/notification/notification.controller.ts");
const notification_service_1 = __webpack_require__(/*! ./notification.service */ "./src/notification/notification.service.ts");
const sms_service_1 = __webpack_require__(/*! ./sms.service */ "./src/notification/sms.service.ts");
const email_service_1 = __webpack_require__(/*! ./email.service */ "./src/notification/email.service.ts");
const cron_service_1 = __webpack_require__(/*! ./cron.service */ "./src/notification/cron.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, config_1.ConfigModule],
        controllers: [notification_controller_1.NotificationController],
        providers: [notification_service_1.NotificationService, sms_service_1.SmsService, email_service_1.EmailService, cron_service_1.CronService],
        exports: [notification_service_1.NotificationService],
    })
], NotificationModule);


/***/ }),

/***/ "./src/notification/notification.service.ts":
/*!**************************************************!*\
  !*** ./src/notification/notification.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const sms_service_1 = __webpack_require__(/*! ./sms.service */ "./src/notification/sms.service.ts");
const sms_templates_1 = __webpack_require__(/*! ./sms-templates */ "./src/notification/sms-templates.ts");
const in_app_templates_1 = __webpack_require__(/*! ./in-app-templates */ "./src/notification/in-app-templates.ts");
let NotificationService = class NotificationService {
    constructor(prisma, smsService) {
        this.prisma = prisma;
        this.smsService = smsService;
    }
    async notifyInstallmentDue(installmentId) {
        console.log(`Installment ${installmentId} is due soon.`);
        return { message: `Installment ${installmentId} is due soon.` };
    }
    async notifyInstallmentOverdue(installmentId) {
        console.log(`Installment ${installmentId} is overdue.`);
        return { message: `Installment ${installmentId} is overdue.` };
    }
    async findByUser(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async markAsRead(id) {
        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
    }
    async create(data) {
        return this.prisma.notification.create({
            data: {
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type || 'INFO',
            },
        });
    }
    async notifyDealCreated(transactionId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                asset: true,
                buyer: true,
                leadAgent: { include: { user: true } },
                closerAgent: { include: { user: true } },
            },
        });
        if (!transaction)
            return;
        const assetName = transaction.asset?.name || 'an asset';
        await this.prisma.notification.create({
            data: {
                userId: transaction.buyerId,
                title: 'New Deal Created',
                message: `Your deal for "${assetName}" worth ₦${transaction.totalAmount.toLocaleString()} has been created.`,
                type: 'SUCCESS',
            },
        });
        if (transaction.leadAgent?.user) {
            await this.prisma.notification.create({
                data: {
                    userId: transaction.leadAgent.user.id,
                    title: 'Deal Created on Your Lead',
                    message: `A deal for "${assetName}" worth ₦${transaction.totalAmount.toLocaleString()} has been created.`,
                    type: 'INFO',
                },
            });
        }
        if (transaction.closerAgent?.user) {
            await this.prisma.notification.create({
                data: {
                    userId: transaction.closerAgent.user.id,
                    title: 'New Deal Assigned',
                    message: `A deal for "${assetName}" worth ₦${transaction.totalAmount.toLocaleString()} has been assigned to you.`,
                    type: 'INFO',
                },
            });
        }
    }
    async notifyDealPaymentReady(transactionId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { asset: true, buyer: true, installmentPlans: true },
        });
        if (!transaction)
            return;
        const plan = transaction.installmentPlans?.[0];
        const dueDate = plan?.nextDueDate
            ? plan.nextDueDate.toLocaleDateString('en-US', { dateStyle: 'medium' })
            : 'the next due date';
        const installmentAmount = plan?.installmentAmount || 0;
        await this.prisma.notification.create({
            data: {
                userId: transaction.buyerId,
                title: 'Payment Due',
                message: `Your next installment of ₦${installmentAmount.toLocaleString()} for "${transaction.asset?.name || 'an asset'}" is due on ${dueDate}.`,
                type: 'WARNING',
            },
        });
    }
    async notifyDealClosed(transactionId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                asset: true,
                buyer: true,
                leadAgent: { include: { user: true } },
                closerAgent: { include: { user: true } },
            },
        });
        if (!transaction)
            return;
        const assetName = transaction.asset?.name || 'an asset';
        await this.prisma.notification.create({
            data: {
                userId: transaction.buyerId,
                title: 'Deal Closed',
                message: `Your deal for "${assetName}" has been closed successfully.`,
                type: 'SUCCESS',
            },
        });
        if (transaction.leadAgent?.user) {
            await this.prisma.notification.create({
                data: {
                    userId: transaction.leadAgent.user.id,
                    title: 'Deal Closed',
                    message: `The deal for "${assetName}" has been closed. Commission status: ${transaction.commissionPaymentStatus}.`,
                    type: 'SUCCESS',
                },
            });
        }
        if (transaction.closerAgent?.user) {
            await this.prisma.notification.create({
                data: {
                    userId: transaction.closerAgent.user.id,
                    title: 'Deal Closed',
                    message: `The deal for "${assetName}" you closed has been finalised. Commission status: ${transaction.commissionPaymentStatus}.`,
                    type: 'SUCCESS',
                },
            });
        }
    }
    getEmailTemplate(type, data) {
        const subject = type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        return `<h2>${subject}</h2><p>${data.message || (0, sms_templates_1.getSmsTemplate)(type, data)}</p>`;
    }
    getSmsTemplate(type, data) {
        return (0, sms_templates_1.getSmsTemplate)(type, data);
    }
    getInAppTemplate(type, data) {
        return (0, in_app_templates_1.getInAppTemplate)(type, data);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof sms_service_1.SmsService !== "undefined" && sms_service_1.SmsService) === "function" ? _b : Object])
], NotificationService);


/***/ }),

/***/ "./src/notification/sms-templates.ts":
/*!*******************************************!*\
  !*** ./src/notification/sms-templates.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSmsTemplate = getSmsTemplate;
function getSmsTemplate(type, data) {
    switch (type) {
        case 'deal_created':
            return `BuyOps: A new deal for ${data.assetName || 'an asset'} has been created. Amount: ₦${(data.totalAmount || 0).toLocaleString()}`;
        case 'payment_ready':
            return `BuyOps: Payment of ₦${(data.installmentAmount || 0).toLocaleString()} is due on ${data.dueDate || 'the next due date'}.`;
        case 'deal_closed':
            return `BuyOps: The deal for ${data.assetName || 'an asset'} has been closed successfully.`;
        default:
            return `BuyOps Notification: ${data.message || 'You have a new notification.'}`;
    }
}


/***/ }),

/***/ "./src/notification/sms.service.ts":
/*!*****************************************!*\
  !*** ./src/notification/sms.service.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var SmsService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SmsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const twilio_1 = __importDefault(__webpack_require__(/*! twilio */ "twilio"));
let SmsService = SmsService_1 = class SmsService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(SmsService_1.name);
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        this.fromPhone = this.configService.get('TWILIO_PHONE_NUMBER');
        this.twilioClient = new twilio_1.default.Twilio(accountSid, authToken);
    }
    async sendSms({ to, message }) {
        try {
            await this.twilioClient.messages.create({
                body: message,
                from: this.fromPhone,
                to,
            });
            this.logger.log(`SMS sent to ${to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send SMS to ${to}: ${error.message}`);
            throw error;
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], SmsService);


/***/ }),

/***/ "./src/prisma/prisma.module.ts":
/*!*************************************!*\
  !*** ./src/prisma/prisma.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ./prisma.service */ "./src/prisma/prisma.service.ts");
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),

/***/ "./src/prisma/prisma.service.ts":
/*!**************************************!*\
  !*** ./src/prisma/prisma.service.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
const adapter_pg_1 = __webpack_require__(/*! @prisma/adapter-pg */ "@prisma/adapter-pg");
const pg_1 = __webpack_require__(/*! pg */ "pg");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        const pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        });
        super({
            adapter: new adapter_pg_1.PrismaPg(pool),
            log: ["error", "warn"],
        });
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);


/***/ }),

/***/ "./src/reports/reports.controller.ts":
/*!*******************************************!*\
  !*** ./src/reports/reports.controller.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const reports_service_1 = __webpack_require__(/*! ./reports.service */ "./src/reports/reports.service.ts");
const express_1 = __webpack_require__(/*! express */ "express");
const roles_guard_1 = __webpack_require__(/*! ../common/roles.guard */ "./src/common/roles.guard.ts");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getSalesReport(dateRange) {
        const report = await this.reportsService.getSalesReport(dateRange);
        return {
            success: true,
            salesData: report.salesByMonth,
            topSalesByAsset: report.topAssets.map(a => ({
                asset: a.name,
                sales: a.count,
                revenue: a.revenue,
                location: a.location,
            })),
            assetTypeBreakdown: report.salesByType.map(t => ({
                type: t.type,
                count: t.count,
                totalValue: t.revenue,
            })),
            summary: report.summary,
            message: 'Sales report fetched successfully'
        };
    }
    async getAssetPerformance(dateRange) {
        const data = await this.reportsService.getAssetPerformance(dateRange);
        return { success: true, ...data };
    }
    async getAgentPerformance(dateRange) {
        const report = await this.reportsService.getAgentPerformance(dateRange);
        return {
            success: true,
            data: report.data,
            summary: report.summary,
            message: 'Agent performance report fetched successfully'
        };
    }
    async getClusterPerformance(dateRange) {
        const report = await this.reportsService.getClusterPerformance(dateRange);
        return {
            success: true,
            data: report.data,
            summary: report.summary,
            message: 'Cluster performance report fetched successfully'
        };
    }
    async exportReport(type, res, dateRange) {
        const buffer = await this.reportsService.exportReport(type, dateRange);
        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.header('Content-Disposition', `attachment; filename=buyops-${type}-report-${dateRange || 'recent'}.xlsx`);
        return res.send(buffer);
    }
    async getInvestmentReports(dateRange) {
        const trends = await this.reportsService.getInvestmentTrends(dateRange);
        const categories = await this.reportsService.getInvestorCategories(dateRange);
        return {
            success: true,
            investmentTrends: trends,
            investorCategories: categories,
            message: 'Investment report fetched successfully'
        };
    }
    async getCommissionReports(dateRange) {
        const trends = await this.reportsService.getCommissionTrends(dateRange);
        const agents = await this.reportsService.getTopAgents(dateRange);
        return {
            success: true,
            commissionTrends: trends,
            topAgents: agents,
            message: 'Commission report fetched successfully'
        };
    }
    async getPerformanceReports(dateRange) {
        const metrics = await this.reportsService.getConversionMetrics(dateRange);
        const clusters = await this.reportsService.getClusterPerformance(dateRange);
        return {
            success: true,
            conversionMetrics: metrics,
            clusterPerformance: clusters.data.map(c => ({
                cluster: c.name,
                target: 100,
                achieved: c.closedDeals,
                performance: ((c.closedDeals / 100) * 100).toFixed(0),
            })),
            message: 'Performance report fetched successfully'
        };
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('sales'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSalesReport", null);
__decorate([
    (0, common_1.Get)('assets'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAssetPerformance", null);
__decorate([
    (0, common_1.Get)('agents'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAgentPerformance", null);
__decorate([
    (0, common_1.Get)('clusters'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getClusterPerformance", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportReport", null);
__decorate([
    (0, common_1.Get)('investments'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getInvestmentReports", null);
__decorate([
    (0, common_1.Get)('commissions'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getCommissionReports", null);
__decorate([
    (0, common_1.Get)('performance'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPerformanceReports", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof reports_service_1.ReportsService !== "undefined" && reports_service_1.ReportsService) === "function" ? _a : Object])
], ReportsController);


/***/ }),

/***/ "./src/reports/reports.module.ts":
/*!***************************************!*\
  !*** ./src/reports/reports.module.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const reports_controller_1 = __webpack_require__(/*! ./reports.controller */ "./src/reports/reports.controller.ts");
const reports_service_1 = __webpack_require__(/*! ./reports.service */ "./src/reports/reports.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [reports_controller_1.ReportsController],
        providers: [reports_service_1.ReportsService],
        exports: [reports_service_1.ReportsService],
    })
], ReportsModule);


/***/ }),

/***/ "./src/reports/reports.service.ts":
/*!****************************************!*\
  !*** ./src/reports/reports.service.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const ExcelJS = __importStar(__webpack_require__(/*! exceljs */ "exceljs"));
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getDateFilter(dateRange) {
        const where = {};
        const now = new Date();
        switch (dateRange) {
            case '7d': {
                const d = new Date();
                d.setDate(d.getDate() - 7);
                where.date = { gte: d };
                break;
            }
            case '30d': {
                const d = new Date();
                d.setDate(d.getDate() - 30);
                where.date = { gte: d };
                break;
            }
            case '90d': {
                const d = new Date();
                d.setDate(d.getDate() - 90);
                where.date = { gte: d };
                break;
            }
            case 'ytd': {
                where.date = { gte: new Date(now.getFullYear(), 0, 1) };
                break;
            }
            default: {
                const d = new Date();
                d.setDate(d.getDate() - 30);
                where.date = { gte: d };
                break;
            }
        }
        return where;
    }
    getPreviousPeriodFilter(dateRange) {
        const now = new Date();
        switch (dateRange) {
            case '7d': {
                const s = new Date();
                s.setDate(s.getDate() - 14);
                const e = new Date();
                e.setDate(e.getDate() - 7);
                return { date: { gte: s, lt: e } };
            }
            case '30d': {
                const s = new Date();
                s.setDate(s.getDate() - 60);
                const e = new Date();
                e.setDate(e.getDate() - 30);
                return { date: { gte: s, lt: e } };
            }
            case '90d': {
                const s = new Date();
                s.setDate(s.getDate() - 180);
                const e = new Date();
                e.setDate(e.getDate() - 90);
                return { date: { gte: s, lt: e } };
            }
            case 'ytd': {
                return { date: { gte: new Date(now.getFullYear() - 1, 0, 1), lt: new Date(now.getFullYear() - 1, 11, 31) } };
            }
            default: return null;
        }
    }
    async getSalesReport(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const prevFilter = this.getPreviousPeriodFilter(dateRange);
        const [transactions, totalRevenueAgg, totalCount, prevRevenueAgg, prevCount] = await Promise.all([
            this.prisma.transaction.findMany({
                where: { status: 'COMPLETED', ...dateFilter },
                include: { asset: { select: { name: true, type: true } } },
                orderBy: { date: 'desc' },
            }),
            this.prisma.transaction.aggregate({ where: { status: 'COMPLETED', ...dateFilter }, _sum: { totalAmount: true } }),
            this.prisma.transaction.count({ where: { status: 'COMPLETED', ...dateFilter } }),
            prevFilter
                ? this.prisma.transaction.aggregate({ where: { status: 'COMPLETED', ...prevFilter }, _sum: { totalAmount: true } })
                : { _sum: { totalAmount: 0 } },
            prevFilter ? this.prisma.transaction.count({ where: { status: 'COMPLETED', ...prevFilter } }) : 0,
        ]);
        const totalRevenue = totalRevenueAgg._sum.totalAmount || 0;
        const prevRevenue = prevRevenueAgg._sum.totalAmount || 0;
        const avgDealSize = totalCount > 0 ? totalRevenue / totalCount : 0;
        const prevAvg = prevCount > 0 ? prevRevenue / prevCount : 0;
        return {
            summary: {
                totalRevenue,
                totalTransactions: totalCount,
                avgDealSize,
                revenueChange: prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0,
                transactionChange: prevCount > 0 ? ((totalCount - prevCount) / prevCount) * 100 : 0,
                avgDealSizeChange: prevAvg > 0 ? ((avgDealSize - prevAvg) / prevAvg) * 100 : 0,
            },
            salesByMonth: this.processSalesByMonth(transactions),
            topAssets: (await this.getTopAssetsBySales(dateFilter)).slice(0, 10),
            salesByType: this.processSalesByType(transactions),
        };
    }
    processSalesByMonth(transactions) {
        const data = {};
        transactions.forEach((tx) => {
            const d = new Date(tx.date);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!data[key])
                data[key] = { revenue: 0, transactions: 0, commission: 0 };
            data[key].revenue += tx.totalAmount || 0;
            data[key].transactions += 1;
            data[key].commission += tx.totalCommission || 0;
        });
        return Object.entries(data).map(([month, d]) => ({
            month, revenue: d.revenue, transactions: d.transactions,
            avgValue: d.transactions > 0 ? d.revenue / d.transactions : 0, commission: d.commission,
        }));
    }
    async getTopAssetsBySales(dateFilter) {
        const result = await this.prisma.transaction.groupBy({
            by: ['assetId'],
            where: { status: 'COMPLETED', ...dateFilter },
            _sum: { totalAmount: true, totalCommission: true },
            _count: true,
            orderBy: { _sum: { totalAmount: 'desc' } },
            take: 10,
        });
        if (!result.length)
            return [];
        const assets = await this.prisma.asset.findMany({
            where: { id: { in: result.map((r) => r.assetId) } },
            select: { id: true, name: true, type: true, location: true },
        });
        const map = new Map(assets.map((a) => [a.id, a]));
        return result.map((r) => {
            const a = map.get(r.assetId);
            return {
                name: a?.name || 'Unknown', revenue: r._sum.totalAmount || 0,
                count: r._count, commission: r._sum.totalCommission || 0,
                type: a?.type || 'Unknown', location: a?.location || 'Unknown',
            };
        });
    }
    processSalesByType(transactions) {
        const data = {};
        transactions.forEach((tx) => {
            const type = tx.paymentType || 'Standard';
            if (!data[type])
                data[type] = { revenue: 0, count: 0, commission: 0 };
            data[type].revenue += tx.totalAmount || 0;
            data[type].count += 1;
            data[type].commission += tx.totalCommission || 0;
        });
        return Object.entries(data).map(([type, d]) => ({
            type, revenue: d.revenue, count: d.count,
            avgValue: d.count > 0 ? d.revenue / d.count : 0, commission: d.commission,
        })).sort((a, b) => b.revenue - a.revenue);
    }
    async getAgentPerformance(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const agents = await this.prisma.agent.findMany({
            where: { status: 'ACTIVE' },
            include: {
                user: { select: { name: true, email: true } },
                leadTransactions: {
                    where: { status: 'COMPLETED', ...dateFilter },
                    select: { totalAmount: true, leadCommission: true, earnedLeadCommission: true, totalCommission: true, earnedTotalCommission: true, date: true },
                },
                closerTransactions: {
                    where: { status: 'COMPLETED', ...dateFilter },
                    select: { totalAmount: true, closerCommission: true, earnedCloserCommission: true, totalCommission: true, earnedTotalCommission: true, date: true },
                },
                cluster: { select: { name: true } },
            },
        });
        const agentPerformance = agents.map((agent) => {
            const leadTxs = agent.leadTransactions || [];
            const closerTxs = agent.closerTransactions || [];
            const all = [...leadTxs, ...closerTxs];
            const revenue = all.reduce((s, tx) => s + (tx.totalAmount || 0), 0);
            const leadComm = leadTxs.reduce((s, tx) => s + (tx.earnedLeadCommission || tx.leadCommission || 0), 0);
            const closerComm = closerTxs.reduce((s, tx) => s + (tx.earnedCloserCommission || tx.closerCommission || 0), 0);
            const totalComm = all.reduce((s, tx) => s + (tx.earnedTotalCommission || tx.totalCommission || 0), 0);
            return {
                name: agent.user?.name || 'Unknown',
                email: agent.user?.email || '',
                cluster: agent.cluster?.name || 'Unassigned',
                closedDeals: all.length,
                revenue, totalCommission: totalComm, leadCommission: leadComm, closerCommission: closerComm,
                conversionRate: '0.0',
                avgDealSize: all.length > 0 ? revenue / all.length : 0,
            };
        }).sort((a, b) => b.revenue - a.revenue);
        return {
            data: agentPerformance,
            summary: {
                totalAgents: agentPerformance.length,
                totalRevenue: agentPerformance.reduce((s, a) => s + a.revenue, 0),
                totalCommission: agentPerformance.reduce((s, a) => s + a.totalCommission, 0),
                avgConversionRate: '0.0',
            },
        };
    }
    async getClusterPerformance(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const clusters = await this.prisma.cluster.findMany({
            where: { status: 'active' },
            include: {
                agents: {
                    where: { status: 'ACTIVE' },
                    include: {
                        user: { select: { name: true, email: true } },
                        leadTransactions: {
                            where: { status: 'COMPLETED', ...dateFilter },
                            select: { totalAmount: true, earnedLeadCommission: true, earnedTotalCommission: true, totalCommission: true },
                        },
                        closerTransactions: {
                            where: { status: 'COMPLETED', ...dateFilter },
                            select: { totalAmount: true, earnedCloserCommission: true, earnedTotalCommission: true, totalCommission: true },
                        },
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
        const clusterPerformance = clusters.map((cluster) => {
            let agentsCount = 0, closedDeals = 0, revenue = 0, totalCommission = 0;
            cluster.agents.forEach((agent) => {
                const all = [...(agent.leadTransactions || []), ...(agent.closerTransactions || [])];
                if (all.length > 0) {
                    agentsCount++;
                    closedDeals += all.length;
                    revenue += all.reduce((s, tx) => s + (tx.totalAmount || 0), 0);
                    totalCommission += all.reduce((s, tx) => s + (tx.earnedTotalCommission || tx.totalCommission || 0), 0);
                }
            });
            return {
                name: cluster.name, agents: agentsCount, closedDeals, revenue, totalCommission,
                avgRevenuePerAgent: agentsCount > 0 ? revenue / agentsCount : 0,
                avgDealsPerAgent: agentsCount > 0 ? closedDeals / agentsCount : 0,
                avgCommissionPerAgent: agentsCount > 0 ? totalCommission / agentsCount : 0,
            };
        }).sort((a, b) => b.revenue - a.revenue);
        const totals = clusterPerformance.reduce((acc, c) => ({
            agents: acc.agents + c.agents, revenue: acc.revenue + c.revenue,
            commission: acc.commission + c.totalCommission, deals: acc.deals + c.closedDeals,
        }), { agents: 0, revenue: 0, commission: 0, deals: 0 });
        return {
            data: clusterPerformance,
            summary: {
                totalClusters: clusterPerformance.length,
                totalAgents: totals.agents, totalRevenue: totals.revenue,
                totalCommission: totals.commission, totalClosedDeals: totals.deals,
                avgRevenuePerCluster: clusterPerformance.length > 0 ? totals.revenue / clusterPerformance.length : 0,
                avgAgentsPerCluster: clusterPerformance.length > 0 ? totals.agents / clusterPerformance.length : 0,
            },
        };
    }
    async exportReport(type, dateRange) {
        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet(type.charAt(0).toUpperCase() + type.slice(1));
        if (type === 'sales') {
            const data = await this.getSalesReport(dateRange);
            ws.addRow(['BuyOps - Sales Report']);
            ws.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            ws.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            ws.addRow([]);
            ws.addRow(['SUMMARY']);
            ws.addRow([]);
            ws.addRow(['Metric', 'Value', 'Change vs Previous Period']);
            ws.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`, `${data.summary.revenueChange.toFixed(1)}%`]);
            ws.addRow(['Total Transactions', data.summary.totalTransactions, `${data.summary.transactionChange.toFixed(1)}%`]);
            ws.addRow(['Average Deal Size', `₦${data.summary.avgDealSize.toLocaleString()}`, `${data.summary.avgDealSizeChange.toFixed(1)}%`]);
            ws.addRow([]);
            ws.addRow(['SALES BY MONTH']);
            ws.addRow([]);
            ws.addRow(['Month', 'Revenue', 'Transactions', 'Average Value', 'Commission']);
            data.salesByMonth.forEach((r) => ws.addRow([r.month, `₦${r.revenue.toLocaleString()}`, r.transactions, `₦${r.avgValue.toLocaleString()}`, `₦${r.commission.toLocaleString()}`]));
            ws.addRow([]);
            ws.addRow(['TOP PERFORMING ASSETS']);
            ws.addRow([]);
            ws.addRow(['Asset Name', 'Revenue', 'Transactions', 'Commission', 'Type', 'Location']);
            data.topAssets.forEach((a) => ws.addRow([a.name, `₦${a.revenue.toLocaleString()}`, a.count, `₦${a.commission.toLocaleString()}`, a.type, a.location]));
        }
        else if (type === 'agents') {
            const data = await this.getAgentPerformance(dateRange);
            ws.addRow(['BuyOps - Agent Performance Report']);
            ws.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            ws.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            ws.addRow([]);
            ws.addRow(['SUMMARY']);
            ws.addRow([]);
            ws.addRow(['Total Agents', data.summary.totalAgents]);
            ws.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`]);
            ws.addRow(['Total Commission', `₦${data.summary.totalCommission.toLocaleString()}`]);
            ws.addRow([]);
            ws.addRow(['AGENT PERFORMANCE']);
            ws.addRow([]);
            ws.addRow(['Name', 'Cluster', 'Closed Deals', 'Revenue', 'Total Commission', 'Lead Commission', 'Closer Commission', 'Avg Deal Size']);
            data.data.forEach((a) => ws.addRow([a.name, a.cluster, a.closedDeals, `₦${a.revenue.toLocaleString()}`, `₦${a.totalCommission.toLocaleString()}`, `₦${a.leadCommission.toLocaleString()}`, `₦${a.closerCommission.toLocaleString()}`, `₦${a.avgDealSize.toLocaleString()}`]));
        }
        else {
            const data = await this.getClusterPerformance(dateRange);
            ws.addRow(['BuyOps - Cluster Performance Report']);
            ws.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            ws.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            ws.addRow([]);
            ws.addRow(['SUMMARY']);
            ws.addRow([]);
            ws.addRow(['Total Clusters', data.summary.totalClusters]);
            ws.addRow(['Total Agents', data.summary.totalAgents]);
            ws.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`]);
            ws.addRow([]);
            ws.addRow(['CLUSTER PERFORMANCE']);
            ws.addRow([]);
            ws.addRow(['Cluster Name', 'Agents', 'Closed Deals', 'Revenue', 'Total Commission', 'Avg Revenue/Agent', 'Avg Deals/Agent']);
            data.data.forEach((c) => ws.addRow([c.name, c.agents, c.closedDeals, `₦${c.revenue.toLocaleString()}`, `₦${c.totalCommission.toLocaleString()}`, `₦${c.avgRevenuePerAgent.toLocaleString()}`, c.avgDealsPerAgent.toFixed(1)]));
        }
        ws.getRow(1).font = { bold: true, size: 16 };
        ws.eachRow((row, i) => {
            if (i > 4) {
                const val = row.getCell(1).value;
                if (typeof val === 'string' && ['SUMMARY', 'SALES BY MONTH', 'TOP PERFORMING ASSETS', 'AGENT PERFORMANCE', 'CLUSTER PERFORMANCE'].includes(val)) {
                    row.font = { bold: true, size: 12 };
                    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
                }
            }
        });
        ws.columns?.forEach((col) => {
            if (col && col.eachCell) {
                let max = 10;
                col.eachCell({ includeEmpty: true }, (cell) => { max = Math.max(max, (cell.value?.toString().length || 0) + 2); });
                col.width = Math.min(max, 40);
            }
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async getAssetPerformance(dateRange) {
        const statusAgg = await this.prisma.asset.groupBy({
            by: ['status'],
            _count: { status: true },
        });
        const colors = ["#4c51bf", "#10b981", "#f59e42", "#e53e3e", "#6b7280"];
        const assetPerformanceData = statusAgg.map((s, i) => ({
            name: s.status,
            value: s._count.status,
            color: colors[i % colors.length],
        }));
        const typeAgg = await this.prisma.asset.groupBy({
            by: ['type'],
            _count: { type: true },
        });
        const assetTypeBreakdown = typeAgg.map(t => ({
            type: t.type,
            count: t._count.type,
        }));
        return { assetPerformanceData, assetTypeBreakdown };
    }
    async getInvestmentTrends(dateRange) {
        const txs = await this.prisma.transaction.findMany({
            where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) },
            select: { date: true, ownershipType: true, totalAmount: true }
        });
        const trends = {};
        txs.forEach(tx => {
            const d = new Date(tx.date);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!trends[key])
                trends[key] = { fractional: 0, full: 0 };
            if (tx.ownershipType === 'Fractional')
                trends[key].fractional += tx.totalAmount;
            else
                trends[key].full += tx.totalAmount;
        });
        return Object.entries(trends).map(([month, v]) => ({ month, ...v }));
    }
    async getInvestorCategories(dateRange) {
        const investors = await this.prisma.user.groupBy({
            by: ['role'],
            _count: { role: true },
        });
        const txs = await this.prisma.transaction.findMany({
            where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) },
            select: { buyerId: true, totalAmount: true }
        });
        const invested = {};
        txs.forEach(tx => {
            invested[tx.buyerId] = (invested[tx.buyerId] || 0) + tx.totalAmount;
        });
        return investors.map(i => ({
            category: i.role,
            count: i._count.role,
            totalInvested: Object.values(invested).reduce((sum, v) => sum + v, 0),
        }));
    }
    async getCommissionTrends(dateRange) {
        const txs = await this.prisma.transaction.findMany({
            where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) },
            select: { date: true, leadCommission: true, closerCommission: true }
        });
        const data = {};
        txs.forEach(tx => {
            const d = new Date(tx.date);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!data[key])
                data[key] = { agentComm: 0, companyComm: 0 };
            data[key].agentComm += (tx.leadCommission || 0) + (tx.closerCommission || 0);
        });
        return Object.entries(data).map(([month, v]) => ({ month, ...v }));
    }
    async getTopAgents(dateRange) {
        const agents = await this.prisma.agent.findMany({
            where: { status: 'ACTIVE' },
            include: {
                user: { select: { name: true } },
                leadTransactions: { where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) } },
                closerTransactions: { where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) } },
            },
        });
        return agents.map(a => ({
            name: a.user?.name ?? '',
            deals: (a.leadTransactions?.length ?? 0) + (a.closerTransactions?.length ?? 0),
            commission: (a.leadTransactions?.reduce((s, tx) => s + (tx.leadCommission || 0), 0) ?? 0) +
                (a.closerTransactions?.reduce((s, tx) => s + (tx.closerCommission || 0), 0) ?? 0),
            conversion: 'N/A',
        }));
    }
    async getConversionMetrics(dateRange) {
        const leads = await this.prisma.lead.groupBy({
            by: ['status'],
            _count: { status: true },
        });
        return leads.map(l => ({
            stage: l.status,
            count: l._count.status,
        }));
    }
    async getCommissionReports(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const transactions = await this.prisma.transaction.findMany({
            where: { status: 'COMPLETED', ...dateFilter },
            select: {
                date: true,
                leadCommission: true,
                closerCommission: true,
                totalCommission: true,
                commissionPaymentStatus: true,
                paymentType: true,
            },
            orderBy: { date: 'desc' },
        });
        let thisMonthTotal = 0;
        let totalEarned = 0;
        let pendingTotal = 0;
        let leadCommissionTotal = 0;
        let closerCommissionTotal = 0;
        let teamLeadBonus = 0;
        let teamTotalCommission = 0;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        transactions.forEach(tx => {
            const txDate = new Date(tx.date);
            if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
                thisMonthTotal += tx.totalCommission || 0;
            }
            totalEarned += (tx.commissionPaymentStatus === 'PAID' ? tx.totalCommission || 0 : 0);
            pendingTotal += (tx.commissionPaymentStatus === client_1.CommissionPaymentStatus.SENT ? tx.totalCommission || 0 : 0);
            leadCommissionTotal += tx.leadCommission || 0;
            closerCommissionTotal += tx.closerCommission || 0;
            if (tx.paymentType === 'installment') {
                teamLeadBonus += (tx.totalCommission || 0) * 0.05;
            }
            teamTotalCommission += tx.totalCommission || 0;
        });
        const conversionRate = transactions.length > 0
            ? Math.round((totalEarned / teamTotalCommission) * 100)
            : 0;
        const monthlyMap = {};
        transactions.forEach(tx => {
            const d = new Date(tx.date);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            monthlyMap[key] = (monthlyMap[key] || 0) + (tx.totalCommission || 0);
        });
        const monthlyData = Object.entries(monthlyMap).map(([month, amount]) => ({
            month,
            amount,
        }));
        const breakdown = [
            { name: "Lead", value: leadCommissionTotal, color: "#6366f1" },
            { name: "Closer", value: closerCommissionTotal, color: "#06b6d4" },
        ];
        return {
            summary: {
                thisMonth: `₦${thisMonthTotal.toLocaleString()}`,
                totalEarned: `₦${totalEarned.toLocaleString()}`,
                pending: `₦${pendingTotal.toLocaleString()}`,
                leadCommission: `₦${leadCommissionTotal.toLocaleString()}`,
                closerCommission: `₦${closerCommissionTotal.toLocaleString()}`,
                conversionRate: `${conversionRate}%`,
                teamLeadBonus: `₦${teamLeadBonus.toLocaleString()}`,
                teamTotalCommission: `₦${teamTotalCommission.toLocaleString()}`,
            },
            monthly: monthlyData,
            breakdown,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ReportsService);


/***/ }),

/***/ "./src/sales/sales.controller.ts":
/*!***************************************!*\
  !*** ./src/sales/sales.controller.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SalesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const sales_service_1 = __webpack_require__(/*! ./sales.service */ "./src/sales/sales.service.ts");
let SalesController = class SalesController {
    constructor(svc) {
        this.svc = svc;
    }
    async mySales(req) {
        return this.svc.findByUser(req.user.id);
    }
    async all() {
        return this.svc.findAll();
    }
    async summary() {
        return this.svc.getSalesSummary();
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "mySales", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "all", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "summary", null);
exports.SalesController = SalesController = __decorate([
    (0, common_1.Controller)('sales'),
    __metadata("design:paramtypes", [typeof (_a = typeof sales_service_1.SalesService !== "undefined" && sales_service_1.SalesService) === "function" ? _a : Object])
], SalesController);


/***/ }),

/***/ "./src/sales/sales.module.ts":
/*!***********************************!*\
  !*** ./src/sales/sales.module.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SalesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const sales_controller_1 = __webpack_require__(/*! ./sales.controller */ "./src/sales/sales.controller.ts");
const sales_service_1 = __webpack_require__(/*! ./sales.service */ "./src/sales/sales.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let SalesModule = class SalesModule {
};
exports.SalesModule = SalesModule;
exports.SalesModule = SalesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [sales_controller_1.SalesController],
        providers: [sales_service_1.SalesService],
    })
], SalesModule);


/***/ }),

/***/ "./src/sales/sales.service.ts":
/*!************************************!*\
  !*** ./src/sales/sales.service.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SalesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let SalesService = class SalesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUser(userId) {
        return this.prisma.transaction.findMany({
            where: { buyerId: userId },
            include: {
                asset: { select: { id: true, name: true, type: true } },
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
                installments: true,
            },
            orderBy: { date: 'desc' },
        });
    }
    async findAll() {
        return this.prisma.transaction.findMany({
            where: { status: 'COMPLETED' },
            include: {
                asset: { select: { id: true, name: true, type: true } },
                buyer: { select: { id: true, name: true, email: true } },
                company: { select: { id: true, name: true } },
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
            },
            orderBy: { date: 'desc' },
        });
    }
    async getSalesSummary() {
        const agg = await this.prisma.transaction.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { totalAmount: true, totalCommission: true },
            _count: true,
        });
        return {
            totalSales: agg._count,
            totalRevenue: agg._sum.totalAmount || 0,
            totalCommission: agg._sum.totalCommission || 0,
            avgDealSize: agg._count > 0 ? (agg._sum.totalAmount || 0) / agg._count : 0,
        };
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SalesService);


/***/ }),

/***/ "./src/transactions/transactions.controller.ts":
/*!*****************************************************!*\
  !*** ./src/transactions/transactions.controller.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const transactions_service_1 = __webpack_require__(/*! ./transactions.service */ "./src/transactions/transactions.service.ts");
class CreateTransactionDto {
}
class SendCommissionsDto {
}
let TransactionsController = class TransactionsController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async findAll(month) {
        return this.transactionsService.findAll({ month });
    }
    async getStats() {
        return this.transactionsService.getStats();
    }
    async getUnpaidCommissions(month) {
        return this.transactionsService.getUnpaidCommissions({ month });
    }
    async getPaidCommissions(month) {
        return this.transactionsService.getPaidCommissions({ month });
    }
    async findOne(id) {
        return this.transactionsService.findById(id);
    }
    async create(dto) {
        return this.transactionsService.create(dto);
    }
    async sendCommissions(dto) {
        return this.transactionsService.sendCommissionsForPayment(dto.transactionIds);
    }
    async uploadPaymentProof(file) {
        return this.transactionsService.uploadPaymentProof(file);
    }
    async update(id, dto) {
        return this.transactionsService.update(id, dto);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)("commissions/unpaid"),
    __param(0, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getUnpaidCommissions", null);
__decorate([
    (0, common_1.Get)("commissions/paid"),
    __param(0, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getPaidCommissions", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("commissions/send"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendCommissionsDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "sendCommissions", null);
__decorate([
    (0, common_1.Post)("commissions/payment-proof"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "uploadPaymentProof", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof Partial !== "undefined" && Partial) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "update", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)("transactions"),
    __metadata("design:paramtypes", [typeof (_a = typeof transactions_service_1.TransactionsService !== "undefined" && transactions_service_1.TransactionsService) === "function" ? _a : Object])
], TransactionsController);


/***/ }),

/***/ "./src/transactions/transactions.module.ts":
/*!*************************************************!*\
  !*** ./src/transactions/transactions.module.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const transactions_controller_1 = __webpack_require__(/*! ./transactions.controller */ "./src/transactions/transactions.controller.ts");
const transactions_service_1 = __webpack_require__(/*! ./transactions.service */ "./src/transactions/transactions.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
        ],
        controllers: [transactions_controller_1.TransactionsController],
        providers: [transactions_service_1.TransactionsService],
        exports: [transactions_service_1.TransactionsService],
    })
], TransactionsModule);


/***/ }),

/***/ "./src/transactions/transactions.service.ts":
/*!**************************************************!*\
  !*** ./src/transactions/transactions.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let TransactionsService = class TransactionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUnpaidCommissions({ month }) {
        return this.findAll({
            status: undefined,
            month,
        }).then(transactions => transactions.filter(t => t.status === 'unpaid' || t.status === 'sent'));
    }
    async getPaidCommissions({ month }) {
        return this.findAll({
            status: undefined,
            month,
        }).then(transactions => transactions.filter(t => t.status === 'paid'));
    }
    async sendCommissionsForPayment(transactionIds) {
        await this.prisma.transaction.updateMany({
            where: { id: { in: transactionIds } },
            data: { commissionPaymentStatus: 'SENT' },
        });
        return { message: 'Commissions marked as sent', transactionIds };
    }
    async uploadPaymentProof(file) {
        await this.prisma.transaction.updateMany({
            where: { commissionPaymentStatus: 'SENT' },
            data: { commissionPaymentStatus: 'PAID' },
        });
        return { message: 'Payment proof uploaded and commissions marked as paid', fileName: file?.originalname };
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.agentId) {
            where.OR = [{ leadAgentId: filters.agentId }, { closerAgentId: filters.agentId }];
        }
        if (filters?.companyId)
            where.companyId = filters.companyId;
        if (filters?.month) {
            const [year, month] = filters.month.split('-');
            const start = new Date(Number(year), Number(month) - 1, 1);
            const end = new Date(Number(year), Number(month), 1);
            where.date = { gte: start, lt: end };
        }
        const transactions = await this.prisma.transaction.findMany({
            where,
            include: {
                asset: { select: { name: true } },
                buyer: { select: { name: true } },
                company: { select: { name: true } },
                leadAgent: { include: { user: { select: { name: true } } } },
                closerAgent: { include: { user: { select: { name: true } } } },
                installments: true,
            },
            orderBy: { date: 'desc' },
        });
        return transactions.map(formatDeal);
    }
    async findById(id) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                asset: true,
                buyer: { select: { id: true, name: true, email: true } },
                company: true,
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
                installments: { orderBy: { dueDate: 'asc' } },
                installmentPlans: true,
                commissions: { include: { agent: { include: { user: { select: { id: true, name: true } } } } } },
            },
        });
        if (!transaction)
            throw new common_1.NotFoundException(`Transaction with ID ${id} not found`);
        return transaction;
    }
    async create(data) {
        if (!data.assetId)
            throw new common_1.BadRequestException('Asset ID is required');
        if (!data.buyerId)
            throw new common_1.BadRequestException('Buyer ID is required');
        if (!data.totalAmount)
            throw new common_1.BadRequestException('Total amount is required');
        const asset = await this.prisma.asset.findUnique({ where: { id: data.assetId } });
        if (!asset)
            throw new common_1.NotFoundException('Asset not found');
        const buyer = await this.prisma.user.findUnique({ where: { id: data.buyerId } });
        if (!buyer)
            throw new common_1.NotFoundException('Buyer not found');
        return this.prisma.transaction.create({
            data: {
                assetId: data.assetId,
                buyerId: data.buyerId,
                totalAmount: parseFloat(data.totalAmount),
                companyId: data.companyId || asset.companyId || null,
                paymentType: data.paymentType || null,
                leadAgentId: data.leadAgentId || null,
                closerAgentId: data.closerAgentId || null,
                leadCommission: data.leadCommission ? parseFloat(data.leadCommission) : 0,
                closerCommission: data.closerCommission ? parseFloat(data.closerCommission) : 0,
                totalCommission: data.totalCommission ? parseFloat(data.totalCommission) : 0,
                commission: data.commission ? parseFloat(data.commission) : 0,
                status: data.status || client_1.CommissionPaymentStatus.UNPAID,
                commissionPaymentStatus: data.commissionPaymentStatus || client_1.CommissionPaymentStatus.UNPAID,
                installmentDuration: data.installmentDuration ? parseInt(data.installmentDuration) : null,
            },
            include: {
                asset: { select: { id: true, name: true } },
                buyer: { select: { id: true, name: true } },
                company: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = {};
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.commissionPaymentStatus !== undefined)
            updateData.commissionPaymentStatus = data.commissionPaymentStatus;
        if (data.leadAgentId !== undefined)
            updateData.leadAgentId = data.leadAgentId;
        if (data.closerAgentId !== undefined)
            updateData.closerAgentId = data.closerAgentId;
        if (data.totalAmount !== undefined)
            updateData.totalAmount = parseFloat(data.totalAmount);
        if (data.paymentType !== undefined)
            updateData.paymentType = data.paymentType;
        if (data.companyId !== undefined)
            updateData.companyId = data.companyId;
        return this.prisma.transaction.update({
            where: { id },
            data: updateData,
            include: {
                asset: { select: { id: true, name: true } },
                company: { select: { id: true, name: true } },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.transaction.delete({ where: { id } });
        return { message: 'Transaction deleted successfully', id };
    }
    async getStats(filters) {
        const where = { status: 'COMPLETED' };
        if (filters?.startDate)
            where.date = { ...where.date, gte: new Date(filters.startDate) };
        if (filters?.endDate)
            where.date = { ...where.date, lte: new Date(filters.endDate) };
        const [total, revenue, commissions] = await Promise.all([
            this.prisma.transaction.count({ where }),
            this.prisma.transaction.aggregate({ where, _sum: { totalAmount: true } }),
            this.prisma.transaction.aggregate({ where, _sum: { totalCommission: true } }),
        ]);
        return {
            totalTransactions: total,
            totalRevenue: revenue._sum.totalAmount || 0,
            totalCommissions: commissions._sum.totalCommission || 0,
            avgDealSize: total > 0 ? (revenue._sum.totalAmount || 0) / total : 0,
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], TransactionsService);
function formatDeal(tx) {
    return {
        id: tx.id,
        leadName: tx.buyer?.name ?? tx.leadAgent?.user?.name ?? "",
        asset: tx.asset?.name ?? "",
        propertyValue: tx.totalAmount ? `₦${tx.totalAmount.toLocaleString()}` : "",
        commission: tx.commission,
        totalCommission: tx.totalCommission ? `₦${tx.totalCommission.toLocaleString()}` : "",
        leadCommission: tx.leadCommission ? `₦${tx.leadCommission.toLocaleString()}` : "",
        closerCommission: tx.closerCommission ? `₦${tx.closerCommission.toLocaleString()}` : "",
        commissionType: tx.leadAgentId && tx.closerAgentId
            ? (tx.leadAgentId === tx.closerAgentId ? "split" : "lead")
            : "lead",
        status: tx.commissionPaymentStatus?.toLowerCase() ?? "unpaid",
        eligibility: tx.commissionPaymentStatus === "PAID" ? "Eligible" : "Not Eligible",
        payoutDate: tx.updatedAt?.toISOString().split("T")[0],
        paymentPlan: tx.paymentType === "installment"
            ? {
                type: "installment",
                numberOfInstallments: tx.installments?.length ?? 0,
            }
            : null,
        commissionBreakdown: (tx.installments ?? []).map((inst, idx) => ({
            installmentId: inst.id,
            installmentNumber: inst.installmentNumber ?? idx + 1,
            leadCommission: inst.leadCommission ?? 0,
            closerCommission: inst.closerCommission ?? 0,
            totalCommission: (inst.leadCommission ?? 0) + (inst.closerCommission ?? 0),
            status: inst.status === "PAID" ? "earned" : (inst.status === "PENDING" ? "pending" : "scheduled"),
            earnedDate: inst.paidDate ?? null,
        })),
    };
}


/***/ }),

/***/ "./src/users/users.controller.ts":
/*!***************************************!*\
  !*** ./src/users/users.controller.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = exports.CreateUserDto = exports.UpdatePasswordDto = exports.UpdateUserDto = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_auth_guard_1 = __webpack_require__(/*! src/auth/jwt-auth.guard */ "./src/auth/jwt-auth.guard.ts");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/users/users.service.ts");
const roles_guard_1 = __webpack_require__(/*! ../common/roles.guard */ "./src/common/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../common/roles.decorator */ "./src/common/roles.decorator.ts");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
class UpdatePasswordDto {
}
exports.UpdatePasswordDto = UpdatePasswordDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], UpdatePasswordDto.prototype, "newPassword", void 0);
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters' }),
    (0, class_validator_1.Matches)(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, {
        message: 'Password must include at least one number and one special character',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(ADMIN|INVESTOR|SALES)$/i, {
        message: 'Role must be one of: ADMIN, INVESTOR, SALES',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(ACTIVE|INACTIVE|PENDING)$/i, {
        message: 'Status must be one of: ACTIVE, INACTIVE, PENDING',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(role, status, search) {
        return this.usersService.findAll({ role, status, search });
    }
    async getProfile(req) {
        return this.usersService.findById(req.user.id);
    }
    async updateProfile(req, dto) {
        return this.usersService.updateUser(req.user.id, dto);
    }
    async findOne(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view this profile");
        }
        return this.usersService.findById(id);
    }
    async findByEmail(email) {
        return this.usersService.findByEmail(email);
    }
    async getUserStats(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view these statistics");
        }
        return this.usersService.getUserStats(id);
    }
    async getUserActivity(id, limit, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view this activity");
        }
        const activityLimit = limit ? parseInt(limit) : 20;
        return this.usersService.getUserActivity(id, activityLimit);
    }
    async getUserTransactions(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view these transactions");
        }
        return this.usersService.getUserTransactions(id);
    }
    async getUserLeads(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view these leads");
        }
        return this.usersService.getUserLeads(id);
    }
    async create(dto) {
        return this.usersService.createUser(dto);
    }
    async update(id, dto, req) {
        if (req.user.role !== "ADMIN") {
            if (req.user.id !== id) {
                throw new Error("Unauthorized to update this profile");
            }
            delete dto.role;
        }
        return this.usersService.updateUser(id, dto);
    }
    async updateRole(id, role) {
        return this.usersService.updateUserRole(id, role);
    }
    async updatePassword(id, dto) {
        return this.usersService.updateUserPassword(id, dto.newPassword);
    }
    async deactivate(id) {
        return this.usersService.deactivateUser(id);
    }
    async reactivate(id) {
        return this.usersService.reactivateUser(id);
    }
    async remove(id) {
        return this.usersService.deleteUser(id);
    }
    async getUsersByRole(role) {
        return this.usersService.getUsersByRole(role);
    }
    async getUserDashboard(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view this dashboard");
        }
        return this.usersService.getUserDashboard(id);
    }
    async getAllAgents() {
        return this.usersService.getAllAgents();
    }
    async getAllInvestors() {
        return this.usersService.getAllInvestors();
    }
    async searchUsers(query, role) {
        return this.usersService.searchUsers(query, role);
    }
    async getUserCountByRole() {
        return this.usersService.getUserCountByRole();
    }
    async bulkCreate(users) {
        return this.usersService.bulkCreateUsers(users);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("role")),
    __param(1, (0, common_1.Query)("status")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("me"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)("me"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("email/:email"),
    __param(0, (0, common_1.Param)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)(":id/stats"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Get)(":id/activity"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserActivity", null);
__decorate([
    (0, common_1.Get)(":id/transactions"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserTransactions", null);
__decorate([
    (0, common_1.Get)(":id/leads"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserLeads", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Put)(":id/role"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateRole", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Put)(":id/password"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(":id/deactivate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deactivate", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(":id/reactivate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "reactivate", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("by-role/:role"),
    __param(0, (0, common_1.Param)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsersByRole", null);
__decorate([
    (0, common_1.Get)(":id/dashboard"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserDashboard", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("agents/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllAgents", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("investors/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllInvestors", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("search/query"),
    __param(0, (0, common_1.Query)("q")),
    __param(1, (0, common_1.Query)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "searchUsers", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("count/by-role"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserCountByRole", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)("bulk-create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)("users")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "bulkCreate", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ }),

/***/ "./src/users/users.module.ts":
/*!***********************************!*\
  !*** ./src/users/users.module.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const users_controller_1 = __webpack_require__(/*! ./users.controller */ "./src/users/users.controller.ts");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/users/users.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),

/***/ "./src/users/users.service.ts":
/*!************************************!*\
  !*** ./src/users/users.service.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll({ role, status, search } = {}) {
        let where = {};
        if (role && Object.values(client_1.UserRole).includes(role)) {
            where.role = role;
        }
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        return this.prisma.user.findMany({
            where,
            select: { id: true, email: true, name: true, role: true, createdAt: true },
        });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                agentProfile: {
                    include: {
                        cluster: true,
                        assignedLeads: true,
                        leadTransactions: true,
                        closerTransactions: true,
                    },
                },
                freelancerProfile: {
                    include: { cluster: true },
                },
                notifications: { orderBy: { createdAt: 'desc' }, take: 10 },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async getUserTransactions(userId) {
        return this.prisma.transaction.findMany({
            where: { buyerId: userId },
            include: {
                asset: {
                    select: { id: true, name: true, type: true, location: true },
                },
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
                installments: true,
            },
            orderBy: { date: 'desc' },
        });
    }
    async getUserStats(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role === 'AGENT') {
            const agent = await this.prisma.agent.findUnique({ where: { userId } });
            if (!agent)
                return { closedDeals: 0, totalCommission: 0, assignedLeads: 0 };
            const [leadCount, leadTxCount, closerTxCount] = await Promise.all([
                this.prisma.lead.count({ where: { assignedToId: agent.id } }),
                this.prisma.transaction.count({ where: { leadAgentId: agent.id, status: 'COMPLETED' } }),
                this.prisma.transaction.count({ where: { closerAgentId: agent.id, status: 'COMPLETED' } }),
            ]);
            return {
                assignedLeads: leadCount,
                closedDeals: leadTxCount + closerTxCount,
                totalCommission: agent.totalCommission,
            };
        }
        if (user.role === 'INVESTOR') {
            const stats = await this.prisma.transaction.aggregate({
                where: { buyerId: userId },
                _sum: { totalAmount: true },
                _count: true,
            });
            return {
                totalInvested: stats._sum.totalAmount || 0,
                totalTransactions: stats._count,
            };
        }
        const [totalUsers, totalTransactions, revenueAgg] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.transaction.count({ where: { status: 'COMPLETED' } }),
            this.prisma.transaction.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { totalAmount: true },
            }),
        ]);
        return {
            totalUsers,
            totalTransactions,
            totalRevenue: revenueAgg._sum.totalAmount || 0,
        };
    }
    async updateUser(id, dto) {
        return this.prisma.user.update({ where: { id }, data: dto });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async getUserActivity(id, limit) {
        return this.prisma.notification.findMany({ where: { userId: id }, take: limit, orderBy: { createdAt: 'desc' } });
    }
    async getUserLeads(id) {
        return this.prisma.lead.findMany({ where: { assignedToId: id } });
    }
    async createUser(dto) {
        if (!dto.status || !['ACTIVE', 'INACTIVE', 'PENDING'].includes(dto.status.toUpperCase())) {
            throw new Error('User status is required and must be one of: ACTIVE, INACTIVE, PENDING');
        }
        return this.prisma.user.create({ data: { ...dto, status: dto.status.toUpperCase() } });
    }
    async updateUserRole(id, role) {
        if (!Object.values(client_1.UserRole).includes(role)) {
            throw new Error('Invalid role');
        }
        return this.prisma.user.update({ where: { id }, data: { role: role } });
    }
    async updateUserPassword(id, newPassword) {
        return this.prisma.user.update({ where: { id }, data: { password: newPassword } });
    }
    async deactivateUser(id) {
        throw new Error('User model does not have a status field');
    }
    async reactivateUser(id) {
        throw new Error('User model does not have a status field');
    }
    async deleteUser(id) {
        return this.prisma.user.delete({ where: { id } });
    }
    async getUsersByRole(role) {
        if (!Object.values(client_1.UserRole).includes(role)) {
            throw new Error('Invalid role');
        }
        return this.prisma.user.findMany({ where: { role: role } });
    }
    async getUserDashboard(id) {
        return { userId: id, dashboard: 'stub' };
    }
    async getAllAgents() {
        return this.prisma.user.findMany({ where: { role: client_1.UserRole.AGENT } });
    }
    async getAllInvestors() {
        return this.prisma.user.findMany({ where: { role: client_1.UserRole.INVESTOR } });
    }
    async searchUsers(query, role) {
        let where = {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
            ],
        };
        if (role && Object.values(client_1.UserRole).includes(role)) {
            where.role = role;
        }
        return this.prisma.user.findMany({ where });
    }
    async getUserCountByRole() {
        return this.prisma.user.groupBy({ by: ['role'], _count: { role: true } });
    }
    async bulkCreateUsers(users) {
        return this.prisma.user.createMany({ data: users });
    }
    async delete(id) {
        return this.prisma.user.delete({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UsersService);


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/platform-express":
/*!*******************************************!*\
  !*** external "@nestjs/platform-express" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),

/***/ "@nestjs/schedule":
/*!***********************************!*\
  !*** external "@nestjs/schedule" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),

/***/ "@prisma/adapter-pg":
/*!*************************************!*\
  !*** external "@prisma/adapter-pg" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("@prisma/adapter-pg");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "dotenv/config":
/*!********************************!*\
  !*** external "dotenv/config" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),

/***/ "exceljs":
/*!**************************!*\
  !*** external "exceljs" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("exceljs");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("pg");

/***/ }),

/***/ "twilio":
/*!*************************!*\
  !*** external "twilio" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("twilio");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! dotenv/config */ "dotenv/config");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const frontendOrigins = process.env.FRONTEND_ORIGINS
        ? process.env.FRONTEND_ORIGINS.split(",").map((o) => o.trim())
        : ["http://localhost:5173"];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
            if (frontendOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'), false);
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`Server listening on ${port}`);
}
bootstrap();

})();

/******/ })()
;