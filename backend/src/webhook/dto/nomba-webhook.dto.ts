export class NombaWebhookDto {
  eventId: string;
  eventType: 'account.payment.success' | 'account.payment.failed';
  createdAt: string;
  data: {
    amount: number;
    currency: string;
    transactionReference: string;
    paymentReference: string;
    orderId?: string;
    accountNumber: string;
    bankName: string;
    narration: string;
    settlementAmount: number;
    fee: number;
  };
}