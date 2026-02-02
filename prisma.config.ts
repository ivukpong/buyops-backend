// prisma.config.ts (project root)
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        seed: './prisma/seed.ts',
    },

    datasource: {
        url: env('DATABASE_URL'),   // used by prisma migrate / studio / generate
    },
});

