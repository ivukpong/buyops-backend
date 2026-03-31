import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { CompaniesModule } from './companies/companies.module';
import { AgentsModule } from './agents/agents.module';
import { ClustersModule } from './clusters/clusters.module';
import { LeadsModule } from './leads/leads.module';
import { TransactionsModule } from './transactions/transactions.module';
import { InstallmentsModule } from './installments/installments.module';
import { NotificationModule } from './notification/notification.module';
import { SalesModule } from './sales/sales.module';
import { InvestmentsModule } from './investments/investments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { FreelancersModule } from './freelancers/freelancers.module';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentsModule } from './payments/payments.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '3600s' },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    AssetsModule,
    CompaniesModule,
    AgentsModule,
    ClustersModule,
    LeadsModule,
    TransactionsModule,
    InstallmentsModule,
    NotificationModule, // Ensure NotificationModule is imported
    SalesModule,
    InvestmentsModule,
    DashboardModule,
    ReportsModule,
    FreelancersModule,
    PrismaModule,
    PaymentsModule,
  ],
})
export class AppModule { }
