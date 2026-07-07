import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity'; // Matching your visible file tree

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateBankDetails(userId: string, bankCode: string, bankAccountNumber: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.bankCode = bankCode;
    user.bankAccountNumber = bankAccountNumber;

    await this.userRepository.save(user);

    return {
      message: 'Bank details updated successfully',
      bankCode: user.bankCode,
      bankAccountNumber: user.bankAccountNumber
    };
  }

  async getUserGroups(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { groupMemberships: { group: { members: true } } },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.groupMemberships.map((membership) => ({
      ...membership.group,
      memberCount: membership.group.members?.length || 0,
      mySlot: membership.payoutSlot,
      hasReceivedPayout: membership.hasReceivedPayout,
      joinedAt: membership.joinedAt,
    }));
  }

  async getUserTransactions(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { transactions: { group: true } },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.transactions.map((t) => ({
      id: t.id,
      amount: t.amount,
      nombaReference: t.nombaReference,
      status: t.status,
      type: t.type,
      narration: t.narration,
      createdAt: t.createdAt,
      groupName: t.group?.name || null,
    }));
  }
}