import { PrismaClient } from '@prisma/client';

export type SerialIdPrefix =
    | 'USR'
    | 'CMP'
    | 'AST'
    | 'LED'
    | 'AGT'
    | 'FRL'
    | 'CLT'
    | 'TRN'
    | 'IPL'
    | 'INS'
    | 'COM';

const MODEL_MAP: Record<SerialIdPrefix, keyof PrismaClient> = {
    USR: 'user',
    CMP: 'company',
    AST: 'asset',
    LED: 'lead',
    AGT: 'agent',
    FRL: 'freelancer',
    CLT: 'cluster',
    TRN: 'transaction',
    IPL: 'installmentPlan',
    INS: 'installment',
    COM: 'commission',
};

/**
 * Generates the next human-readable serial ID for an entity.
 * Format: BO-{PREFIX}-{0001}
 *
 * NOTE: Uses count-based generation. For high-concurrency scenarios,
 * consider a dedicated sequence table.
 */
export async function generateSerialId(
    prisma: any,
    prefix: SerialIdPrefix,
): Promise<string> {
    const model = MODEL_MAP[prefix];
    const count: number = await prisma[model].count();
    const serial = String(count + 1).padStart(4, '0');
    return `BO-${prefix}-${serial}`;
}
