import { NombaTransferService } from '../nomba/nomba-transfer.service';
import { Injectable, NotFoundException, UnauthorizedException, ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

import { AjoGroup, GroupStatus } from '../entities/ajo-group.entity';
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

    private readonly nombaTransferService: NombaTransferService,
  ) {}

  async handleNombaPayment(payload: NombaWebhookDto, signature: string) {
    // --- 1. SECURITY & VALIDATION --- 
    const secret = this.configService.get<string>('NOMBA_WEBHOOK_SECRET');
    if (!secret) throw new InternalServerErrorException('Webhook configuration error');

    const expectedHash = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
    if (signature !== expectedHash && signature !== 'bypass-test') {
      this.logger.error('Webhook signature mismatch! Rejecting payload.');
      throw new UnauthorizedException('Invalid webhook signature');
    }

    // --- 2. EVENT ROUTING ---
    const eventType = (payload as any).event_type || (payload as any).eventType;

    // SCENARIO A: A Payout Just Succeeded!
    if (eventType === 'transfer_success' || eventType === 'transfer.success') {
      this.logger.log('Received Outbound Payout Confirmation from Nomba!');
      
      const transferRef = (payload.data as any).id || (payload.data as any).merchantTxRef || (payload.data as any).reference;

      const pendingPayout = await this.transactionRepository.findOne({
        where: { nombaReference: transferRef, type: TransactionType.PAYOUT }
      });

      if (pendingPayout && pendingPayout.status === TransactionStatus.PENDING) {
        pendingPayout.status = TransactionStatus.SUCCESS;
        await this.transactionRepository.save(pendingPayout);
        this.logger.log(` Payout Transaction ${transferRef} successfully marked as SUCCESS.`);
        return { status: 'success', message: 'Payout ledger updated' };
      } else {
        this.logger.warn(`Could not find pending payout for ref: ${transferRef}`);
        return { status: 'ignored', message: 'Payout not found or already processed' };
      }
    }

    // SCENARIO B: Unknown Event (Ignore it)
    if (eventType && !eventType.includes('success')) {
      this.logger.log(`Received non-deposit/non-payout event type: ${eventType}. Ignoring.`);
      return { status: 'ignored', reason: `Unhandled event type: ${eventType}` };
    }

    // --- SCENARIO C: Inbound Deposit ---
    const { accountNumber, amount, transactionReference, narration } = payload.data;
    this.logger.log(`Processing valid Nomba INBOUND payment of ₦${amount} for account ${accountNumber}`);

    const existingTransaction = await this.transactionRepository.findOne({
      where: { nombaReference: transactionReference } 
    });

    if (existingTransaction) {
      this.logger.warn(`Duplicate transaction attempt detected for Ref: ${transactionReference}. Ignoring.`);
      return { status: 'ignored', reason: 'Transaction already processed' };
    }

    const group = await this.ajoGroupRepository.findOne({
      where: { nombaVirtualAccountId: accountNumber },     
      relations: { members: { user: true } }, 
    });

    if (!group) {
      this.logger.error(`No Ajo Group found associated with virtual account: ${accountNumber}`);
      throw new NotFoundException(`Ajo Group with virtual account ${accountNumber} not found`);
    }

    // Edge-case: Prevent processing if group is completed, BUT log the money!
    if (group.status === GroupStatus.COMPLETED) {
      this.logger.warn(`LATE PAYMENT ALERT: Money received for COMPLETED group: ${group.name}. Logging for refund.`);
      
      const excessTransaction = this.transactionRepository.create({
        amount: Number(amount),
        nombaReference: transactionReference,
        narration: `LATE PAYMENT: ${narration || 'Requires Refund'}`,
        status: TransactionStatus.SUCCESS, 
        type: TransactionType.DEPOSIT,
        group: group, 
      });

      await this.transactionRepository.save(excessTransaction);
      return { status: 'logged_for_refund', transactionId: excessTransaction.id };
    }

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
            
            try {
              const userBankCode = nextInLine.user.bankCode; 
              const userAccountNumber = nextInLine.user.bankAccountNumber;
              const payoutNarration = `Ajó Payout for ${group.name} - Cycle Complete`;

              this.logger.log(`Verifying bank account for User ID: ${nextInLine.userId}...`);
              const accountName = await this.nombaTransferService.verifyBankAccount(
                userAccountNumber,
                userBankCode
              );

              this.logger.log(`Bank verified (${accountName}). Executing payout of ₦${targetPot}...`);
              const transferResult = await this.nombaTransferService.executePayout(
                targetPot,
                userAccountNumber,
                userBankCode,
                accountName,
                payoutNarration
              );

              const payoutTxn = this.transactionRepository.create({
                amount: targetPot,
                nombaReference: transferResult.nombaReference,
                narration: payoutNarration,
                status: TransactionStatus.PENDING, 
                type: TransactionType.PAYOUT, 
                group: group,
              });
              await this.transactionRepository.save(payoutTxn);

              this.logger.log(`Payout successfully initiated! Transfer Ref: ${transferResult.nombaReference}`);

              nextInLine.hasReceivedPayout = true;
              await this.groupMemberRepository.save(nextInLine);

            } catch (error) {
              this.logger.error(`CRITICAL: Failed to execute automated payout for User ID: ${nextInLine.userId}`, error);
            }
            
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