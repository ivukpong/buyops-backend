// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Make sure .env exists.');
}


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({
    adapter
});


async function main() {
    console.log('🌱 Starting database seeding...');

    const SALT_ROUNDS = 10;
    const ADMIN_PASSWORD = 'Admin@123';
    const AGENT_PASSWORD = 'Agent@123';

    const [adminPasswordHash, agentPasswordHash] = await Promise.all([
        bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS),
        bcrypt.hash(AGENT_PASSWORD, SALT_ROUNDS),
    ]);

    // ─── Clear existing data ─────────────────────
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

    // ─── Admin user ─────────────────────────────
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

    // ─── Companies ──────────────────────────────
    const companies = await Promise.all(
        [
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
        ].map((data) => prisma.company.create({ data }))
    );
    console.log(`✅ Companies created: ${companies.length}`);

    // ─── Clusters ───────────────────────────────
    const clusters = await Promise.all(
        [
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
        ].map((data) => prisma.cluster.create({ data }))
    );
    console.log(`✅ Clusters created: ${clusters.length}`);

    // ─── Agents ────────────────────────────────
    const agents = [];
    for (let i = 0; i < 8; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@buyops.ng`;

        const user = await prisma.user.create({
            data: {
                email,
                password: agentPasswordHash,
                name: `${firstName} ${lastName}`,
                role: 'AGENT',
                phone: faker.phone.number(),
            },
        });

        const agent = await prisma.agent.create({
            data: {
                userId: user.id,
                clusterId: clusters[i % clusters.length].id,
                role: i % 3 === 0 ? 'Senior Agent' : 'Agent',
                status: 'active',
                totalCommission: faker.number.float({ min: 450_000, max: 6_200_000, fractionDigits: 2 }),
                closedDeals: faker.number.int({ min: 3, max: 24 }),
            },
        });
        agents.push(agent);
    }

    // ─── Freelancers ───────────────────────────
    const freelancers = [];
    for (let i = 0; i < 5; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = `freelance.${firstName.toLowerCase()}@buyops.ng`;

        const user = await prisma.user.create({
            data: {
                email,
                password: agentPasswordHash,
                name: `${firstName} ${lastName} (Freelance)`,
                role: 'FREELANCER',
                phone: faker.phone.number(),
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
                totalCommission: faker.number.float({ min: 280_000, max: 3_800_000, fractionDigits: 2 }),
                closedDeals: faker.number.int({ min: 2, max: 15 }),
            },
        });
        freelancers.push(freelancer);
    }
    console.log(`✅ Agents: ${agents.length} | Freelancers: ${freelancers.length}`);

    // ─── Assets ────────────────────────────────
    const assets = await Promise.all(
        [
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
                basePrice: 85_000_000,
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
                basePrice: 145_000_000,
                markup: 12,
                riskLevel: 'Low',
                status: 'published',
                exitLiquidity: 'Direct Sale',
                managementMode: 'Professional Manager',
                leadCommission: 2.0,
                closerCommission: 1.0,
            },
        ].map(async (data) => {
            const sold = faker.number.int({ min: 8, max: 35 });
            return prisma.asset.create({
                data: {
                    ...data,
                    finalPrice: data.basePrice * (1 + data.markup / 100),
                    availableUnits: data.totalUnits - sold,
                },
            });
        })
    );
    console.log(`✅ Assets created: ${assets.length}`);

    // ─── Transactions + Installments ───────────
    const sellers = agents; // only agents can be lead/closer
    for (let i = 0; i < 35; i++) {
        const asset = faker.helpers.arrayElement(assets);
        const seller = faker.helpers.arrayElement(sellers);

        const salePrice = faker.number.float({
            min: asset.basePrice * 0.95,
            max: asset.finalPrice * 1.08,
            fractionDigits: 2,
        });

        const leadCommission = salePrice * 0.025;
        const totalCommission = salePrice * 0.04;

        // Pick a buyer (User)
        const buyer = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: agentPasswordHash,
                name: faker.person.fullName(),
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
                paymentType: 'CASH', // required
                status: 'completed',
                date: faker.date.between({ from: new Date('2025-04-01'), to: new Date() }),
                buyerId: buyer.id, // ✅ required field
            },
        });


        // 65% chance of InstallmentPlan
        if (Math.random() > 0.35) {
            const numberOfInstallments = faker.number.int({ min: 6, max: 18 });
            const installmentAmount = salePrice / numberOfInstallments;
            const downPayment = faker.number.float({ min: salePrice * 0.1, max: salePrice * 0.3 });
            const remainingBalance = salePrice - downPayment;

            await prisma.installmentPlan.create({
                data: {
                    transactionId: tx.id,
                    assetId: tx.assetId,          // required
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
                    paidAmount: faker.number.float({ min: downPayment, max: salePrice }),
                    frequency: 'monthly',         // required
                    status: faker.helpers.arrayElement(['active', 'completed', 'overdue']),
                    startDate: tx.date,
                    nextDueDate: faker.date.future({ refDate: tx.date }),
                },
            });
        }


    }

    // ─── Leads ──────────────────────────────────
    for (let i = 0; i < 18; i++) {
        await prisma.lead.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: faker.phone.number(),
                assetInterest: faker.helpers.arrayElement(assets).name,
                budget: faker.number.float({ min: 40_000_000, max: 320_000_000 }),
                source: faker.helpers.arrayElement(['Website', 'Instagram', 'Referral', 'Google Ads', 'Event']),
                leadSource: faker.helpers.arrayElement(['Organic', 'Paid', 'Partner']),
                status: faker.helpers.arrayElement(['pending', 'assigned', 'qualified', 'lost']),
                assignedCluster: faker.helpers.arrayElement(clusters).id,
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
