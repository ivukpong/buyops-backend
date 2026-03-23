// ══════════════════════════════════════════════════════════════════════════
// EMAIL TEMPLATES — BuyOps Branded Design
// Colors mirror the admin/sales-dashboard UI theme:
//   Primary   #4c51bf  Indigo
//   Success   #10b981  Emerald
//   Warning   #f59e0b  Amber
//   Danger    #ef4444  Red
//   Cyan      #0891b2  (leads)
//   Bg        #f8f9fb | Text #1a1f36 | Muted #6b7280 | Border #e5e7eb
// ══════════════════════════════════════════════════════════════════════════

// ─── Shared layout helpers ────────────────────────────────────────────────

// ─── Logo (hosted externally — works in Gmail and all email clients) ───────
const LOGO_SRC = 'https://res.cloudinary.com/dfm3gcy5u/image/upload/w_380,h_98,f_png,q_100/v1774273368/logo';

function layout(opts: {
  title: string;
  badgeText: string;
  badgeColor: string;
  badgeBg: string;
  accentBar?: string;
  body: string;
}): string {
  const accent = opts.accentBar ?? '#4c51bf';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${opts.title}</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .email-outer       { background-color: #0f172a !important; }
      .email-outer-td    { background-color: #0f172a !important; }
      .email-header      { background-color: #1e293b !important; }
      .email-logo        { filter: brightness(0) invert(1) !important; }
      .email-divider-line { background-color: #334155 !important; }
      .email-card        { background-color: #1e293b !important; }
      .email-title       { color: #f8fafc !important; }
      .email-text        { color: #cbd5e1 !important; }
      .email-muted       { color: #94a3b8 !important; }
      .email-info-tbl    { background-color: #0f172a !important; border-color: #334155 !important; }
      .email-info-row td { border-bottom-color: #334155 !important; }
      .email-info-label  { color: #94a3b8 !important; }
      .email-info-val    { color: #e2e8f0 !important; }
      .email-footer-text { color: #475569 !important; }
      .email-divider     { border-top-color: #334155 !important; color: #64748b !important; }
    }
  </style>
</head>
<body class="email-outer" style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" class="email-outer" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" class="email-outer-td" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

          <!-- TOP ACCENT STRIP -->
          <tr>
            <td style="background:${accent};height:5px;border-radius:12px 12px 0 0;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td class="email-header" style="background:#ffffff;padding:22px 40px;">
              <img src="${LOGO_SRC}" width="190" height="49" alt="BuyOps" class="email-logo" style="display:block;" />
            </td>
          </tr>

          <!-- HEADER / CARD DIVIDER -->
          <tr>
            <td class="email-divider-line" style="background:#e5e7eb;height:1px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- CARD -->
          <tr>
            <td class="email-card" style="background:#ffffff;border-radius:0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:36px 40px 44px;">

                    <!-- badge -->
                    <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:22px;">
                      <tr>
                        <td style="background:${opts.badgeBg};border-radius:20px;padding:5px 14px;">
                          <span style="color:${opts.badgeColor};font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;">${opts.badgeText}</span>
                        </td>
                      </tr>
                    </table>

                    <!-- title -->
                    <h1 class="email-title" style="margin:0 0 20px;color:#1a1f36;font-size:22px;font-weight:700;line-height:1.3;">${opts.title}</h1>

                    ${opts.body}

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:28px 0 8px;text-align:center;">
              <p class="email-footer-text" style="margin:0 0 5px;color:#9ca3af;font-size:12px;">&copy; 2026 BuyOps. All rights reserved.</p>
              <p class="email-footer-text" style="margin:0;color:#b0b7c3;font-size:11px;">This is an automated message &mdash; please do not reply directly to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function para(text: string, color = '#374151'): string {
  return `<p class="email-text" style="margin:0 0 16px;color:${color};font-size:15px;line-height:1.7;">${text}</p>`;
}

function infoRow(label: string, value: string): string {
  return `
    <tr class="email-info-row">
      <td class="email-info-label" style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;width:160px;vertical-align:top;">${label}</td>
      <td class="email-info-val" style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#1a1f36;font-size:13px;font-weight:600;vertical-align:top;">${value}</td>
    </tr>`;
}

function infoCard(rows: string): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" class="email-info-tbl" style="background:#f8f9fb;border:1px solid #e5e7eb;border-radius:10px;margin:20px 0 28px;">
    <tr><td style="padding:4px 20px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${rows}</table>
    </td></tr>
  </table>`;
}

function cta(href: string, label: string, color = '#4c51bf'): string {
  return `
  <table cellpadding="0" cellspacing="0" role="presentation" style="margin:8px 0 28px;">
    <tr>
      <td style="background:${color};border-radius:8px;">
        <a href="${href}" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.2px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function alertBox(text: string, color: string, bg: string, border: string): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:20px 0;">
    <tr>
      <td style="background:${bg};border-left:4px solid ${border};border-radius:6px;padding:14px 18px;">
        <p style="margin:0;color:${color};font-size:14px;line-height:1.6;">${text}</p>
      </td>
    </tr>
  </table>`;
}

function dividerNote(text: string): string {
  return `<p class="email-divider email-muted" style="margin:28px 0 0;padding-top:24px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;line-height:1.7;">${text}</p>`;
}

// ─── Templates ────────────────────────────────────────────────────────────

export const EmailTemplates = {
  // ════════════════════════════════════════════════════════════════════════
  // A1. PASSWORD RESET
  // ════════════════════════════════════════════════════════════════════════
  PASSWORD_RESET: {
    subject: () => 'Reset Your BuyOps Password',
    body: (data: any, recipient: any) =>
      layout({
        title: 'Reset Your Password',
        badgeText: 'Security',
        badgeColor: '#b45309',
        badgeBg: '#fffbeb',
        accentBar: '#f59e0b',
        body: `
          ${para(`Hi ${recipient.name},`)}
          ${para('We received a request to reset the password for your BuyOps account. Click the button below to create a new password.')}
          ${cta(data.resetLink, 'Reset Password', '#4c51bf')}
          ${alertBox(
            'This link will expire shortly. If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.',
            '#92400e', '#fffbeb', '#f59e0b',
          )}
          ${dividerNote('For your security, never share your password or this link with anyone. BuyOps will never ask for your password via email.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A2. NEW DEVICE LOGIN ALERT
  // ════════════════════════════════════════════════════════════════════════
  NEW_DEVICE_LOGIN: {
    subject: () => 'New Login Detected on Your BuyOps Account',
    body: (data: any, recipient: any) =>
      layout({
        title: 'New Login Detected',
        badgeText: 'Security Alert',
        badgeColor: '#b45309',
        badgeBg: '#fffbeb',
        accentBar: '#f59e0b',
        body: `
          ${para(`Hi ${recipient.name},`)}
          ${para('We detected a successful login to your BuyOps account from a new device or location.')}
          ${infoCard(
            infoRow('Device', data.device || 'Unknown') +
            infoRow('Location', data.location || 'Unknown') +
            infoRow('Time', data.timestamp || new Date().toLocaleString()),
          )}
          ${para('If this was you, no action is needed.')}
          ${alertBox(
            'Not you? Reset your password immediately to secure your account.',
            '#991b1b', '#fef2f2', '#ef4444',
          )}
          ${dividerNote('BuyOps monitors account activity to keep your investments safe. Contact support if you have concerns.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A3. ASSET PUBLISHED
  // ════════════════════════════════════════════════════════════════════════
  ASSET_PUBLISHED: {
    subject: () => 'Asset Successfully Published',
    body: (data: any) =>
      layout({
        title: 'Asset Successfully Published',
        badgeText: 'Asset Management',
        badgeColor: '#3730a3',
        badgeBg: '#eef2ff',
        accentBar: '#4c51bf',
        body: `
          ${para('A new investment asset has been published on BuyOps and is now live according to its visibility and distribution settings.')}
          ${infoCard(
            infoRow('Asset Name', data.assetName) +
            infoRow('Company', data.companyName),
          )}
          ${para('Agents and eligible investors can now view and interact with this asset.', '#6b7280')}
          ${dividerNote('This is an automated confirmation from the BuyOps platform.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A4. ASSET UPDATED
  // ════════════════════════════════════════════════════════════════════════
  ASSET_UPDATED: {
    subject: () => 'Asset Information Updated',
    body: (data: any) =>
      layout({
        title: 'Asset Information Updated',
        badgeText: 'Asset Management',
        badgeColor: '#3730a3',
        badgeBg: '#eef2ff',
        accentBar: '#4c51bf',
        body: `
          ${para('An investment asset on BuyOps has been updated. Please review the changes to ensure accuracy.')}
          ${infoCard(
            infoRow('Asset Name', data.assetName) +
            infoRow('Updated Fields', data.updatedFields),
          )}
          ${alertBox(
            'Please verify that all updated information aligns with current terms and agreements.',
            '#1e40af', '#eff6ff', '#3b82f6',
          )}
          ${dividerNote('This is an automated notification from the BuyOps platform.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A5. NEW LEAD FROM INVESTOR
  // ════════════════════════════════════════════════════════════════════════
  NEW_LEAD_FROM_INVESTOR: {
    subject: () => 'New Lead Assigned to You',
    body: (data: any) =>
      layout({
        title: 'New Lead Assigned to You',
        badgeText: 'Lead',
        badgeColor: '#0e7490',
        badgeBg: '#ecfeff',
        accentBar: '#0891b2',
        body: `
          ${para('A new investor lead has been onboarded and assigned directly to you. Please follow up promptly to progress the opportunity.')}
          ${infoCard(
            infoRow('Lead Name', data.leadName) +
            infoRow('Asset Interest', data.assetName) +
            infoRow('Budget', `&#8358;${(data.budget || 0).toLocaleString()}`),
          )}
          ${alertBox(
            'Timely follow-up significantly improves conversion rates. Aim to reach out within 24 hours.',
            '#065f46', '#ecfdf5', '#10b981',
          )}
          ${dividerNote('Full lead details are available in your BuyOps dashboard.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A6. LEAD ASSIGNED TO CLUSTER
  // ════════════════════════════════════════════════════════════════════════
  LEAD_ASSIGNED_TO_CLUSTER: {
    subject: () => 'Lead Assigned to Your Cluster',
    body: (data: any) =>
      layout({
        title: 'Lead Assigned to Your Cluster',
        badgeText: 'Lead',
        badgeColor: '#0e7490',
        badgeBg: '#ecfeff',
        accentBar: '#0891b2',
        body: `
          ${para('A new lead has been assigned to your cluster. Please coordinate with your team for prompt follow-up.')}
          ${infoCard(
            infoRow('Lead Name', data.leadName) +
            infoRow('Cluster', data.clusterName),
          )}
          ${dividerNote('Coordinate with your cluster manager to assign the appropriate agent for follow-up.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A7. LEAD AVAILABLE TO ALL CLUSTERS
  // ════════════════════════════════════════════════════════════════════════
  LEAD_AVAILABLE_TO_ALL: {
    subject: () => 'New Lead Available',
    body: (data: any) =>
      layout({
        title: 'New Lead Available',
        badgeText: 'Open Lead',
        badgeColor: '#0e7490',
        badgeBg: '#ecfeff',
        accentBar: '#0891b2',
        body: `
          ${para('A new lead has been made available to all clusters. Agents may engage based on availability and fit.')}
          ${infoCard(
            infoRow('Lead Name', data.leadName) +
            infoRow('Asset Interest', data.assetName),
          )}
          ${alertBox(
            'This lead is open to all clusters. First to engage with a qualified pitch gets priority.',
            '#0e7490', '#ecfeff', '#0891b2',
          )}
          ${dividerNote('View the full lead profile in your BuyOps dashboard.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A8. DEAL CREATED
  // ════════════════════════════════════════════════════════════════════════
  DEAL_CREATED: {
    subject: () => 'New Deal Created',
    body: (data: any) =>
      layout({
        title: 'New Deal Created',
        badgeText: 'Deal',
        badgeColor: '#065f46',
        badgeBg: '#ecfdf5',
        accentBar: '#10b981',
        body: `
          ${para('A new deal has been created on BuyOps. This notification is for your administrative oversight.')}
          ${infoCard(
            infoRow('Deal ID', data.dealId) +
            infoRow('Agent', data.agentName) +
            infoRow('Asset', data.assetName),
          )}
          ${dividerNote('Deal activity is tracked in real-time in your BuyOps admin dashboard.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A9. DEAL PAYMENT READY
  // ════════════════════════════════════════════════════════════════════════
  DEAL_PAYMENT_READY: {
    subject: () => 'Deal Ready for Payment Processing',
    body: (data: any) =>
      layout({
        title: 'Deal Ready for Payment',
        badgeText: 'Action Required',
        badgeColor: '#b45309',
        badgeBg: '#fffbeb',
        accentBar: '#f59e0b',
        body: `
          ${para('A deal has been marked as <strong>Payment Ready</strong>. Please proceed with payment verification and processing.')}
          ${infoCard(
            infoRow('Deal ID', data.dealId) +
            infoRow('Amount', `&#8358;${(data.amount || 0).toLocaleString()}`) +
            infoRow('Payment Type', data.paymentType),
          )}
          ${alertBox(
            'Please verify the payment details before processing. Ensure all documentation is in order.',
            '#92400e', '#fffbeb', '#f59e0b',
          )}
          ${dividerNote('Process this payment through the BuyOps admin panel to maintain a full audit trail.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A10. DEAL CLOSED
  // ════════════════════════════════════════════════════════════════════════
  DEAL_CLOSED: {
    subject: () => 'Deal Successfully Closed',
    body: (data: any) =>
      layout({
        title: 'Deal Successfully Closed',
        badgeText: 'Deal Closed',
        badgeColor: '#065f46',
        badgeBg: '#ecfdf5',
        accentBar: '#10b981',
        body: `
          ${para('A deal has been successfully closed on BuyOps. This transaction will now be reflected in reporting and commissions.')}
          ${infoCard(
            infoRow('Deal ID', data.dealId) +
            infoRow('Asset', data.assetName) +
            infoRow('Commission Status', data.commissionStatus),
          )}
          ${dividerNote('Full transaction details and commission breakdown are available in the BuyOps admin dashboard.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A11. INSTALLMENT DUE
  // ════════════════════════════════════════════════════════════════════════
  INSTALLMENT_DUE: {
    subject: () => 'Upcoming Installment Payment Due',
    body: (data: any) =>
      layout({
        title: 'Installment Payment Due Soon',
        badgeText: 'Payment Reminder',
        badgeColor: '#b45309',
        badgeBg: '#fffbeb',
        accentBar: '#f59e0b',
        body: `
          ${para('This is a friendly reminder that an installment payment is coming up. Please ensure payment is completed on or before the due date.')}
          ${infoCard(
            infoRow('Amount Due', `&#8358;${(data.amount || 0).toLocaleString()}`) +
            infoRow('Due Date', new Date(data.dueDate).toLocaleDateString('en-NG', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })),
          )}
          ${alertBox(
            'Late payments may attract penalties. Please make your payment before the due date to stay in good standing.',
            '#92400e', '#fffbeb', '#f59e0b',
          )}
          ${dividerNote('Log in to your BuyOps account to make a payment or view your full installment schedule.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A12. INSTALLMENT OVERDUE
  // ════════════════════════════════════════════════════════════════════════
  INSTALLMENT_OVERDUE: {
    subject: () => 'Overdue Installment Payment \u2014 Action Required',
    body: (data: any) =>
      layout({
        title: 'Installment Payment Overdue',
        badgeText: 'Overdue',
        badgeColor: '#991b1b',
        badgeBg: '#fef2f2',
        accentBar: '#ef4444',
        body: `
          ${para('Your installment payment is now <strong>overdue</strong>. Please make payment as soon as possible to avoid further penalties or disruption to your investment.')}
          ${infoCard(
            infoRow('Amount Overdue', `&#8358;${(data.amount || 0).toLocaleString()}`) +
            infoRow('Original Due Date', new Date(data.dueDate).toLocaleDateString('en-NG', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })),
          )}
          ${alertBox(
            'Continued non-payment may affect the status of your investment. Please contact your agent or our support team if you need assistance.',
            '#991b1b', '#fef2f2', '#ef4444',
          )}
          ${dividerNote('If you have already made this payment and received this email in error, please contact BuyOps support with your transaction reference.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A13. PAYMENT RECEIVED
  // ════════════════════════════════════════════════════════════════════════
  PAYMENT_RECEIVED: {
    subject: () => 'Payment Received \u2014 Confirmation',
    body: (data: any) =>
      layout({
        title: 'Payment Confirmed',
        badgeText: 'Payment Received',
        badgeColor: '#065f46',
        badgeBg: '#ecfdf5',
        accentBar: '#10b981',
        body: `
          ${para('We have successfully received your payment. Thank you for staying on track with your investment.')}
          ${infoCard(
            infoRow('Amount Received', `&#8358;${(data.amount || 0).toLocaleString()}`) +
            infoRow('Transaction Reference', data.reference),
          )}
          ${alertBox(
            'Your payment has been recorded and your installment schedule has been updated accordingly.',
            '#065f46', '#ecfdf5', '#10b981',
          )}
          ${dividerNote('Please retain this email as proof of payment. View your full payment history in your BuyOps account.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A14. INSTALLMENT PLAN COMPLETED
  // ════════════════════════════════════════════════════════════════════════
  INSTALLMENT_COMPLETED: {
    subject: () => 'Congratulations \u2014 Installment Plan Completed!',
    body: (data: any) =>
      layout({
        title: 'Installment Plan Completed!',
        badgeText: 'Completed',
        badgeColor: '#065f46',
        badgeBg: '#ecfdf5',
        accentBar: '#10b981',
        body: `
          ${para('Congratulations! You have successfully completed your installment payment plan. This is a significant milestone in your investment journey with BuyOps.')}
          ${infoCard(
            infoRow('Asset', data.assetName) +
            infoRow('Total Paid', `&#8358;${(data.totalPaid || 0).toLocaleString()}`),
          )}
          ${alertBox(
            'Thank you for your commitment and trust in BuyOps. Our team will be in touch regarding next steps for your investment.',
            '#065f46', '#ecfdf5', '#10b981',
          )}
          ${dividerNote('Your full investment and payment history is available in your BuyOps account.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A15. AGENT INVITATION
  // ════════════════════════════════════════════════════════════════════════
  AGENT_INVITATION: {
    subject: () => 'Welcome to BuyOps \u2014 Your Agent Account is Ready',
    body: (data: any, recipient: any) =>
      layout({
        title: `Welcome to BuyOps, ${recipient.name}!`,
        badgeText: 'Invitation',
        badgeColor: '#3730a3',
        badgeBg: '#eef2ff',
        accentBar: '#4c51bf',
        body: `
          ${para(`Hi ${recipient.name},`)}
          ${para("You've been invited to join BuyOps as a <strong>Sales Agent</strong>. Your account has been set up and is ready to go. Use the credentials below to log in for the first time.")}
          ${infoCard(
            infoRow('Email', recipient.email) +
            infoRow('Temporary Password', `<code style="background:#f3f4f6;padding:2px 8px;border-radius:4px;font-size:13px;font-family:monospace;">${data.tempPassword}</code>`),
          )}
          ${cta(data.loginLink, 'Log In to BuyOps', '#4c51bf')}
          ${alertBox(
            'For your security, please change your password immediately after your first login.',
            '#1e40af', '#eff6ff', '#3b82f6',
          )}
          ${dividerNote('If you were not expecting this invitation or believe it was sent in error, please contact BuyOps support immediately and disregard this email.')}
        `,
      }),
  },

  // ════════════════════════════════════════════════════════════════════════
  // A16. EMAIL VERIFICATION
  // ════════════════════════════════════════════════════════════════════════
  EMAIL_VERIFICATION: {
    subject: () => 'Verify Your BuyOps Email Address',
    body: (data: any, recipient: any) =>
      layout({
        title: 'Verify Your Email Address',
        badgeText: 'Email Verification',
        badgeColor: '#3730a3',
        badgeBg: '#eef2ff',
        accentBar: '#4c51bf',
        body: `
          ${para(`Hi ${recipient.name},`)}
          ${para('Thank you for registering with BuyOps. To complete your account setup, please verify your email address by clicking the button below.')}
          ${cta(data.verificationLink, 'Verify Email Address', '#4c51bf')}
          ${alertBox(
            'This verification link expires in 24 hours. If it expires, you can request a new one from your account settings.',
            '#1e40af', '#eff6ff', '#3b82f6',
          )}
          ${dividerNote('If you did not create a BuyOps account, please ignore this email. No action is required and your email will not be added to our system.')}
        `,
      }),
  },
};
