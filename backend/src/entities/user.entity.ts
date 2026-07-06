 import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { GroupMember } from './group-member.entity';
import { Transaction } from './transaction.entity'; // <-- 1. Add this import

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  // --- BANKING DETAILS REQUIRED FOR PAYOUTS ---
  @Column({ nullable: true })
  bankCode: string;

  @Column({ nullable: true })
  bankAccountNumber: string;
  // --------------------------------------------

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => GroupMember, (member) => member.user)
  groupMemberships: GroupMember[];

  // <-- 2. Add this block right here
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}