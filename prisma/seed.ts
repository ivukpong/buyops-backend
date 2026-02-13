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
  console.log('🧹 Clearing database...');

  // Delete in reverse dependency order (child tables first)
  await prisma.savedProperty.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.commission.deleteMany({});
  await prisma.installment.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.installmentPlan.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.assetDocument.deleteMany({});
  await prisma.assetImage.deleteMany({});
  await prisma.asset.deleteMany({});
  await prisma.freelancer.deleteMany({});
  await prisma.agent.deleteMany({});
  await prisma.cluster.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ Database cleared!\n');
  console.log('🌱 Seeding database...\n');

  // USERS
  const password = await bcrypt.hash('TestPass2026!', 10);
  const admin = await prisma.user.create({
    data: { email: 'admin@buyops.com', password, name: 'Iniobong Admin', role: 'ADMIN' },
  });
  const teamLeadUser = await prisma.user.create({
    data: { email: 'teamlead1@buyops.com', password, name: 'Ada TeamLead', role: 'TEAM_LEAD' },
  });
  const agentUser = await prisma.user.create({
    data: { email: 'agent1@buyops.com', password, name: 'Chinedu Okeke', role: 'AGENT' },
  });
  const freelancerUser = await prisma.user.create({
    data: { email: 'freelancer1@buyops.com', password, name: 'Grace Freelance', role: 'FREELANCER' },
  });
  const investor1 = await prisma.user.create({
    data: { email: 'customer1@buyops.com', password, name: 'Fatima Ibrahim', role: 'INVESTOR' },
  });
  const investor2 = await prisma.user.create({
    data: { email: 'customer2@buyops.com', password, name: 'Tunde Adebayo', role: 'INVESTOR' },
  });

  // CLUSTERS
  const cluster = await prisma.cluster.create({
    data: {
      name: 'Lagos Sales Team',
      code: 'LAG-SALES',
      status: 'active',
      location: 'Lagos',
      managerId: teamLeadUser.id,
    },
  });

  // AGENT PROFILE
  const agent = await prisma.agent.create({
    data: {
      userId: agentUser.id,
      clusterId: cluster.id,
      status: 'ACTIVE',
      closedDeals: 2,
      totalCommission: 2000000,
    },
  });

  // FREELANCER PROFILE
  const freelancer = await prisma.freelancer.create({
    data: {
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
  const elara = await prisma.company.create({
    data: {
      name: 'Elara Gardens Ltd',
      type: 'developer',
      registrationNumber: 'RC-1987654',
      status: 'active',
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
  const primevest = await prisma.company.create({
    data: {
      name: 'Primevest Properties',
      type: 'realtor',
      registrationNumber: 'RC-1234567',
      status: 'active',
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
  const asset1 = await prisma.asset.create({
    data: {
      name: 'Elara Pearl Duplexes',
      companyId: elara.id,
      type: 'Completed',
      projectStatus: 'Available',
      location: 'Lekki Phase 1',
      bedrooms: 4,
      bathrooms: 4,
      area: 350,
      price: '145000000',
      commission: '7975000',
      commissionRate: '5.5',
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

  const asset2 = await prisma.asset.create({
    data: {
      name: 'Primeview Terraces',
      companyId: primevest.id,
      type: 'Off-plan',
      projectStatus: 'Under Construction',
      location: 'Maitama, Abuja',
      bedrooms: 3,
      bathrooms: 3,
      area: 250,
      price: '95000000',
      commission: '3800000',
      commissionRate: '4.0',
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

  const asset3 = await prisma.asset.create({
    data: {
      name: 'Lagos Land Parcels',
      companyId: elara.id,
      type: 'Land',
      projectStatus: 'Planning',
      location: 'Ibeju-Lekki',
      area: 500,
      price: '25000000',
      commission: '1375000',
      commissionRate: '5.5',
      description: 'Strategic land parcels for development in Ibeju-Lekki.',
      totalUnits: 20,
      availableUnits: 18,
      projectedRentalIncome: 0,
      rentalYieldMin: 0,
      rentalYieldMax: 0,
      capitalAppreciation: 15.0,
      capitalAppreciationMin: 10.0,
      capitalAppreciationMax: 20.0,
      totalReturnsMin: 10.0,
      totalReturnsMax: 20.0,
      riskLevel: 'High',
      riskFactors: ['Market', 'Regulatory', 'Development'],
    },
  });

  // ASSET IMAGES
  await prisma.assetImage.createMany({
    data: [
      { assetId: asset1.id, url: 'https://example.com/duplex1.jpg', caption: 'Front View', order: 1 },
      { assetId: asset1.id, url: 'https://example.com/duplex2.jpg', caption: 'Living Room', order: 2 },
      { assetId: asset2.id, url: 'https://example.com/terrace1.jpg', caption: 'Terrace View', order: 1 },
      { assetId: asset3.id, url: 'https://example.com/land1.jpg', caption: 'Aerial View', order: 1 },
      { assetId: asset3.id, url: 'https://example.com/land2.jpg', caption: 'Land Survey', order: 2 },
    ],
    skipDuplicates: true,
  });

  // ASSET DOCUMENTS
  await prisma.assetDocument.createMany({
    data: [
      { assetId: asset1.id, url: 'https://example.com/elara-title-deed.pdf', title: 'Title Deed - Elara Pearl Duplexes', type: 'Legal Document' },
      { assetId: asset1.id, url: 'https://example.com/elara-survey-plan.pdf', title: 'Survey Plan', type: 'Technical Document' },
      { assetId: asset1.id, url: 'https://example.com/elara-cof-o.pdf', title: 'Certificate of Occupancy', type: 'Legal Document' },
      { assetId: asset2.id, url: 'https://example.com/primeview-layout.pdf', title: 'Layout Plan - Primeview Terraces', type: 'Technical Document' },
      { assetId: asset2.id, url: 'https://example.com/primeview-deed.pdf', title: 'Deed of Assignment', type: 'Legal Document' },
      { assetId: asset3.id, url: 'https://example.com/land-survey.pdf', title: 'Land Survey - Ibeju-Lekki', type: 'Survey Document' },
      { assetId: asset3.id, url: 'https://example.com/land-cof-o.pdf', title: 'Certificate of Occupancy - Land Parcels', type: 'Legal Document' },
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
      buyerName: 'Fatima Ibrahim',
      buyerEmail: 'customer1@buyops.com',
      buyerPhone: '+2348087654321',
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
      earnedLeadCommission: 0,
      earnedCloserCommission: 0,
      status: 'COMPLETED',
      commissionPaymentStatus: 'UNPAID',
      paymentType: 'Installment',
      date: NOW,
      leadAgentId: agent.id,
      companyId: elara.id,
    },
  });

  const transaction2 = await prisma.transaction.create({
    data: {
      assetId: asset2.id,
      buyerId: investor2.id,
      totalAmount: 95_000_000,
      commission: 95_000_000 * 0.04,
      totalCommission: 95_000_000 * 0.04,
      earnedTotalCommission: 95_000_000 * 0.04,
      leadCommission: 1_900_000,
      closerCommission: 1_900_000,
      earnedLeadCommission: 1_900_000,
      earnedCloserCommission: 1_900_000,
      status: 'COMPLETED',
      commissionPaymentStatus: 'PAID',
      paymentType: 'Full Payment',
      date: new Date(NOW.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      leadAgentId: agent.id,
      closerAgentId: agent.id,
      companyId: primevest.id,
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
        leadSource: 'investor-app',
        status: 'pending',
        budget: 120_000_000,
        location: 'Lekki / Ikoyi',
        assetInterest: asset1.id,
        assignedToId: agent.id,
        assignedCluster: cluster.id,
        dateReceived: NOW,
        createdById: admin.id,
      },
      {
        name: 'Ngozi Okafor',
        email: 'ngozi.okafor@gmail.com',
        phone: '+2348098765432',
        source: 'Referral',
        leadSource: 'agent',
        status: 'assigned',
        budget: 100_000_000,
        location: 'Abuja',
        assetInterest: asset2.id,
        assignedToId: agent.id,
        assignedCluster: cluster.id,
        dateReceived: NOW,
        createdById: admin.id,
      },
      {
        name: 'Blessing Eze',
        email: 'blessing.eze@gmail.com',
        phone: '+2348076543210',
        source: 'Website',
        leadSource: 'team-lead',
        status: 'available',
        budget: 80_000_000,
        location: 'Lagos',
        assetInterest: asset3.id,
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
        amount: 2_000_000,
        rate: 5.5,
        status: 'UNPAID',
      },
      {
        transactionId: transaction2.id,
        agentId: agent.id,
        amount: 3_800_000,
        rate: 4.0,
        status: 'PAID',
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