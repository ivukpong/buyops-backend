"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const investments_module_1 = require("./investments/investments.module");
const sales_module_1 = require("./sales/sales.module");
const assets_controller_1 = require("./assets/assets.controller");
const companies_controller_1 = require("./companies/companies.controller");
const agents_controller_1 = require("./agents/agents.controller");
const clusters_controller_1 = require("./clusters/clusters.controller");
const leads_controller_1 = require("./leads/leads.controller");
const transactions_controller_1 = require("./transactions/transactions.controller");
const installments_controller_1 = require("./installments/installments.controller");
const reports_controller_1 = require("./reports/reports.controller");
const assets_module_1 = require("./assets/assets.module");
const companies_module_1 = require("./companies/companies.module");
const agents_module_1 = require("./agents/agents.module");
const clusters_module_1 = require("./clusters/clusters.module");
const leads_module_1 = require("./leads/leads.module");
const transactions_module_1 = require("./transactions/transactions.module");
const installments_module_1 = require("./installments/installments.module");
const reports_module_1 = require("./reports/reports.module");
const freelancers_service_1 = require("./freelancers/freelancers.service");
const freelancers_module_1 = require("./freelancers/freelancers.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            investments_module_1.InvestmentsModule,
            sales_module_1.SalesModule,
            assets_module_1.AssetsModule,
            companies_module_1.CompaniesModule,
            agents_module_1.AgentsModule,
            clusters_module_1.ClustersModule,
            leads_module_1.LeadsModule,
            transactions_module_1.TransactionsModule,
            installments_module_1.InstallmentsModule,
            reports_module_1.ReportsModule,
            freelancers_module_1.FreelancersModule,
            dashboard_module_1.DashboardModule,
        ],
        controllers: [assets_controller_1.AssetsController, companies_controller_1.CompaniesController, agents_controller_1.AgentsController, clusters_controller_1.ClustersController, leads_controller_1.LeadsController, transactions_controller_1.TransactionsController, installments_controller_1.InstallmentsController, reports_controller_1.ReportsController],
        providers: [freelancers_service_1.FreelancersService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map