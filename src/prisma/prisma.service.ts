// // src/prisma/prisma.service.ts  (or wherever your service lives)
// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';   // ← change for your DB
// import { Pool } from 'pg';                       // for PostgreSQL

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
//   constructor() {
//     // Create the connection pool (adjust for your DB)
//     const pool = new Pool({ connectionString: process.env.DATABASE_URL });

//     const adapter = new PrismaPg(pool);   // ← PostgreSQL example

//     // Pass the adapter (and optionally other options like log)
//     super({ adapter });
//   }

//   async onModuleInit() {
//     await this.$connect();
//   }

//   async onModuleDestroy() {
//     await this.$disconnect();
//   }
// }



import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleDestroy {

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Railway-safe
      max: 3,                       // Railway hobby allows ~5 total; stay well under
      min: 1,                       // keep 1 warm conn so first request doesn't cold-start
      idleTimeoutMillis: 10_000,    // release idle conns before Railway's ~30s proxy timeout
      connectionTimeoutMillis: 20_000, // wait up to 20s for the proxy to accept a new TCP conn
      keepAlive: true,              // send TCP keepalive packets — prevents proxy from dropping idle conns
      keepAliveInitialDelayMillis: 5_000, // start keepalive probes after 5s idle
    });

    super({
      adapter: new PrismaPg(pool),
      log: ["error", "warn"],
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
