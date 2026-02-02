// ══════════════════════════════════════════════════════════════════════════
// EMAIL TEMPLATES - Based on Notification Requirements Document
// ══════════════════════════════════════════════════════════════════════════

export const EmailTemplates = {
  // ════════════════════════════════════════════════════════════════════════
  // A1. PASSWORD RESET
  // ════════════════════════════════════════════════════════════════════════
  PASSWORD_RESET: {
    subject: () => 'Reset Your BuyOps Password',
    body: (data: any, recipient: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your BuyOps Password</h2>
        <p>Dear ${recipient.name},</p>
        <p>You requested a password reset for your BuyOps account.</p>
        <p>Click the link below to create a new password:</p>
        <p>
          <a href="${data.resetLink}" 
             style="background-color: #4c51bf; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>If you did not request this, please ignore this email.</p>
        <p>For security reasons, this link will expire shortly.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
  },

  // ════════════════════════════════════════════════════════════════════════
  // A2. NEW DEVICE LOGIN ALERT
  // ════════════════════════════════════════════════════════════════════════
  NEW_DEVICE_LOGIN: {
    subject: () => 'New Login Detected on Your BuyOps Account',
    body: (data: any, recipient: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Login Detected</h2>
        <p>We noticed a successful login to your BuyOps account from a new device.</p>
        <p><strong>Device:</strong> ${data.device || 'Unknown'}<br/>
           <strong>Location:</strong> ${data.location || 'Unknown'}<br/>
           <strong>Time:</strong> ${data.timestamp || new Date().toLocaleString()}</p>
        <p>If this was you, no action is required.</p>
        <p>If you do not recognise this activity, please reset your password immediately or contact support.</p>
        <p>Your security matters to us.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
  },

  // ════════════════════════════════════════════════════════════════════════
  // A3. ASSET PUBLISHED
  // ════════════════════════════════════════════════════════════════════════
  ASSET_PUBLISHED: {
    subject: (data: any) => 'Asset Successfully Published',
    body: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Asset Successfully Published</h2>
        <p>This is to confirm that a new asset has been published on BuyOps.</p>
        <p><strong>Asset Name:</strong> ${data.assetName}<br/>
           <strong>Company:</strong> ${data.companyName}</p>
        <p>The asset is now available according to its visibility and distribution settings.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
  },

  // ════════════════════════════════════════════════════════════════════════
  // A4. ASSET UPDATED
  // ════════════════════════════════════════════════════════════════════════
  ASSET_UPDATED: {
    subject: () => 'Asset Information Updated',
    body: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Asset Information Updated</h2>
        <p>An asset on BuyOps has been updated.</p>
        <p><strong>Asset Name:</strong> ${data.assetName}<br/>
           <strong>Updated Fields:</strong> ${data.updatedFields}</p>
        <p>Please review the changes to ensure accuracy and alignment with current terms.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
  },

  // ════════════════════════════════════════════════════════════════════════
  // A5. LEAD ONBOARDING (NEW LEAD FROM INVESTOR)
  // ════════════════════════════════════════════════════════════════════════
  NEW_LEAD_FROM_INVESTOR: {
    subject: () => 'New Lead Assigned to You',
    body: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Lead Assigned to You</h2>
        <p>A new lead has been onboarded and assigned to you.</p>
        <p><strong>Lead Name:</strong> ${data.leadName}<br/>
           <strong>Asset Interest:</strong> ${data.assetName}<br/>
           <strong>Budget:</strong> ₦${(data.budget || 0).toLocaleString()}</p>
        <p>Please follow up promptly to progress the opportunity.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
  },

  // ════════════════════════════════════════════════════════════════════════
  // A6. LEAD ASSIGNED TO CLUSTER
  // ════════════════════════════════════════════════════════════════════════
  LEAD_ASSIGNED_TO_CLUSTER: {
    subject: () => 'Lead Assigned to Your Cluster',
    body: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Lead Assigned to Your Cluster</h2>
        <p>A lead has been assigned to your cluster.</p>
        <p><strong>Lead Name:</strong> ${data.leadName}<br/>
           <strong>Assigned Cluster:</strong> ${data.clusterName}</p>
        <p>Kindly coordinate follow-up with your team.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
  },

  // ════════════════════════════════════════════════════════════════════════
  // A7. LEAD AVAILABLE TO ALL CLUSTERS
  // ════════════════════════════════════════════════════════════════════════
  LEAD_AVAILABLE_TO_ALL: {
    subject: () => 'New Lead Available',
    body: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Lead Available</h2>
        <p>A new lead has been made available to all clusters.</p>
        <p><strong>Lead Name:</strong> ${data.leadName}<br/>
           <strong>Asset Interest:</strong> ${data.assetName}</p>
        <p>Agents may engage based on availability and fit.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
  },

  // ════════════════════════════════════════════════════════════════════════
  // A8. DEAL CREATED
  // ════════════════════════════════════════════════════════════════════════
  DEAL_CREATED: {
    subject: () => 'New Deal Created',
    body: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Deal Created</h2>
        <p>A new deal has been created on BuyOps.</p>
        <p><strong>Deal ID:</strong> ${data.dealId}<br/>
           <strong>Agent:</strong> ${data.agentName}<br/>
           <strong>Asset:</strong> ${data.assetName}</p>
        <p>This notification is for administrative oversight.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
  },

  // ════════════════════════════════════════════════════════════════════════
  // A9. DEAL PAYMENT READY
  // ════════════════════════════════════════════════════════════════════════
  DEAL_PAYMENT_READY: {
    subject: () => 'Deal Ready for Payment Processing',
    body: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Deal Ready for Payment Processing</h2>
        <p>A deal has been marked as Payment Ready.</p>
        <p><strong>Deal ID:</strong> ${data.dealId}<br/>
           <strong>Amount:</strong> ₦${(data.amount || 0).toLocaleString()}<br/>
           <strong>Payment Type:</strong> ${data.paymentType}</p>
        <p>Please proceed with payment verification and processing.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
  },

  // ════════════════════════════════════════════════════════════════════════
  // A10. DEAL CLOSED
  // ════════════════════════════════════════════════════════════════════════
  DEAL_CLOSED: {
    subject: () => 'Deal Successfully Closed',
    body: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Deal Successfully Closed</h2>
        <p>A deal has been successfully closed.</p>
        <p><strong>Deal ID:</strong> ${data.dealId}<br/>
           <strong>Asset:</strong> ${data.assetName}<br/>
           <strong>Commission Status:</strong> ${data.commissionStatus}</p>
        <p>This transaction will now reflect in reporting and commissions.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
  },

  // ════════════════════════════════════════════════════════════════════════
  // A11. INSTALLMENT DUE
  // ════════════════════════════════════════════════════════════════════════
  INSTALLMENT_DUE: {
    subject: () => 'Upcoming Installment Payment Due',
    body: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Upcoming Installment Payment Due</h2>
        <p>This is a reminder that an installment payment is due.</p>
        <p><strong>Amount Due:</strong> ₦${(data.amount || 0).toLocaleString()}<br/>
           <strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString()}</p>
        <p>Please ensure payment is completed on or before the due date to avoid penalties.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
  },

  // ════════════════════════════════════════════════════════════════════════
  // A12. INSTALLMENT OVERDUE
  // ════════════════════════════════════════════════════════════════════════
  INSTALLMENT_OVERDUE: {
    subject: () => 'Overdue Installment Payment',
    body: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Overdue Installment Payment</h2>
        <p>Your installment payment is now overdue.</p>
        <p><strong>Amount:</strong> ₦${(data.amount || 0).toLocaleString()}<br/>
           <strong>Original Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString()}</p>
        <p style="color: #e53e3e;">Please make payment as soon as possible or contact support if you need assistance.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
  },

  // ════════════════════════════════════════════════════════════════════════
  // A13. PAYMENT RECEIVED
  // ════════════════════════════════════════════════════════════════════════
  PAYMENT_RECEIVED: {
    subject: () => 'Payment Received Confirmation',
    body: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payment Received Confirmation</h2>
        <p>We confirm receipt of your recent payment.</p>
        <p><strong>Amount:</strong> ₦${(data.amount || 0).toLocaleString()}<br/>
           <strong>Transaction Reference:</strong> ${data.reference}</p>
        <p>Thank you for your payment.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
  },

  // ════════════════════════════════════════════════════════════════════════
  // A14. INSTALLMENT PLAN COMPLETED
  // ════════════════════════════════════════════════════════════════════════
  INSTALLMENT_COMPLETED: {
    subject: () => 'Installment Plan Completed',
    body: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Installment Plan Completed</h2>
        <p>Congratulations! Your installment payment plan has been fully completed.</p>
        <p><strong>Asset:</strong> ${data.assetName}<br/>
           <strong>Total Paid:</strong> ₦${(data.totalPaid || 0).toLocaleString()}</p>
        <p>Thank you for completing your investment journey with BuyOps.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
  },
};
