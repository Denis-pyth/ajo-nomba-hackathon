import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { GroupMember } from './group-member.entity';
import { Transaction } from './transaction.entity';

export enum GroupMode {
  CLASSIC = 'CLASSIC',
  PURPOSE_BOUND = 'PURPOSE_BOUND',
  AGENT_LED = 'AGENT_LED',
}

export enum CycleFrequency {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum GroupStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

@Entity('ajo_groups')
export class AjoGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: GroupMode })
  mode: GroupMode;

  @Column('decimal', { precision: 12, scale: 2 })
  contributionAmount: number;

  @Column({ type: 'enum', enum: CycleFrequency })
  cycleFrequency: CycleFrequency;

  @Column({ nullable: true })
  nombaVirtualAccountId: string;

  @Column({ nullable: true })
  targetMerchantId: string;

  @Column({ type: 'enum', enum: GroupStatus, default: GroupStatus.PENDING })
  status: GroupStatus;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @OneToMany(() => GroupMember, (member) => member.group)
  members: GroupMember[];

  @OneToMany(() => Transaction, (transaction) => transaction.group)
  transactions: Transaction[];
}