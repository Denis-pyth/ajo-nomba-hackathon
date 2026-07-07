export class NombaWebhookDto {
  eventId?: string;

  // Nomba fires multiple event types across the deposit + payout lifecycle
  // (e.g. 'account.payment.success', 'transfer_success' / 'transfer.success').
  // Some payloads use camelCase, some snake_case — accept both.
  eventType?: string;
  event_type?: string;

  createdAt?: string;

  data: {
    // --- Inbound deposit fields ---
    amount?: number;
    currency?: string;
    transactionReference?: string;
    paymentReference?: string;
    orderId?: string;
    accountNumber?: string;
    bankName?: string;
    narration?: string;
    settlementAmount?: number;
    fee?: number;

    // --- Outbound transfer confirmation fields ---
    id?: string;
    merchantTxRef?: string;
    reference?: string;
  };
}
