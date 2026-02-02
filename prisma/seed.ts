import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL is missing!');
  process.exit(1);
}
console.log('DEBUG: Using (masked):', connectionString.replace(/:.*@/, ':****@'));

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const NOW = new Date();

async function main() {
  // USERS
  const password = await bcrypt.hash('TestPass2026!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@buyops.com' },
    update: {},
    create: { email: 'admin@buyops.com', password, name: 'Iniobong Admin', role: 'ADMIN' },
  });
  const agentUser = await prisma.user.upsert({
    where: { email: 'agent1@buyops.com' },
    update: {},
    create: { email: 'agent1@buyops.com', password, name: 'Chinedu Okeke', role: 'AGENT' },
  });
  const freelancerUser = await prisma.user.upsert({
    where: { email: 'freelancer1@buyops.com' },
    update: {},
    create: { email: 'freelancer1@buyops.com', password, name: 'Grace Freelance', role: 'FREELANCER' },
  });
  const investor1 = await prisma.user.upsert({
    where: { email: 'customer1@buyops.com' },
    update: {},
    create: { email: 'customer1@buyops.com', password, name: 'Fatima Ibrahim', role: 'INVESTOR' },
  });
  const investor2 = await prisma.user.upsert({
    where: { email: 'customer2@buyops.com' },
    update: {},
    create: { email: 'customer2@buyops.com', password, name: 'Tunde Adebayo', role: 'INVESTOR' },
  });

  // CLUSTERS
  const cluster = await prisma.cluster.upsert({
    where: { name: 'Lagos Sales Team' },
    update: {},
    create: {
      name: 'Lagos Sales Team',
      code: 'LAG-SALES',
      status: 'active',
      location: 'Lagos',
      managerId: admin.id,
    },
  });

  // AGENT PROFILE
  const agent = await prisma.agent.upsert({
    where: { userId: agentUser.id },
    update: {},
    create: {
      userId: agentUser.id,
      clusterId: cluster.id,
      status: 'ACTIVE',
      closedDeals: 2,
      totalCommission: 2000000,
    },
  });

  // FREELANCER PROFILE
  const freelancer = await prisma.freelancer.upsert({
    where: { userId: freelancerUser.id },
    update: {},
    create: {
      userId: freelancerUser.id,
      clusterId: cluster.id,
      status: 'ACTIVE',
      activeDeals: 1,
      closedDeals: 1,
      totalCommission: 500000,
      registeredBy: admin.id,
      registrarName: admin.name,
      registrarType: 'ADMIN',
    },
  });

  // COMPANIES
  const elara = await prisma.company.upsert({
    where: { name: 'Elara Gardens Ltd' },
    update: {},
    create: {
      name: 'Elara Gardens Ltd',
      type: 'DEVELOPER',
      registrationNumber: 'RC-1987654',
      status: 'ACTIVE',
      contactPerson: 'Iniobong Admin',
      email: 'info@elara.ng',
      phone: '+2348091112233',
      address: 'Plot 17, Admiralty Way, Lekki Phase 1',
      agreementStartDate: new Date('2026-01-01'),
      agreementExpiryDate: new Date('2027-01-01'),
      commissionRate: 5.5,
      paymentTerms: 'Full payment within 30 days',
      accountName: 'Elara Gardens Ltd',
      bankName: 'GTBank',
      accountNumber: '0123456789',
      notes: 'Preferred developer partner',
    },
  });
  const primevest = await prisma.company.upsert({
    where: { name: 'Primevest Properties' },
    update: {},
    create: {
      name: 'Primevest Properties',
      type: 'REALTOR',
      registrationNumber: 'RC-1234567',
      status: 'ACTIVE',
      contactPerson: 'Aisha Sales Lead',
      email: 'contact@primevest.ng',
      phone: '+2348039998877',
      address: 'Maitama, Abuja',
      agreementStartDate: new Date('2026-02-01'),
      agreementExpiryDate: new Date('2027-02-01'),
      commissionRate: 4.0,
      paymentTerms: 'Installment allowed',
      accountName: 'Primevest Properties',
      bankName: 'Access Bank',
      accountNumber: '9876543210',
      notes: 'Top Abuja realtor',
    },
  });

  // ASSETS
  const asset1 = await prisma.asset.upsert({
    where: { name: 'Elara Pearl Duplexes' },
    update: {},
    create: {
      name: 'Elara Pearl Duplexes',
      companyId: elara.id,
      type: 'DUPLEX',
      status: 'published',
      basePrice: 145_000_000,
      finalPrice: 145_000_000,
      location: 'Lekki Phase 1',
      bedrooms: 4,
      bathrooms: 4,
      area: 350,
      description: 'Luxury 4-bedroom duplexes in Lekki.',
      totalUnits: 10,
      availableUnits: 8,
      projectedRentalIncome: 6000000,
      rentalYieldMin: 3.5,
      rentalYieldMax: 5.2,
      capitalAppreciation: 7.5,
      capitalAppreciationMin: 5.0,
      capitalAppreciationMax: 10.0,
      totalReturnsMin: 8.5,
      totalReturnsMax: 15.2,
      riskLevel: 'Low',
      riskFactors: ['Market', 'Liquidity'],
    },
  });
  const asset2 = await prisma.asset.upsert({
    where: { name: 'Primeview Terraces' },
    update: {},
    create: {
      name: 'Primeview Terraces',
      companyId: primevest.id,
      type: 'TERRACE',
      status: 'published',
      basePrice: 120_000_000,
      finalPrice: 120_000_000,
      location: 'Maitama, Abuja',
      bedrooms: 3,
      bathrooms: 3,
      area: 250,
      description: 'Modern 3-bedroom terraces in Maitama.',
      totalUnits: 6,
      availableUnits: 4,
      projectedRentalIncome: 4000000,
      rentalYieldMin: 2.8,
      rentalYieldMax: 4.5,
      capitalAppreciation: 6.0,
      capitalAppreciationMin: 4.0,
      capitalAppreciationMax: 8.0,
      totalReturnsMin: 6.8,
      totalReturnsMax: 12.5,
      riskLevel: 'Medium',
      riskFactors: ['Market'],
    },
  });

  // ASSET IMAGES
  await prisma.assetImage.createMany({
    data: [
      { assetId: asset1.id, url: 'https://example.com/duplex1.jpg', caption: 'Front View', order: 1 },
      { assetId: asset1.id, url: 'https://example.com/duplex2.jpg', caption: 'Living Room', order: 2 },
      { assetId: asset2.id, url: 'https://example.com/terrace1.jpg', caption: 'Terrace View', order: 1 },
    ],
    skipDuplicates: true,
  });

  // ASSET DOCUMENTS
  await prisma.assetDocument.createMany({
    data: [
      { assetId: asset1.id, url: 'https://example.com/title-deed.pdf', title: 'Title Deed', type: 'PDF' },
      { assetId: asset2.id, url: 'https://example.com/layout-plan.pdf', title: 'Layout Plan', type: 'PDF' },
    ],
    skipDuplicates: true,
  });

  // INSTALLMENT PLANS
  const plan1 = await prisma.installmentPlan.create({
    data: {
      assetId: asset1.id,
      companyId: elara.id,
      totalAmount: 145_000_000,
      downPayment: 43_500_000,
      remainingBalance: 101_500_000,
      paidAmount: 0,
      numberOfInstallments: 18,
      completedInstallments: 0,
      installmentAmount: 101_500_000 / 18,
      frequency: 'monthly',
      startDate: NOW,
      nextDueDate: new Date(NOW.getTime() + 30 * 24 * 60 * 60 * 1000),
      leadAgentId: agent.id,
      status: 'active',
    },
  });

  // TRANSACTIONS
  const transaction1 = await prisma.transaction.create({
    data: {
      assetId: asset1.id,
      buyerId: investor1.id,
      totalAmount: 145_000_000,
      commission: 145_000_000 * 0.055,
      totalCommission: 145_000_000 * 0.055,
      earnedTotalCommission: 0,
      leadCommission: 2_000_000,
      closerCommission: 2_975_000,
      status: 'COMPLETED',
      commissionPaymentStatus: 'UNPAID',
      date: NOW,
      leadAgentId: agent.id,
      companyId: elara.id,
    },
  });

  // INSTALLMENTS
  await prisma.installment.createMany({
    data: [
      {
        transactionId: transaction1.id,
        installmentPlanId: plan1.id,
        dueDate: new Date(NOW.getTime() + 30 * 24 * 60 * 60 * 1000),
        amount: transaction1.totalAmount / 18,
        paidAmount: 0,
        status: 'PENDING',
      },
      {
        transactionId: transaction1.id,
        installmentPlanId: plan1.id,
        dueDate: new Date(NOW.getTime() + 60 * 24 * 60 * 60 * 1000),
        amount: transaction1.totalAmount / 18,
        paidAmount: 0,
        status: 'PENDING',
      },
    ],
    skipDuplicates: true,
  });

  // LEADS
  await prisma.lead.createMany({
    data: [
      {
        name: 'Mohammed Yusuf',
        email: 'mohd.yusuf@gmail.com',
        phone: '+2348123456789',
        source: 'Instagram Ad',
        status: 'NEW',
        budget: 120_000_000,
        location: 'Lekki / Ikoyi',
        assetInterest: asset1.id,
        assignedToId: agent.id,
        dateReceived: NOW,
        createdById: admin.id,
      },
      {
        name: 'Ngozi Okafor',
        email: 'ngozi.okafor@gmail.com',
        phone: '+2348098765432',
        source: 'Referral',
        status: 'CONTACTED',
        budget: 100_000_000,
        location: 'Abuja',
        assetInterest: asset2.id,
        assignedToId: agent.id,
        dateReceived: NOW,
        createdById: admin.id,
      },
    ],
    skipDuplicates: true,
  });

  // COMMISSIONS
  await prisma.commission.createMany({
    data: [
      {
        transactionId: transaction1.id,
        agentId: agent.id,
        amount: 145_000_000 * 0.055,
        rate: 5.5,
        status: 'UNPAID',
      },
    ],
    skipDuplicates: true,
  });

  // SAVED PROPERTIES
  await prisma.savedProperty.createMany({
    data: [
      {
        userId: investor2.id,
        assetId: asset2.id,
        assetName: asset2.name,
        amount: 120_000_000,
        read: false,
        timestamp: NOW,
      },
    ],
    skipDuplicates: true,
  });

  // NOTIFICATIONS
  await prisma.notification.createMany({
    data: [
      {
        userId: investor1.id,
        title: 'Welcome to BuyOps!',
        message: 'Your purchase of Elara Pearl Duplex is now in progress. Next payment due in 30 days.',
        type: 'SUCCESS',
        read: false,
      },
      {
        userId: agentUser.id,
        title: 'New Lead Assigned',
        message: 'You have been assigned a new lead: Mohammed Yusuf.',
        type: 'INFO',
        read: false,
      },
    ],
    skipDuplicates: true,
  });

  console.log('\n✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });