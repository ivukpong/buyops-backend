export function getSmsTemplate(type: string, data: any): string {
  switch (type) {
    case 'deal_created':
      return `BuyOps: A new deal for ${data.assetName || 'an asset'} has been created. Amount: ₦${(data.totalAmount || 0).toLocaleString()}`;
    case 'payment_ready':
      return `BuyOps: Payment of ₦${(data.installmentAmount || 0).toLocaleString()} is due on ${data.dueDate || 'the next due date'}.`;
    case 'deal_closed':
      return `BuyOps: The deal for ${data.assetName || 'an asset'} has been closed successfully.`;
    default:
      return `BuyOps Notification: ${data.message || 'You have a new notification.'}`;
  }
}
