import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { AjoGroup } from './ajo-group.entity';

@Entity('group_members')
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.groupMemberships)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => AjoGroup, (group) => group.members)
  @JoinColumn({ name: 'groupId' })
  group: AjoGroup;

  @Column()
  groupId: string;

  @Column({ type: 'int', nullable: true })
  payoutSlot: number;

  @Column({ default: false })
  hasReceivedPayout: boolean;

  @Column({ type: 'int', nullable: true })
  swapRequestedWithSlot: number;

  @CreateDateColumn()
  joinedAt: Date;
}