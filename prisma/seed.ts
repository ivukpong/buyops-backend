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
    
    // Delete in correct order to respect foreign key constraints
    // await prisma.notification.deleteMany(); // Removed: notification model does not exist
    await prisma.investment.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.product.deleteMany();
    await prisma.installment.deleteMany();
    await prisma.installmentPlan.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.freelancer.deleteMany();
    await prisma.agent.deleteMany();
    await prisma.user.deleteMany();
    await prisma.cluster.deleteMany();
    await prisma.company.deleteMany();
    
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
                availableUnits: 100,
                propertyCategory: 'Apartment',
                basePrice: 85_000_000,
                markup: 15,
                finalPrice: 85_000_000 * 1.15,
                riskLevel: 'Medium',
                status: 'Completed',
                exitLiquidity: 'Secondary Market',
                managementMode: 'Self-Managed',
                leadCommission: 2.5,
                closerCommission: 1.5,
                images: [faker.image.urlPicsumPhotos({ width: 800, height: 600 })],
                documents: [faker.system.fileName()],
                facilities: [faker.commerce.productAdjective() + ' Pool'],
                paymentOptions: ['Full Payment', 'Installment'],
                bedrooms: 3,
                bathrooms: 3,
                area: '250 sqm',
                furnishing: 'Furnished',
                rentalYield: 7.5,
                monthlyRentalIncome: 1200000,
                totalAnnualReturn: 12.2,
                capitalAppreciation: 8.1,
                firstPayoutDate: faker.date.future(),
                landSize: '500 sqm',
                builtSize: '250 sqm',
                constructionStart: faker.date.past(),
                constructionEnd: faker.date.future(),
                unitConfiguration: '3 Bedroom',
                furnishingStatus: 'Furnished',
                sharedFacilities: ['Pool', 'Gym'],
                facilityManagement: true,
                ownershipType: 'Full',
                fractionTotal: 10,
                costPerFraction: 8500000,
                installmentPeriods: ['6 months', '12 months'],
                downPaymentAmount: 8500000,
                offPlanDiscount: 2.5,
                stageBasedDiscount: 1.5,
                projectedRentalIncome: 1300000,
                rentalFrequency: 'Monthly',
                operatingCost: 50000,
                constructionStage: 'Foundation',
                offPlanSecurity: 'Bank Guarantee',
                featured: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                // UI fields
                soldFractions: 5,
                totalFractions: 10,
                discount: 5,
                price: 90000000,
                minFraction: 1,
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
                availableUnits: 50,
                propertyCategory: 'Villa',
                basePrice: 145_000_000,
                markup: 12,
                finalPrice: 145_000_000 * 1.12,
                riskLevel: 'Low',
                status: 'Under Development',
                exitLiquidity: 'Direct Sale',
                managementMode: 'Professional Manager',
                leadCommission: 2.0,
                closerCommission: 1.0,
                images: [faker.image.urlPicsumPhotos({ width: 800, height: 600 })],
                documents: [faker.system.fileName()],
                facilities: [faker.commerce.productAdjective() + ' Gym'],
                paymentOptions: ['Full Payment', 'Installment'],
                bedrooms: 5,
                bathrooms: 4,
                area: '400 sqm',
                furnishing: 'Semi-Furnished',
                rentalYield: 6.2,
                monthlyRentalIncome: 1800000,
                totalAnnualReturn: 10.5,
                capitalAppreciation: 6.8,
                firstPayoutDate: faker.date.future(),
                landSize: '800 sqm',
                builtSize: '400 sqm',
                constructionStart: faker.date.past(),
                constructionEnd: faker.date.past(),
                unitConfiguration: '5 Bedroom',
                furnishingStatus: 'Semi-Furnished',
                sharedFacilities: ['Gym', 'Garden'],
                facilityManagement: true,
                ownershipType: 'Full',
                fractionTotal: 8,
                costPerFraction: 18125000,
                installmentPeriods: ['12 months', '24 months'],
                downPaymentAmount: 14500000,
                offPlanDiscount: 1.0,
                stageBasedDiscount: 0.5,
                projectedRentalIncome: 2000000,
                rentalFrequency: 'Monthly',
                operatingCost: 80000,
                constructionStage: 'Completed',
                offPlanSecurity: 'Insurance',
                featured: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                // UI fields
                soldFractions: 3,
                totalFractions: 8,
                discount: 10,
                price: 160000000,
                minFraction: 1,
              },
        ].map(async (data) => {
            return prisma.asset.create({
                data,
            });
        })
    );
    console.log(`✅ Assets created: ${assets.length}`);

    // ─── Test Investor (with known credentials) ───────────
    const testInvestor = await prisma.user.create({
        data: {
            email: 'investor@buyops.com',
            password: agentPasswordHash, // Password: Agent@123
            name: 'Test Investor',
            role: 'INVESTOR',
            phone: '+2348011111111',
        },
    });
    console.log(`✅ Test Investor created: ${testInvestor.email} (Password: Agent@123)`);

    // ─── Regular Users (Investors) ─────────────
    const investors = [testInvestor]; // Include test investor
    for (let i = 0; i < 15; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

        const user = await prisma.user.create({
            data: {
                email,
                password: agentPasswordHash,
                name: `${firstName} ${lastName}`,
                role: 'INVESTOR',
                phone: faker.phone.number(),
            },
        });
        investors.push(user);
    }
    console.log(`✅ Investor users created: ${investors.length}`);

    // ─── Transactions + Installments ───────────
    const sellers = agents; // only agents can be lead/closer
    const transactionsCreated = [];
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

        // Pick a buyer (User) from investors
        const buyer = faker.helpers.arrayElement(investors);

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
                date: faker.date.between({ from: new Date('2025-04-01'), to: new Date() }),
                buyerId: buyer.id,
            },
        });
        transactionsCreated.push(tx);

        // 65% chance of InstallmentPlan
        if (Math.random() > 0.35) {
            const numberOfInstallments = faker.number.int({ min: 6, max: 18 });
            const installmentAmount = salePrice / numberOfInstallments;
            const downPayment = faker.number.float({ min: salePrice * 0.1, max: salePrice * 0.3 });
            const remainingBalance = salePrice - downPayment;
            const paidInstallments = faker.number.int({ min: 0, max: Math.floor(numberOfInstallments * 0.6) });
            const paidAmount = downPayment + (paidInstallments * installmentAmount);

            const plan = await prisma.installmentPlan.create({
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
                    paidAmount,
                    completedInstallments: paidInstallments,
                    frequency: 'monthly',
                    status: paidInstallments >= numberOfInstallments ? 'completed' : paidInstallments > 0 ? 'active' : 'overdue',
                    startDate: tx.date,
                    nextDueDate: faker.date.future({ refDate: tx.date }),
                },
            });

            // Create individual Installment records
            const startDate = new Date(tx.date);
            for (let j = 0; j < numberOfInstallments; j++) {
                const dueDate = new Date(startDate);
                dueDate.setMonth(dueDate.getMonth() + j + 1);
                
                const isPaid = j < paidInstallments;
                const now = new Date();
                
                await prisma.installment.create({
                    data: {
                        installmentPlanId: plan.id,
                        dueDate,
                        amount: installmentAmount,
                        paidAmount: isPaid ? installmentAmount : 0,
                        status: isPaid ? 'paid' : j === paidInstallments ? 'upcoming' : 'upcoming',
                        paidDate: isPaid && dueDate < now ? faker.date.between({ from: dueDate, to: now }) : null,
                        paymentMethod: isPaid ? faker.helpers.arrayElement(['Bank Transfer', 'Card', 'Cash']) : null,
                    },
                });
            }
        }
    }
    console.log(`✅ Transactions created: ${transactionsCreated.length}`);

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

    // ─── Investments ───────────────────────────
    const investments = [];
    for (const investor of investors.slice(0, 10)) {
        const numInvestments = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < numInvestments; i++) {
            const investment = await prisma.investment.create({
                data: {
                    userId: investor.id,
                    amount: faker.number.float({ min: 10_000_000, max: 150_000_000, fractionDigits: 2 }),
                    note: faker.helpers.arrayElement([
                        'Initial investment in property portfolio',
                        'Additional investment for expansion',
                        'Diversification investment',
                        'Long-term growth',
                        'Short-term gain',
                        'Retirement plan',
                    ]),
                    createdAt: faker.date.past(),
                    updatedAt: new Date(),
                },
            });
            investments.push(investment);
        }
    }
    console.log(`✅ Investments created: ${investments.length}`);

    // ─── Products ──────────────────────────────
    const products = await Promise.all(
        [
            {
                name: 'Property Management Package - Basic',
                description: 'Basic property management services including tenant screening and rent collection',
                price: 50000,
            },
            {
                name: 'Property Management Package - Premium',
                description: 'Full property management with maintenance, tenant relations, and financial reporting',
                price: 120000,
            },
            {
                name: 'Legal Documentation Service',
                description: 'Complete legal documentation for property transactions',
                price: 75000,
            },
            {
                name: 'Property Valuation Report',
                description: 'Professional property valuation and market analysis',
                price: 35000,
            },
        ].map((data) => prisma.product.create({ data }))
    );
    console.log(`✅ Products created: ${products.length}`);

    // ─── Sales ─────────────────────────────────
    const sales = [];
    for (let i = 0; i < 25; i++) {
        const product = faker.helpers.arrayElement(products);
        const user = faker.helpers.arrayElement([...investors, admin]);
        const quantity = faker.number.int({ min: 1, max: 5 });
        
        const sale = await prisma.sale.create({
            data: {
                userId: user.id,
                productId: product.id,
                quantity,
                total: (product.price || 0) * quantity,
            },
        });
        sales.push(sale);
    }
    console.log(`✅ Sales created: ${sales.length}`);

    // ─── Notifications seeding skipped: notification model does not exist in schema ──

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
