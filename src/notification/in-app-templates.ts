export function getInAppTemplate(type: string, data: any): { title: string; message: string } {
  switch (type) {
    case 'deal_created':
      return {
        title: 'New Deal Created',
        message: `A new deal for "${data.assetName || 'an asset'}" worth ₦${(data.totalAmount || 0).toLocaleString()} has been created.`,
      };
    case 'payment_ready':
      return {
        title: 'Payment Due',
        message: `Your next installment of ₦${(data.installmentAmount || 0).toLocaleString()} is due on ${data.dueDate || 'the next due date'}.`,
      };
    case 'deal_closed':
      return {
        title: 'Deal Closed',
        message: `The deal for "${data.assetName || 'an asset'}" has been successfully closed.`,
      };
    default:
      return {
        title: 'Notification',
        message: data.message || 'You have a new notification.',
      };
  }
}
