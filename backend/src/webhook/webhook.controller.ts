import { Controller, Post, Body, Headers, HttpCode, HttpStatus, Logger } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  
  @Post('nomba')
  @HttpCode(HttpStatus.OK)
  async handleNombaWebhook(
    @Body() payload: any,
    @Headers('nomba-signature') signature: string, 
  ) {
    this.logger.log(`Payload received: ${JSON.stringify(payload)}`);
    return { received: true };
  }
}