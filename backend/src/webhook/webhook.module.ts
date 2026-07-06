import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { AjoGroup } from '../entities/ajo-group.entity';
import { Transaction } from '../entities/transaction.entity';
import { GroupMember } from '../entities/group-member.entity';
import { ConfigModule } from '@nestjs/config';
import { NombaModule } from '../nomba/nomba.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([AjoGroup, Transaction, GroupMember]),
    ConfigModule,
    NombaModule, 
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}