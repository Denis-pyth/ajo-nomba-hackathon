import { Controller, Patch, Request, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateBankDetailsDto } from './dto/update-bank-details.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

@ApiTags('Users')
@Controller('users') 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile/bank')
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Update User Bank Details for Payouts' })
  async updateBankDetails(
    @Request() req, 
    @Body() dto: UpdateBankDetailsDto
  ) {
   
    return await this.usersService.updateBankDetails(req.user.id, dto.bankCode, dto.bankAccountNumber);
  }
}