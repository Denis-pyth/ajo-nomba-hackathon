import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

// Entities
import { AjoGroup } from '../entities/ajo-group.entity';
import { Transaction } from '../entities/transaction.entity';
import { GroupMember } from '../entities/group-member.entity';

@Module({
  imports: [
    // This provides the Repositories to the WebhookService
    TypeOrmModule.forFeature([AjoGroup, Transaction, GroupMember]),
  ],
  controllers: [WebhookController],
  providers: [WebhookService], // <-- This tells NestJS the Service exists!
  exports: [WebhookService],
})
export class WebhookModule {}