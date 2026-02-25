const base = "http://localhost:4000";
const now = Date.now();
const email = `qa.admin.${now}@example.com`;
const password = "Strong@1234";

const checks = [];
let token = "";
let userId = "";
let createdLeadId = "";
let createdTxId = "";
let selectedAssetId = "";

async function jfetch(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

function record(name, ok, details) {
  checks.push({ name, ok, details });
}

(async () => {
  try {
    const register = await jfetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        name: "QA Admin",
        role: "ADMIN",
      }),
    });

    if (register.ok && register.data?.access_token) {
      token = register.data.access_token;
      userId = register.data?.user?.id || "";
      record("Auth register/login ADMIN", true, `userId=${userId}`);
    } else {
      const login = await jfetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (login.ok && login.data?.access_token) {
        token = login.data.access_token;
        userId = login.data?.user?.id || "";
        record("Auth register/login ADMIN", true, `userId=${userId}`);
      } else {
        record(
          "Auth register/login ADMIN",
          false,
          `register=${register.status}, login=${login.status}`,
        );
      }
    }

    if (!token) {
      console.log(JSON.stringify({ summary: "FAILED", checks }, null, 2));
      process.exit(1);
    }

    const authHeaders = { Authorization: `Bearer ${token}` };

    const n0 = await jfetch("/notifications/unread", { headers: authHeaders });
    record(
      "Notifications unread baseline",
      n0.ok,
      `status=${n0.status}, count=${n0.data?.count ?? "n/a"}`,
    );

    const providers = await jfetch("/payments/providers", {
      headers: authHeaders,
    });
    const paystackEnabled = !!providers.data?.paystack?.enabled;
    const flutterwaveEnabled = !!providers.data?.flutterwave?.enabled;
    record(
      "Payments providers config",
      providers.ok && (paystackEnabled || flutterwaveEnabled),
      `paystack=${paystackEnabled}, flutterwave=${flutterwaveEnabled}`,
    );

    const initialize = await jfetch("/payments/initialize", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        provider: "paystack",
        email,
        amount: 1500,
        currency: "NGN",
        title: "QA Payment",
      }),
    });

    const reference =
      initialize.data?.reference || initialize.data?.data?.reference;
    const authorizationUrl =
      initialize.data?.authorizationUrl ||
      initialize.data?.authorization_url ||
      initialize.data?.data?.authorization_url;

    record(
      "Payments initialize (paystack)",
      initialize.ok,
      `status=${initialize.status}, ref=${reference ? "yes" : "no"}, url=${
        authorizationUrl ? "yes" : "no"
      }`,
    );

    if (reference) {
      const verify = await jfetch(
        `/payments/verify?provider=paystack&reference=${encodeURIComponent(
          reference,
        )}`,
        { headers: authHeaders },
      );
      record(
        "Payments verify endpoint reachable",
        verify.ok || verify.status === 400 || verify.status === 404,
        `status=${verify.status}`,
      );
    } else {
      record(
        "Payments verify endpoint reachable",
        false,
        "skipped: no reference returned",
      );
    }

    const assets = await jfetch("/assets", { headers: authHeaders });
    const firstAsset =
      Array.isArray(assets.data) && assets.data.length > 0
        ? assets.data[0]
        : null;
    selectedAssetId = firstAsset?.id || "";
    record(
      "Assets list for test target",
      !!firstAsset,
      firstAsset ? `assetId=${firstAsset.id}` : `status=${assets.status}`,
    );

    if (firstAsset) {
      const updateAsset = await jfetch(`/assets/${firstAsset.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ title: `QA Update ${now}` }),
      });
      record(
        "Asset update (triggers notifications)",
        updateAsset.ok,
        `status=${updateAsset.status}`,
      );

      const publishAsset = await jfetch(`/assets/${firstAsset.id}/publish`, {
        method: "PUT",
        headers: authHeaders,
      });
      record(
        "Asset publish (triggers notifications)",
        publishAsset.ok,
        `status=${publishAsset.status}`,
      );
    }

    const newLead = await jfetch("/leads", {
      method: "POST",
      body: JSON.stringify({
        name: `Lead ${now}`,
        email: `lead.${now}@example.com`,
        phone: "+2348000000000",
        assetInterest: selectedAssetId || undefined,
        budget: 2500000,
        source: "investor-app",
        leadSource: "investor-app",
        status: "pending",
      }),
    });

    createdLeadId = newLead.data?.id || "";
    record(
      "Lead create (investor source trigger)",
      newLead.ok,
      `status=${newLead.status}, leadId=${createdLeadId || "n/a"}`,
    );

    if (createdLeadId) {
      const assignAll = await jfetch("/leads/assign", {
        method: "POST",
        body: JSON.stringify({
          leadIds: [createdLeadId],
          assignmentType: "all",
        }),
      });
      record(
        "Lead assign all (agent broadcast trigger)",
        assignAll.ok,
        `status=${assignAll.status}`,
      );
    }

    if (selectedAssetId && userId) {
      const createTx = await jfetch("/transactions", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          assetId: selectedAssetId,
          buyerId: userId,
          totalAmount: 1200000,
          paymentType: "installment",
          leadCommission: 50000,
          closerCommission: 50000,
          totalCommission: 100000,
        }),
      });

      createdTxId = createTx.data?.id || "";
      record(
        "Transaction create (deal notifications)",
        createTx.ok,
        `status=${createTx.status}, txId=${createdTxId || "n/a"}`,
      );

      if (createdTxId) {
        const completeTx = await jfetch(`/transactions/${createdTxId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({ status: "COMPLETED" }),
        });
        record(
          "Transaction complete (deal closed notifications)",
          completeTx.ok,
          `status=${completeTx.status}`,
        );
      }
    }

    const planList = await jfetch("/installments");
    const firstPlanWithInstallment = Array.isArray(planList.data)
      ? planList.data.find(
          (plan) =>
            Array.isArray(plan.installments) && plan.installments.length > 0,
        )
      : null;

    if (firstPlanWithInstallment) {
      const installment =
        firstPlanWithInstallment.installments.find(
          (item) => String(item.status).toLowerCase() !== "paid",
        ) || firstPlanWithInstallment.installments[0];
      const amount = Math.max(1, Number(installment.amount || 1000));

      const payInstallment = await jfetch(
        `/installments/${firstPlanWithInstallment.id}/installments/${installment.id}/pay`,
        {
          method: "PUT",
          body: JSON.stringify({ amount, paymentMethod: "bank_transfer" }),
        },
      );

      record(
        "Installment payment record (payment notifications)",
        payInstallment.ok,
        `status=${payInstallment.status}, planId=${firstPlanWithInstallment.id}`,
      );
    } else {
      record(
        "Installment payment record (payment notifications)",
        false,
        "skipped: no installment plan with installments found",
      );
    }

    const notifications = await jfetch("/notifications", {
      headers: authHeaders,
    });
    const unreadAfter = await jfetch("/notifications/unread", {
      headers: authHeaders,
    });

    const notifCount = Array.isArray(notifications.data)
      ? notifications.data.length
      : 0;
    const sampleTitles = Array.isArray(notifications.data)
      ? notifications.data.slice(0, 8).map((item) => item.title)
      : [];

    record(
      "Notifications fetch after triggers",
      notifications.ok,
      `status=${notifications.status}, count=${notifCount}`,
    );
    record(
      "Notifications unread after triggers",
      unreadAfter.ok,
      `status=${unreadAfter.status}, count=${unreadAfter.data?.count ?? "n/a"}`,
    );

    const passed = checks.every((item) => item.ok);

    console.log(
      JSON.stringify(
        {
          summary: passed ? "PASS" : "PARTIAL",
          checks,
          sampleNotificationTitles: sampleTitles,
          context: {
            email,
            userId,
            createdLeadId,
            createdTxId,
            selectedAssetId,
          },
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
