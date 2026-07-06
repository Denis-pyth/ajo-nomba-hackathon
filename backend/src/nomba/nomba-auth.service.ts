import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NombaAuthService {
  private readonly logger = new Logger(NombaAuthService.name);
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(private configService: ConfigService) {}

  async getToken(): Promise<string> {
    // Return cached token if it's still valid (leaving a 5-minute safety buffer)
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const baseUrl = this.configService.get<string>('NOMBA_API_BASE_URL');
    const clientId = this.configService.get<string>('NOMBA_CLIENT_ID');
    const secret = this.configService.get<string>('NOMBA_SECRET');
    const accountId = this.configService.get<string>('NOMBA_ACCOUNT_ID');

    this.logger.log('Fetching new Nomba Access Token...');

    try {
      const response = await fetch(`${baseUrl}/v1/auth/token/issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accountId': this.configService.get<string>('NOMBA_ACCOUNT_ID')!, // Parent Account ID
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: secret,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Auth failed: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      
      this.accessToken = data.data.access_token;
      // Nomba token expires in 1800s (30 mins). Buffer by 5 mins (300000ms)
      this.tokenExpiresAt = Date.now() + (data.data.expires_in * 1000) - 300000;
      
      this.logger.log('Nomba Access Token acquired successfully.');

      return this.accessToken!;
      
    } catch (error) {
      this.logger.error('Failed to get Nomba Auth Token', error);
      throw new InternalServerErrorException('Payment gateway authentication failed');
    }
  }
}