"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const dotenv = __importStar(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const adapter_pg_1 = require("@prisma/adapter-pg");
dotenv.config({ path: '.env' });
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Make sure .env exists.');
}
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({
    adapter
});
async function main() {
    console.log('🌱 Starting database seeding...');
    const SALT_ROUNDS = 10;
    const ADMIN_PASSWORD = 'Admin@123';
    const AGENT_PASSWORD = 'Agent@123';
    const [adminPasswordHash, agentPasswordHash] = await Promise.all([
        bcryptjs_1.default.hash(ADMIN_PASSWORD, SALT_ROUNDS),
        bcryptjs_1.default.hash(AGENT_PASSWORD, SALT_ROUNDS),
    ]);
    console.log('🧹 Clearing existing data...');
    await prisma.$transaction([
        prisma.installment.deleteMany(),
        prisma.installmentPlan.deleteMany(),
        prisma.transaction.deleteMany(),
        prisma.lead.deleteMany(),
        prisma.asset.deleteMany(),
        prisma.freelancer.deleteMany(),
        prisma.agent.deleteMany(),
        prisma.user.deleteMany(),
        prisma.cluster.deleteMany(),
        prisma.company.deleteMany(),
    ]);
    console.log('🧹 Database cleared');
    const admin = await prisma.user.create({
        data: {
            email: 'admin@buyops.com',
            password: adminPasswordHash,
            name: 'BuyOps Super Admin',
            role: 'ADMIN',
            phone: '+2348000000000',
        },
    });
    console.log(`✅ Admin created: ${admin.email}`);
    const companies = await Promise.all([
        {
            name: 'Luxury Estates Ltd',
            type: 'Developer',
            registrationNumber: 'RC-1234567',
            contactPerson: 'Aisha Ibrahim',
            email: 'info@luxuryestates.ng',
            phone: '+2348012345678',
            address: 'Plot 45, Victoria Island, Lagos',
            agreementStartDate: new Date('2024-01-01'),
            agreementExpiryDate: new Date('2027-12-31'),
            commissionRate: 5.5,
            paymentTerms: '30 days after closing',
            bankName: 'GTBank',
            accountName: 'Luxury Estates Ltd',
            accountNumber: '0123456789',
            status: 'active',
        },
        {
            name: 'Abuja Prime Investments',
            type: 'Investment Platform',
            registrationNumber: 'RC-9876543',
            contactPerson: 'Chinedu Okeke',
            email: 'contact@abujaprime.com',
            phone: '+2348098765432',
            address: 'Maitama, Abuja',
            agreementStartDate: new Date('2025-03-01'),
            agreementExpiryDate: new Date('2028-02-28'),
            commissionRate: 4.0,
            paymentTerms: 'Net 45',
            bankName: 'Zenith Bank',
            accountName: 'Abuja Prime Investments',
            accountNumber: '9876543210',
            status: 'active',
        },
    ].map((data) => prisma.company.create({ data })));
    console.log(`✅ Companies created: ${companies.length}`);
    const clusters = await Promise.all([
        {
            name: 'Lagos Island Elite',
            code: 'LAG-ELITE',
            teamLead: 'Tunde Adebayo',
            location: 'Lagos Island',
            status: 'active',
        },
        {
            name: 'Abuja High-End',
            code: 'ABJ-PREMIUM',
            teamLead: 'Fatima Yusuf',
            location: 'Abuja',
            status: 'active',
        },
    ].map((data) => prisma.cluster.create({ data })));
    console.log(`✅ Clusters created: ${clusters.length}`);
    const agents = [];
    for (let i = 0; i < 8; i++) {
        const firstName = faker_1.faker.person.firstName();
        const lastName = faker_1.faker.person.lastName();
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@buyops.ng`;
        const user = await prisma.user.create({
            data: {
                email,
                password: agentPasswordHash,
                name: `${firstName} ${lastName}`,
                role: 'AGENT',
                phone: faker_1.faker.phone.number(),
            },
        });
        const agent = await prisma.agent.create({
            data: {
                userId: user.id,
                clusterId: clusters[i % clusters.length].id,
                role: i % 3 === 0 ? 'Senior Agent' : 'Agent',
                status: 'active',
                totalCommission: faker_1.faker.number.float({ min: 450000, max: 6200000, fractionDigits: 2 }),
                closedDeals: faker_1.faker.number.int({ min: 3, max: 24 }),
            },
        });
        agents.push(agent);
    }
    const freelancers = [];
    for (let i = 0; i < 5; i++) {
        const firstName = faker_1.faker.person.firstName();
        const lastName = faker_1.faker.person.lastName();
        const email = `freelance.${firstName.toLowerCase()}@buyops.ng`;
        const user = await prisma.user.create({
            data: {
                email,
                password: agentPasswordHash,
                name: `${firstName} ${lastName} (Freelance)`,
                role: 'FREELANCER',
                phone: faker_1.faker.phone.number(),
            },
        });
        const freelancer = await prisma.freelancer.create({
            data: {
                userId: user.id,
                clusterId: clusters[i % clusters.length].id,
                registeredBy: admin.id,
                registrarName: 'System Admin',
                registrarType: 'ADMIN',
                status: 'active',
                totalCommission: faker_1.faker.number.float({ min: 280000, max: 3800000, fractionDigits: 2 }),
                closedDeals: faker_1.faker.number.int({ min: 2, max: 15 }),
            },
        });
        freelancers.push(freelancer);
    }
    console.log(`✅ Agents: ${agents.length} | Freelancers: ${freelancers.length}`);
    const assets = await Promise.all([
        {
            name: 'Eko Atlantic Luxury Apartments',
            referenceCode: 'EA-LUX-001',
            type: 'Residential',
            projectStatus: 'Off-Plan',
            location: 'Victoria Island',
            address: 'Eko Atlantic City, Lagos',
            companyId: companies[0].id,
            totalUnits: 120,
            propertyCategory: 'Apartment',
            basePrice: 85000000,
            markup: 15,
            riskLevel: 'Medium',
            status: 'published',
            exitLiquidity: 'Secondary Market',
            managementMode: 'Self-Managed',
            leadCommission: 2.5,
            closerCommission: 1.5,
        },
        {
            name: 'Maitama Heights',
            referenceCode: 'MH-RES-002',
            type: 'Residential',
            projectStatus: 'Completed',
            location: 'Maitama',
            address: 'Maitama District, Abuja',
            companyId: companies[1].id,
            totalUnits: 68,
            propertyCategory: 'Villa',
            basePrice: 145000000,
            markup: 12,
            riskLevel: 'Low',
            status: 'published',
            exitLiquidity: 'Direct Sale',
            managementMode: 'Professional Manager',
            leadCommission: 2.0,
            closerCommission: 1.0,
        },
    ].map(async (data) => {
        const sold = faker_1.faker.number.int({ min: 8, max: 35 });
        return prisma.asset.create({
            data: {
                ...data,
                finalPrice: data.basePrice * (1 + data.markup / 100),
                availableUnits: data.totalUnits - sold,
            },
        });
    }));
    console.log(`✅ Assets created: ${assets.length}`);
    const sellers = agents;
    for (let i = 0; i < 35; i++) {
        const asset = faker_1.faker.helpers.arrayElement(assets);
        const seller = faker_1.faker.helpers.arrayElement(sellers);
        const salePrice = faker_1.faker.number.float({
            min: asset.basePrice * 0.95,
            max: asset.finalPrice * 1.08,
            fractionDigits: 2,
        });
        const leadCommission = salePrice * 0.025;
        const totalCommission = salePrice * 0.04;
        const buyer = await prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                password: agentPasswordHash,
                name: faker_1.faker.person.fullName(),
            },
        });
        const tx = await prisma.transaction.create({
            data: {
                assetId: asset.id,
                leadAgentId: seller.id,
                closerAgentId: seller.id,
                companyId: asset.companyId,
                amount: salePrice,
                totalCommission,
                leadCommission,
                paymentType: 'CASH',
                status: 'completed',
                date: faker_1.faker.date.between({ from: new Date('2025-04-01'), to: new Date() }),
                buyerId: buyer.id,
            },
        });
        if (Math.random() > 0.35) {
            const numberOfInstallments = faker_1.faker.number.int({ min: 6, max: 18 });
            const installmentAmount = salePrice / numberOfInstallments;
            const downPayment = faker_1.faker.number.float({ min: salePrice * 0.1, max: salePrice * 0.3 });
            const remainingBalance = salePrice - downPayment;
            await prisma.installmentPlan.create({
                data: {
                    transactionId: tx.id,
                    assetId: tx.assetId,
                    companyId: tx.companyId,
                    leadAgentId: tx.leadAgentId,
                    closerAgentId: tx.closerAgentId,
                    buyerName: buyer.name || '',
                    buyerEmail: buyer.email,
                    buyerPhone: buyer.phone || '',
                    totalAmount: salePrice,
                    downPayment,
                    remainingBalance,
                    installmentAmount,
                    numberOfInstallments,
                    paidAmount: faker_1.faker.number.float({ min: downPayment, max: salePrice }),
                    frequency: 'monthly',
                    status: faker_1.faker.helpers.arrayElement(['active', 'completed', 'overdue']),
                    startDate: tx.date,
                    nextDueDate: faker_1.faker.date.future({ refDate: tx.date }),
                },
            });
        }
    }
    for (let i = 0; i < 18; i++) {
        await prisma.lead.create({
            data: {
                name: faker_1.faker.person.fullName(),
                email: faker_1.faker.internet.email(),
                phone: faker_1.faker.phone.number(),
                assetInterest: faker_1.faker.helpers.arrayElement(assets).name,
                budget: faker_1.faker.number.float({ min: 40000000, max: 320000000 }),
                source: faker_1.faker.helpers.arrayElement(['Website', 'Instagram', 'Referral', 'Google Ads', 'Event']),
                leadSource: faker_1.faker.helpers.arrayElement(['Organic', 'Paid', 'Partner']),
                status: faker_1.faker.helpers.arrayElement(['pending', 'assigned', 'qualified', 'lost']),
                assignedCluster: faker_1.faker.helpers.arrayElement(clusters).id,
            },
        });
    }
    console.log('✅ Leads created: 18');
    console.log('🎉 Database seeding completed successfully!');
}
main()
    .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map