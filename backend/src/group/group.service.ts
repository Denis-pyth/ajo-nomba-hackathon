import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AjoGroup } from '../entities/ajo-group.entity';
import { GroupMember } from '../entities/group-member.entity';
import { User } from '../entities/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(AjoGroup) private ajoGroupRepo: Repository<AjoGroup>,
    @InjectRepository(GroupMember) private groupMemberRepo: Repository<GroupMember>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async createGroup(dto: CreateGroupDto) {
    // Hackathon Trick: We generate a mock 10-digit Nomba account number here.
    // For production, you would call Nomba's "Create Virtual Account" API here instead.
    const mockVirtualAccount = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const group = this.ajoGroupRepo.create({
      ...dto,
      nombaVirtualAccountId: mockVirtualAccount,
    });

    return await this.ajoGroupRepo.save(group);
  }

  async joinGroup(groupId: string, dto: JoinGroupDto) {
   const group = await this.ajoGroupRepo.findOne({ where: { id: groupId }, relations: { members: true } });
    if (!group) throw new NotFoundException('Group not found');

    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    // Prevent double-joining
    const alreadyJoined = group.members.some(m => m.userId === user.id);
    if (alreadyJoined) throw new BadRequestException('User is already in this group');

    // Fastest-Finger Logic: Your slot is based on how many people are already in the group
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
}