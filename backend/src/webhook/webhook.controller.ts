import { Controller, Post, Body, Headers, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { NombaWebhookDto } from './dto/nomba-webhook.dto';

@ApiTags('Nomba Webhooks') 
@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  
  constructor(private readonly webhookService: WebhookService) {}

  @Post('nomba')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Receive Nomba Payment Webhooks', 
    description: 'Catches successful payment payloads from the Nomba API and triggers the Ajo rotation logic.' 
  })
  @ApiHeader({ 
    name: 'nomba-signature', 
    description: 'Hash signature for webhook security verification', 
    required: true 
  })
  @ApiHeader({ 
    name: 'nomba-signature-algorithm', 
    description: 'Algorithm used for signing, expected to be HmacSHA256', 
    required: false 
  })
  @ApiResponse({ status: 200, description: 'Webhook successfully received and processed.' })
  async handleNombaWebhook(
    @Body() payload: NombaWebhookDto,
    @Headers('nomba-signature') signature: string,
    @Headers('nomba-signature-algorithm') algorithm: string,
  ) {
    this.logger.log(`Incoming Nomba Webhook Payload...`);
    
    // Pass the payload and the signature to the service for SHA-256 verification
    return await this.webhookService.handleNombaPayment(payload, signature || '');
  }
}