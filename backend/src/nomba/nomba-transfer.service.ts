import { Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NombaAuthService } from './nomba-auth.service';

@Injectable()
export class NombaTransferService {
  private readonly logger = new Logger(NombaTransferService.name);

  constructor(
    private configService: ConfigService,
    private nombaAuthService: NombaAuthService,
  ) {}

  async verifyBankAccount(accountNumber: string, bankCode: string) {
    const baseUrl = this.configService.get<string>('NOMBA_API_BASE_URL');
    const accountId = this.configService.get<string>('NOMBA_ACCOUNT_ID');
    const token = await this.nombaAuthService.getToken();

    try {
      const response = await fetch(`${baseUrl}/v1/transfers/bank/lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'accountId': this.configService.get<string>('NOMBA_ACCOUNT_ID')!,
        },
        body: JSON.stringify({ accountNumber, bankCode }),
      });

      if (!response.ok) throw new Error('Bank lookup failed');
      
      const data = await response.json();
      return data.data.accountName;
    } catch (error) {
      this.logger.error(`Account lookup failed for ${accountNumber} at ${bankCode}`, error);
      throw new BadRequestException('Invalid bank account details');
    }
  }

  async executePayout(amount: number, accountNumber: string, bankCode: string, accountName: string, narration: string) {
    const baseUrl = this.configService.get<string>('NOMBA_API_BASE_URL');
    const accountId = this.configService.get<string>('NOMBA_ACCOUNT_ID');
    const subAccountId = this.configService.get<string>('NOMBA_SUB_ACCOUNT_ID');
    
    // Unique reference for the transfer
    const merchantTxRef = `ajo-payout-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const token = await this.nombaAuthService.getToken();

    this.logger.log(`Initiating payout of ₦${amount} to ${accountName} (${accountNumber})`);

    try {
      // Note the v2 endpoint and subAccountId in the URL path
      const response = await fetch(`${baseUrl}/v2/transfers/bank/${subAccountId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'accountId': this.configService.get<string>('NOMBA_SUB_ACCOUNT_ID') || '', 
        },
        body: JSON.stringify({
          amount: amount,
          accountNumber: accountNumber,
          accountName: accountName,
          bankCode: bankCode,
          merchantTxRef: merchantTxRef,
          narration: narration,
          currency: 'NGN'
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Transfer failed: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return {
        status: 'PENDING',
        nombaReference: data.data.id,
        merchantTxRef: merchantTxRef
      };
    } catch (error) {
      this.logger.error('Payout execution failed', error);
      throw new InternalServerErrorException('Failed to process automated payout');
    }
  }
}