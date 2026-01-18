import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { InvestmentsModule } from "./investments/investments.module";
import { SalesModule } from "./sales/sales.module";
import { AssetsController } from './assets/assets.controller';
import { CompaniesController } from './companies/companies.controller';
import { AgentsController } from './agents/agents.controller';
import { ClustersController } from './clusters/clusters.controller';
import { LeadsController } from './leads/leads.controller';
import { TransactionsController } from './transactions/transactions.controller';
import { InstallmentsController } from './installments/installments.controller';
import { ReportsController } from './reports/reports.controller';
import { AssetsModule } from './assets/assets.module';
import { CompaniesModule } from './companies/companies.module';
import { AgentsModule } from './agents/agents.module';
import { ClustersModule } from './clusters/clusters.module';
import { LeadsModule } from './leads/leads.module';
import { TransactionsModule } from './transactions/transactions.module';
import { InstallmentsModule } from './installments/installments.module';
import { ReportsModule } from './reports/reports.module';
import { FreelancersService } from './freelancers/freelancers.service';
import { FreelancersModule } from './freelancers/freelancers.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    InvestmentsModule,
    SalesModule,
    AssetsModule,
    CompaniesModule,
    AgentsModule,
    ClustersModule,
    LeadsModule,
    TransactionsModule,
    InstallmentsModule,
    ReportsModule,
    FreelancersModule,
    DashboardModule,
  ],
  controllers: [AssetsController, CompaniesController, AgentsController, ClustersController, LeadsController, TransactionsController, InstallmentsController, ReportsController],
  providers: [FreelancersService],
})
export class AppModule {}
