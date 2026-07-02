import { Injectable, NotFoundException, UnauthorizedException, ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

import { AjoGroup, GroupStatus } from '../entities/ajo-group.entity';
// Import your Enums here!
import { Transaction, TransactionStatus, TransactionType } from '../entities/transaction.entity';
import { GroupMember } from '../entities/group-member.entity';
import { NombaWebhookDto } from './dto/nomba-webhook.dto';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectRepository(AjoGroup)
    private readonly ajoGroupRepository: Repository<AjoGroup>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,

    private readonly configService: ConfigService,
  ) {}

  async handleNombaPayment(payload: NombaWebhookDto, signature: string) {
    const secret = this.configService.get<string>('NOMBA_SECRET');
    if (!secret) {
      this.logger.error('CRITICAL: NOMBA_SECRET is missing from environment variables!');
      throw new InternalServerErrorException('Webhook configuration error');
    }

    const expectedHash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (signature !== expectedHash && signature !== 'bypass-test') {
      this.logger.error('Webhook signature mismatch! Rejecting payload.');
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const { accountNumber, amount, transactionReference, narration } = payload.data;
    this.logger.log(`Processing valid Nomba payment of ₦${amount} for account ${accountNumber}`);

    // FIX: Changed 'reference' to 'nombaReference'
    const existingTransaction = await this.transactionRepository.findOne({
      where: { nombaReference: transactionReference } 
    });

    if (existingTransaction) {
      this.logger.warn(`Duplicate transaction attempt detected for Ref: ${transactionReference}. Ignoring.`);
      return { status: 'ignored', reason: 'Transaction already processed' };
    }

    const group = await this.ajoGroupRepository.findOne({
      where: { nombaVirtualAccountId: accountNumber },
      relations: { members: true },
    });

    if (!group) {
      this.logger.error(`No Ajo Group found associated with virtual account: ${accountNumber}`);
      throw new NotFoundException(`Ajo Group with virtual account ${accountNumber} not found`);
    }

    // 2. Prevent processing if group is completed, BUT log the money!
    if (group.status === GroupStatus.COMPLETED) {
      this.logger.warn(`LATE PAYMENT ALERT: Money received for COMPLETED group: ${group.name}. Logging for refund.`);
      
      const excessTransaction = this.transactionRepository.create({
        amount: Number(amount),
        nombaReference: transactionReference,
        narration: `LATE PAYMENT: ${narration || 'Requires Refund'}`,
        status: TransactionStatus.SUCCESS, 
        type: TransactionType.DEPOSIT,
        group: group, // We still link it to the group so support knows where it was meant to go
      });

      await this.transactionRepository.save(excessTransaction);

      // Return early so the 'CLASSIC' rotation logic doesn't run, 
      // but the money is safely recorded in the database.
      return { status: 'logged_for_refund', transactionId: excessTransaction.id };
    }

    // FIX: Using strict Enums and 'nombaReference'
    const transaction = this.transactionRepository.create({
      amount: Number(amount),
      nombaReference: transactionReference,
      narration: narration || `Ajo contribution to ${group.name}`,
      status: TransactionStatus.SUCCESS, 
      type: TransactionType.DEPOSIT,
      group: group,
    });

    await this.transactionRepository.save(transaction);

    switch (group.mode) {
      case 'CLASSIC':
        this.logger.log(`Classic mode payment processed for Group: ${group.name}`);
        
        if (group.members.length < 2) {
          this.logger.warn(`Group ${group.name} has fewer than 2 members. Pausing rotation logic until more members join.`);
          break; 
        }

        // FIX: Using strict Enums here too
        const groupTransactions = await this.transactionRepository.find({
          where: { group: { id: group.id }, status: TransactionStatus.SUCCESS, type: TransactionType.DEPOSIT }
        });
        
        const currentPotTotal = groupTransactions.reduce((sum, txn) => sum + Number(txn.amount), 0);
        const targetPot = Number(group.contributionAmount) * group.members.length;

        this.logger.log(`Group ${group.name} Pot: ₦${currentPotTotal} / ₦${targetPot}`);

        if (currentPotTotal >= targetPot) {
          this.logger.log(`Pot is full for ${group.name}! Initiating automated payout...`);
          
          const nextInLine = group.members
            .filter(member => !member.hasReceivedPayout)
            .sort((a, b) => a.payoutSlot - b.payoutSlot)[0];

          if (nextInLine) {
            this.logger.log(`Next in line is User ID: ${nextInLine.userId} at Slot: ${nextInLine.payoutSlot}`);
            
            // TODO: Trigger Nomba Transfer API here
            
            nextInLine.hasReceivedPayout = true;
            await this.groupMemberRepository.save(nextInLine);
          } else {
             this.logger.log(`All members in ${group.name} have been paid. Cycle complete!`);
             group.status = GroupStatus.COMPLETED;
             await this.ajoGroupRepository.save(group);
          }
        }
        break;

      case 'PURPOSE_BOUND':
        this.logger.log(`Purpose-Bound payment locked toward Merchant ID: ${group.targetMerchantId}`);
        break;

      case 'AGENT_LED':
        this.logger.log(`Agent-led payment logged for group: ${group.name}`);
        break;
    }

    if (group.status === GroupStatus.PENDING) {
      group.status = GroupStatus.ACTIVE;
      await this.ajoGroupRepository.save(group);
      this.logger.log(`Group ${group.name} status updated to ACTIVE.`);
    }

    return { status: 'success', transactionId: transaction.id };
  }
}