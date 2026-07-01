import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { GroupMember } from './group-member.entity';
import { Transaction } from './transaction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ default: false })
  isOfflineUser: boolean;

  @Column({ default: 100 })
  trustScore: number;

  @Column({ nullable: true })
  nombaCustomerId: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @OneToMany(() => GroupMember, (member) => member.user)
  groupMemberships: GroupMember[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}