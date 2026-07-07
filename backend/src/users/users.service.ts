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
}