import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NombaAuthService } from './nomba-auth.service';

@Injectable()
export class NombaVirtualAccountService {
  private readonly logger = new Logger(NombaVirtualAccountService.name);

  constructor(
    private configService: ConfigService,
    private nombaAuthService: NombaAuthService,
  ) {}

  async createVirtualAccount(accountName: string, bvn?: string) {
    const baseUrl = this.configService.get<string>('NOMBA_API_BASE_URL');
    
    // Grab BOTH IDs
    const parentAccountId = this.configService.get<string>('NOMBA_ACCOUNT_ID')!;
    const subAccountId = this.configService.get<string>('NOMBA_SUB_ACCOUNT_ID')!;
    
    // Generate a unique reference for idempotency
    const accountRef = `ajo-va-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const token = await this.nombaAuthService.getToken();

    // 1. Sanitize the account name (Nomba strictly allows only letters, numbers, and spaces)
    const sanitizedName = accountName.replace(/[^a-zA-Z0-9 ]/g, "").trim();

    this.logger.log(`Creating virtual account for: ${sanitizedName} on Sub-Account: ${subAccountId}`);

    try {
      const response = await fetch(`${baseUrl}/v1/accounts/virtual/${subAccountId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'accountId': parentAccountId 
        },
        body: JSON.stringify({
          accountRef: accountRef,
          accountName: sanitizedName,
          bvn: bvn || '22222222222', // Standard sandbox test BVN
        }),
      });

      const rawData = await response.json();
      
      // Log the exact response from Nomba for visibility
      this.logger.log(`Nomba Raw Response: ${JSON.stringify(rawData)}`);

      // 2. Catch Nomba's internal validation errors even if HTTP status is 200
      if (!response.ok || rawData.status === false || rawData.code === '400') {
        throw new Error(`VA Creation failed: ${rawData.message || rawData.description}`);
      }

      // Safely return the account details
      return rawData.data || rawData; 

    } catch (error: any) {
      this.logger.error('Failed to create Nomba Virtual Account', error);
      throw new InternalServerErrorException(error.message || 'Could not generate deposit account');
    }
  }

  // =========================================================================
  // NEW: EXPIRE VIRTUAL ACCOUNT (For when the Ajo Group finishes)
  // =========================================================================
  async expireVirtualAccount(identifier: string) {
    const baseUrl = this.configService.get<string>('NOMBA_API_BASE_URL');
    const parentAccountId = this.configService.get<string>('NOMBA_ACCOUNT_ID')!;
    const token = await this.nombaAuthService.getToken();

    this.logger.log(`Expiring virtual account: ${identifier}`);

    try {
      const response = await fetch(`${baseUrl}/v1/accounts/virtual/${identifier}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'accountId': parentAccountId 
        },
      });

      const rawData = await response.json();
      
      this.logger.log(`Nomba VA Expiry Raw Response: ${JSON.stringify(rawData)}`);

      if (!response.ok || rawData.status === false || rawData.code === '400') {
        throw new Error(`VA Expiry failed: ${rawData.message || rawData.description}`);
      }

      return rawData.data || rawData; 

    } catch (error: any) {
      this.logger.error(`Failed to expire Nomba Virtual Account ${identifier}`, error);
      throw new InternalServerErrorException(error.message || 'Could not expire virtual account');
    }
  }

  // =========================================================================
  // NEW: RECONCILE INFLOWS (Fallback Transactions API to check for missed webhooks)
  // =========================================================================
  async reconcileAccountInflows() {
    const baseUrl = this.configService.get<string>('NOMBA_API_BASE_URL');
    const parentAccountId = this.configService.get<string>('NOMBA_ACCOUNT_ID')!;
    // Using the same subAccountId we used to create it
    const subAccountId = this.configService.get<string>('NOMBA_SUB_ACCOUNT_ID')!; 
    const token = await this.nombaAuthService.getToken();

    this.logger.log(`Reconciling transactions for Sub-Account: ${subAccountId}`);

    try {
      const response = await fetch(`${baseUrl}/v1/transactions/accounts/${subAccountId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'accountId': parentAccountId 
        },
      });

      const rawData = await response.json();

      if (!response.ok || rawData.status === false || rawData.code === '400') {
        throw new Error(`Transactions fetch failed: ${rawData.message || rawData.description}`);
      }

      return rawData.data || rawData; 

    } catch (error: any) {
      this.logger.error('Failed to reconcile Nomba Transactions', error);
      throw new InternalServerErrorException(error.message || 'Could not fetch transactions');
    }
  }
}