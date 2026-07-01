import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { AjoGroup } from './ajo-group.entity';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  PAYOUT = 'PAYOUT',
  MERCHANT_DISBURSEMENT = 'MERCHANT_DISBURSEMENT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AjoGroup, (group) => group.transactions, { nullable: true })
  @JoinColumn({ name: 'groupId' })
  group: AjoGroup;

  @Column({ nullable: true })
  groupId: string;

  @ManyToOne(() => User, (user) => user.transactions, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ unique: true, nullable: true })
  nombaReference: string;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @CreateDateColumn()
  createdAt: Date;
}