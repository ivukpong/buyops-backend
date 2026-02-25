import axios from 'axios';

const API_BASE = 'http://localhost:8080';
const TEST_EMAIL = 'ivukpong@gmail.com';
const TEST_PHONE = '+2348107758678';

interface TestResult {
    notification: string;
    success: boolean;
    error?: string;
}

const results: TestResult[] = [];

async function authenticateAdmin() {
    console.log('\n🔐 Authenticating as admin...');
    try {
        const response = await axios.post(`${API_BASE}/auth/login`, {
            email: 'admin@buyops.com',
            password: 'TestPass2027!',
        });
        console.log('✅ Authentication successful');
        return response.data.access_token;
    } catch (error: any) {
        console.error('❌ Authentication failed:', error.response?.data || error.message);
        throw error;
    }
}

async function createTestUser(token: string): Promise<string> {
    console.log('\n👤 Creating test user with target email/phone...');
    try {
        // Check if user exists
        const existingUsers = await axios.get(`${API_BASE}/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const existingUser = existingUsers.data.find((u: any) => u.email === TEST_EMAIL);
        if (existingUser) {
            console.log('✅ Test user already exists:', existingUser.id);
            return existingUser.id;
        }

        // Create new user
        const response = await axios.post(
            `${API_BASE}/users`,
            {
                email: TEST_EMAIL,
                name: 'Ini Ukpong (Test)',
                phone: TEST_PHONE,
                password: 'TestPassword123!',
                role: 'INVESTOR',
                status: 'ACTIVE',
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('✅ Test user created:', response.data.id);
        return response.data.id;
    } catch (error: any) {
        console.error('❌ Failed to create test user:', error.response?.data || error.message);
        throw error;
    }
}

async function getOrCreateCompany(token: string): Promise<string> {
    try {
        // Try to get existing companies
        const companies = await axios.get(`${API_BASE}/companies`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (companies.data.length > 0) {
            console.log('✅ Using existing company:', companies.data[0].id);
            return companies.data[0].id;
        }

        // Create a company if none exist
        const response = await axios.post(
            `${API_BASE}/companies`,
            {
                name: 'Test Company',
                status: 'active',
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('✅ Test company created:', response.data.id);
        return response.data.id;
    } catch (error: any) {
        console.error('⚠️  Failed to get/create company:', error.response?.data || error.message);
        throw error;
    }
}

async function createTestAsset(token: string): Promise<string> {
    console.log('\n🏢 Creating test asset...');
    try {
        const companyId = await getOrCreateCompany(token);

        const response = await axios.post(
            `${API_BASE}/assets`,
            {
                name: 'Notification Test Property ' + Date.now(),
                description: 'Property created for comprehensive notification testing',
                type: 'LAND',
                location: 'Lagos, Nigeria',
                status: 'draft',
                companyId: companyId,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('✅ Test asset created:', response.data.id);
        return response.data.id;
    } catch (error: any) {
        console.error('❌ Failed to create asset:', error.response?.data || error.message);
        if (error.response?.data) {
            console.error('   Full error:', JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }
}

async function test1_AssetPublished(token: string, assetId: string) {
    console.log('\n📢 TEST 1: ASSET_PUBLISHED notification');
    try {
        await axios.put(
            `${API_BASE}/assets/${assetId}/publish`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        results.push({ notification: 'ASSET_PUBLISHED', success: true });
        console.log('✅ Asset published - notifications should be sent');
    } catch (error: any) {
        results.push({ notification: 'ASSET_PUBLISHED', success: false, error: error.message });
        console.error('❌ Failed:', error.response?.data || error.message);
    }
}

async function test2_AssetUpdated(token: string, assetId: string) {
    console.log('\n📝 TEST 2: ASSET_UPDATED notification');
    try {
        await axios.put(
            `${API_BASE}/assets/${assetId}`,
            { description: 'Updated description for notification test' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        results.push({ notification: 'ASSET_UPDATED', success: true });
        console.log('✅ Asset updated - notifications should be sent');
    } catch (error: any) {
        results.push({ notification: 'ASSET_UPDATED', success: false, error: error.message });
        console.error('❌ Failed:', error.response?.data || error.message);
    }
}

async function test3_NewLeadFromInvestor(token: string, assetId: string, userId: string) {
    console.log('\n📋 TEST 3: NEW_LEAD_FROM_INVESTOR notification');
    try {
        const response = await axios.post(
            `${API_BASE}/leads`,
            {
                name: 'Ini Ukpong',
                email: TEST_EMAIL,
                phone: TEST_PHONE,
                assetInterest: assetId,
                budget: 500000,
                source: 'investor-app',
                leadSource: 'investor-app',
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        results.push({ notification: 'NEW_LEAD_FROM_INVESTOR', success: true });
        console.log('✅ Lead created from investor - notifications should be sent');
        return response.data.id;
    } catch (error: any) {
        results.push({ notification: 'NEW_LEAD_FROM_INVESTOR', success: false, error: error.message });
        console.error('❌ Failed:', error.response?.data || error.message);
        return null;
    }
}

async function test4_LeadAssignedToCluster(token: string, leadId: string) {
    console.log('\n🎯 TEST 4: LEAD_ASSIGNED_TO_CLUSTER notification');
    try {
        // Get first cluster
        const clusters = await axios.get(`${API_BASE}/clusters`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!clusters.data.length) {
            console.log('⚠️  No clusters found, skipping cluster assignment test');
            results.push({ notification: 'LEAD_ASSIGNED_TO_CLUSTER', success: false, error: 'No clusters available' });
            return;
        }

        const clusterId = clusters.data[0].id;
        await axios.post(
            `${API_BASE}/leads/assign`,
            {
                leadIds: [leadId],
                assignmentType: 'cluster',
                clusterId: clusterId,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        results.push({ notification: 'LEAD_ASSIGNED_TO_CLUSTER', success: true });
        console.log('✅ Lead assigned to cluster - notifications should be sent');
    } catch (error: any) {
        results.push({ notification: 'LEAD_ASSIGNED_TO_CLUSTER', success: false, error: error.message });
        console.error('❌ Failed:', error.response?.data || error.message);
    }
}

async function test5_LeadAvailableToAll(token: string) {
    console.log('\n📣 TEST 5: LEAD_AVAILABLE_TO_ALL notification');
    try {
        // Get first asset
        const assets = await axios.get(`${API_BASE}/assets`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const assetId = assets.data[0]?.id;

        // Create another lead
        const leadResponse = await axios.post(
            `${API_BASE}/leads`,
            {
                name: 'Test Lead for All Agents',
                email: 'another-lead@test.com',
                phone: '+234800000000',
                assetInterest: assetId,
                budget: 300000,
                source: 'web',
                leadSource: 'web',
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        await axios.post(
            `${API_BASE}/leads/assign`,
            {
                leadIds: [leadResponse.data.id],
                assignmentType: 'all',
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        results.push({ notification: 'LEAD_AVAILABLE_TO_ALL', success: true });
        console.log('✅ Lead made available to all agents - notifications should be sent');
    } catch (error: any) {
        results.push({ notification: 'LEAD_AVAILABLE_TO_ALL', success: false, error: error.message });
        console.error('❌ Failed:', error.response?.data || error.message);
    }
}

async function test6_DealCreated(token: string, assetId: string, userId: string) {
    console.log('\n💼 TEST 6: DEAL_CREATED notification');
    try {
        const response = await axios.post(
            `${API_BASE}/transactions`,
            {
                assetId: assetId,
                buyerId: userId,
                totalAmount: 500000,
                paymentType: 'installment',
                fractionsPurchased: 10,
                status: 'pending',
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        results.push({ notification: 'DEAL_CREATED', success: true });
        console.log('✅ Deal created - notifications should be sent');
        return response.data.id;
    } catch (error: any) {
        results.push({ notification: 'DEAL_CREATED', success: false, error: error.message });
        console.error('❌ Failed:', error.response?.data || error.message);
        return null;
    }
}

async function test7_DealPaymentReady(token: string, dealId: string) {
    console.log('\n💳 TEST 7: DEAL_PAYMENT_READY notification');
    try {
        await axios.patch(
            `${API_BASE}/transactions/${dealId}`,
            { status: 'ready' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        results.push({ notification: 'DEAL_PAYMENT_READY', success: true });
        console.log('✅ Deal marked as ready - notifications should be sent');
    } catch (error: any) {
        results.push({ notification: 'DEAL_PAYMENT_READY', success: false, error: error.message });
        console.error('❌ Failed:', error.response?.data || error.message);
    }
}

async function test8_PaymentReceived(token: string, dealId: string) {
    console.log('\n💰 TEST 8: PAYMENT_RECEIVED notification');
    try {
        await axios.patch(
            `${API_BASE}/transactions/${dealId}`,
            { status: 'paid' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        results.push({ notification: 'PAYMENT_RECEIVED', success: true });
        console.log('✅ Payment received - notifications should be sent');
    } catch (error: any) {
        results.push({ notification: 'PAYMENT_RECEIVED', success: false, error: error.message });
        console.error('❌ Failed:', error.response?.data || error.message);
    }
}

async function test9_DealClosed(token: string, dealId: string) {
    console.log('\n✅ TEST 9: DEAL_CLOSED notification');
    try {
        await axios.patch(
            `${API_BASE}/transactions/${dealId}`,
            { status: 'closed' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        results.push({ notification: 'DEAL_CLOSED', success: true });
        console.log('✅ Deal closed - notifications should be sent');
    } catch (error: any) {
        results.push({ notification: 'DEAL_CLOSED', success: false, error: error.message });
        console.error('❌ Failed:', error.response?.data || error.message);
    }
}

async function test10_InstallmentNotifications(token: string, userId: string, assetId: string) {
    console.log('\n📅 TEST 10-13: Installment notifications');
    try {
        // Get company ID first
        const companies = await axios.get(`${API_BASE}/companies`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const companyId = companies.data[0]?.id;

        // Create installment plan
        const planResponse = await axios.post(
            `${API_BASE}/installments`,
            {
                buyerName: 'Ini Ukpong',
                buyerEmail: TEST_EMAIL,
                buyerPhone: TEST_PHONE,
                assetId: assetId,
                totalAmount: 500000,
                downPayment: 100000,
                numberOfInstallments: 10,
                frequency: 'monthly',
                startDate: new Date().toISOString(),
                leadAgentId: userId,
                closerAgentId: userId,
                companyId: companyId,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const planId = planResponse.data.id;
        console.log('✅ Installment plan created:', planId);

        // Get schedule
        const schedule = await axios.get(`${API_BASE}/installments/${planId}/schedule`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const firstInstallment = schedule.data[0];
        console.log('📋 First installment:', firstInstallment.id);

        // TEST 10: INSTALLMENT_DUE
        try {
            await axios.post(
                `${API_BASE}/notification/installment-due/${firstInstallment.id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            results.push({ notification: 'INSTALLMENT_DUE', success: true });
            console.log('✅ INSTALLMENT_DUE notification triggered');
        } catch (error: any) {
            results.push({ notification: 'INSTALLMENT_DUE', success: false, error: error.message });
            console.error('❌ INSTALLMENT_DUE failed:', error.response?.data || error.message);
        }

        // TEST 11: INSTALLMENT_OVERDUE
        try {
            await axios.post(
                `${API_BASE}/notification/installment-overdue/${firstInstallment.id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            results.push({ notification: 'INSTALLMENT_OVERDUE', success: true });
            console.log('✅ INSTALLMENT_OVERDUE notification triggered');
        } catch (error: any) {
            results.push({ notification: 'INSTALLMENT_OVERDUE', success: false, error: error.message });
            console.error('❌ INSTALLMENT_OVERDUE failed:', error.response?.data || error.message);
        }

        // TEST 12: PAYMENT_RECORDED (for installment)
        try {
            await axios.post(
                `${API_BASE}/installments/${firstInstallment.id}/payments`,
                {
                    amount: 40000,
                    paymentMethod: 'bank_transfer',
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            results.push({ notification: 'INSTALLMENT_PAYMENT_RECORDED', success: true });
            console.log('✅ INSTALLMENT_PAYMENT_RECORDED notification triggered');
        } catch (error: any) {
            results.push({ notification: 'INSTALLMENT_PAYMENT_RECORDED', success: false, error: error.message });
            console.error('❌ INSTALLMENT_PAYMENT_RECORDED failed:', error.response?.data || error.message);
        }

        // TEST 13: INSTALLMENT_COMPLETED
        try {
            // Mark plan as completed
            await axios.patch(
                `${API_BASE}/installments/plans/${planId}`,
                { status: 'completed' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            results.push({ notification: 'INSTALLMENT_COMPLETED', success: true });
            console.log('✅ INSTALLMENT_COMPLETED notification should be triggered');
        } catch (error: any) {
            results.push({ notification: 'INSTALLMENT_COMPLETED', success: false, error: error.message });
            console.error('❌ INSTALLMENT_COMPLETED failed:', error.response?.data || error.message);
        }

    } catch (error: any) {
        console.error('❌ Installment test setup failed:', error.response?.data || error.message);
    }
}

async function test14_CommissionNotifications(token: string) {
    console.log('\n💵 TEST 14-15: Commission notifications');
    try {
        // Get transactions with commissions
        const transactions = await axios.get(`${API_BASE}/transactions`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const transactionsWithCommissions = transactions.data
            .filter((t: any) => t.commissionPaymentStatus === 'pending')
            .slice(0, 2)
            .map((t: any) => t.id);

        if (!transactionsWithCommissions.length) {
            console.log('⚠️  No pending commission transactions found');
            results.push({ notification: 'COMMISSION_SENT', success: false, error: 'No pending commissions' });
            results.push({ notification: 'COMMISSION_PAID', success: false, error: 'No pending commissions' });
            return;
        }

        // TEST 14: COMMISSION_SENT
        try {
            await axios.post(
                `${API_BASE}/notification/commissions-sent`,
                { transactionIds: transactionsWithCommissions },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            results.push({ notification: 'COMMISSION_SENT', success: true });
            console.log('✅ COMMISSION_SENT notification triggered');
        } catch (error: any) {
            results.push({ notification: 'COMMISSION_SENT', success: false, error: error.message });
            console.error('❌ COMMISSION_SENT failed:', error.response?.data || error.message);
        }

        // TEST 15: COMMISSION_PAID
        try {
            await axios.post(
                `${API_BASE}/notification/commissions-paid`,
                { transactionIds: transactionsWithCommissions, fileName: 'test-batch.csv' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            results.push({ notification: 'COMMISSION_PAID', success: true });
            console.log('✅ COMMISSION_PAID notification triggered');
        } catch (error: any) {
            results.push({ notification: 'COMMISSION_PAID', success: false, error: error.message });
            console.error('❌ COMMISSION_PAID failed:', error.response?.data || error.message);
        }

    } catch (error: any) {
        console.error('❌ Commission test failed:', error.response?.data || error.message);
    }
}

async function printSummary() {
    console.log('\n\n═══════════════════════════════════════════════════════════');
    console.log('📊 NOTIFICATION TEST SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📧 Target Email: ${TEST_EMAIL}`);
    console.log(`📱 Target Phone: ${TEST_PHONE}`);
    console.log('───────────────────────────────────────────────────────────');

    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`\n✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📝 Total: ${results.length}\n`);

    console.log('Detailed Results:');
    results.forEach((result, index) => {
        const icon = result.success ? '✅' : '❌';
        console.log(`${icon} ${index + 1}. ${result.notification}${result.error ? ` - ${result.error}` : ''}`);
    });

    console.log('\n───────────────────────────────────────────────────────────');
    console.log('📬 Action Required:');
    console.log(`1. Check email inbox: ${TEST_EMAIL}`);
    console.log(`2. Check SMS on phone: ${TEST_PHONE}`);
    console.log(`3. Check database notifications table for in-app notifications`);
    console.log('═══════════════════════════════════════════════════════════\n');
}

async function main() {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║         COMPREHENSIVE NOTIFICATION SYSTEM TEST            ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(`\n📧 All notifications will be sent to: ${TEST_EMAIL}`);
    console.log(`📱 All SMS will be sent to: ${TEST_PHONE}\n`);

    try {
        const token = await authenticateAdmin();
        const userId = await createTestUser(token);
        const assetId = await createTestAsset(token);

        // Run all tests
        await test1_AssetPublished(token, assetId);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit

        await test2_AssetUpdated(token, assetId);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const leadId = await test3_NewLeadFromInvestor(token, assetId, userId);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (leadId) {
            await test4_LeadAssignedToCluster(token, leadId);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await test5_LeadAvailableToAll(token);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const dealId = await test6_DealCreated(token, assetId, userId);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (dealId) {
            await test7_DealPaymentReady(token, dealId);
            await new Promise(resolve => setTimeout(resolve, 1000));

            await test8_PaymentReceived(token, dealId);
            await new Promise(resolve => setTimeout(resolve, 1000));

            await test9_DealClosed(token, dealId);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await test10_InstallmentNotifications(token, userId, assetId);
        await new Promise(resolve => setTimeout(resolve, 1000));

        await test14_CommissionNotifications(token);

        await printSummary();

    } catch (error: any) {
        console.error('\n💥 Test suite failed:', error.message);
        process.exit(1);
    }
}

main();
