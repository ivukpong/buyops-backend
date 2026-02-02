// src/prisma/prisma.service.ts  (or wherever your service lives)
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';   // ← change for your DB
import { Pool } from 'pg';                       // for PostgreSQL

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Create the connection pool (adjust for your DB)
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    const adapter = new PrismaPg(pool);   // ← PostgreSQL example

    // Pass the adapter (and optionally other options like log)
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}