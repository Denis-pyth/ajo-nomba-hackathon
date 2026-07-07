import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { AjoGroup } from './ajo-group.entity';
import { User } from './user.entity';

// Strict Enums to match your Webhook Service
export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  PAYOUT = 'PAYOUT',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ unique: true })
  nombaReference: string;

  @Column({ nullable: true })
  narration: string;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  // NEW: Store raw Nomba webhook payloads for audit/reconciliation
  @Column({ type: 'jsonb', nullable: true })
  metaData: any;

  @CreateDateColumn()
  createdAt: Date;

  // NEW: Track when a PENDING transaction updates to SUCCESS
  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => AjoGroup, (group) => group.transactions)
  group: AjoGroup;

  @ManyToOne(() => User, (user) => user.transactions, { nullable: true })
  user: User;
}