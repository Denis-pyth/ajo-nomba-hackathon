import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
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

  // The missing 'amount' column
  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  // Syncing the name with your service logic
  @Column({ unique: true })
  nombaReference: string;

  // The missing 'narration' column
  @Column({ nullable: true })
  narration: string;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @ManyToOne(() => AjoGroup, (group) => group.transactions)
  group: AjoGroup;

  @ManyToOne(() => User, (user) => user.transactions, { nullable: true })
  user: User;
}