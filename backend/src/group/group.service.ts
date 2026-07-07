import { Injectable, NotFoundException, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AjoGroup } from '../entities/ajo-group.entity';
import { GroupMember } from '../entities/group-member.entity';
import { User } from '../entities/user.entity';
import { Transaction } from '../entities/transaction.entity'; 
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { NombaVirtualAccountService } from '../nomba/nomba-virtual-account.service';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  constructor(
    @InjectRepository(AjoGroup) private ajoGroupRepo: Repository<AjoGroup>,
    @InjectRepository(GroupMember) private groupMemberRepo: Repository<GroupMember>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>, // <-- Injected for CSV Generation
    private readonly nombaVirtualAccountService: NombaVirtualAccountService,
  ) {}

  async createGroup(dto: CreateGroupDto) {    
    this.logger.log(`Initiating real Virtual Account creation for Group: ${dto.name}`);
    
    let virtualAccountData: any;
    
    try {
      // 1. Call Nomba to generate a real, live NIBSS bank account for this group
      // Passed without special characters to maintain clean validation formats upstream
      virtualAccountData = await this.nombaVirtualAccountService.createVirtualAccount(
        `Ajo ${dto.name}`
      );
    } catch (error: any) {
      this.logger.error(`Nomba Virtual Account generation failed: ${error.message}`);
      throw new InternalServerErrorException(error.message || 'Could not generate deposit account');
    }

    // Safety guard to guarantee the account token mapping contains the correct key
    if (!virtualAccountData || !virtualAccountData.bankAccountNumber) {
      this.logger.error(`Nomba returned success but bankAccountNumber field was empty: ${JSON.stringify(virtualAccountData)}`);
      throw new BadRequestException('Could not extract bank account fields from payment provider');
    }

    // 2. Save the group with the REAL bankAccountNumber returned from Nomba
    const group = this.ajoGroupRepo.create({
      ...dto,
      nombaVirtualAccountId: virtualAccountData.bankAccountNumber, // <-- FIX APPLIED
    });

    const savedGroup = await this.ajoGroupRepo.save(group);
    
    this.logger.log(`Group ${savedGroup.name} successfully created with Account Number: ${savedGroup.nombaVirtualAccountId}`);
    
    return savedGroup;
  }

  async joinGroup(groupId: string, dto: JoinGroupDto) {
    const group = await this.ajoGroupRepo.findOne({ where: { id: groupId }, relations: { members: true } });
    if (!group) throw new NotFoundException('Group not found');

    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    // Prevent double-joining
    const alreadyJoined = group.members.some(m => m.userId === user.id);
    if (alreadyJoined) throw new BadRequestException('User is already in this group');

    // Fastest-Finger Logic: slot is based on how many people are already in the group
    const nextAvailableSlot = group.members.length + 1;

    const membership = this.groupMemberRepo.create({
      group,
      user,
      payoutSlot: nextAvailableSlot,
    });

    return await this.groupMemberRepo.save(membership);
  }

  async getAllGroups() {
    return await this.ajoGroupRepo.find({ relations: { members: true } });
  }

  // =========================================================================
  // NEW: INFRASTRUCTURE TRACK REQUIREMENTS
  // =========================================================================

  /**
   * Utility to find a group by ID (Used by the controller for reconciliation)
   */
  async findById(groupId: string) {
    const group = await this.ajoGroupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  /**
   * Closes the Ajo Group and expires the Nomba VA
   */
  async closeGroup(groupId: string) {
    const group = await this.ajoGroupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Group not found');

    // 1. Tell Nomba to expire the account to prevent zombie payments
    await this.nombaVirtualAccountService.expireVirtualAccount(group.nombaVirtualAccountId);

    // 2. Update local DB state
    (group as any).status = 'COMPLETED'; // Assuming a status column exists
    
    const savedGroup = await this.ajoGroupRepo.save(group);
    this.logger.log(`Group ${savedGroup.id} closed and VA expired.`);
    
    return savedGroup;
  }

  /**
   * Fetches and formats transaction history into a CSV string for Customer Statements
   */
  async generateGroupStatementCsv(groupId: string): Promise<string> {
    // Fetch transactions ordered by date
    const transactions = await this.transactionRepo.find({
      where: { group: { id: groupId } },
      relations: { user: true }, 
      order: { createdAt: 'DESC' },
    });

    // Create CSV Headers
    let csv = 'Date,Reference,User,Type,Amount(NGN),Status\n';

    // Map data to CSV rows
    transactions.forEach((tx) => {
      const date = tx.createdAt ? tx.createdAt.toISOString() : new Date().toISOString();
      const user = tx.user ? tx.user.fullName : 'System';
      const amount = tx.amount; 
      
      csv += `${date},${tx.nombaReference || 'N/A'},${user},${tx.type || 'DEPOSIT'},${amount},${tx.status || 'SUCCESS'}\n`;
    });

    this.logger.log(`Generated CSV statement for group ${groupId}`);
    return csv;
  }
}