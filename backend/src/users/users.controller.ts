import { Controller, Get, Patch, Request, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateBankDetailsDto } from './dto/update-bank-details.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/groups')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user groups with membership details' })
  async getMyGroups(@Request() req) {
    return await this.usersService.getUserGroups(req.user.id);
  }

  @Get('me/transactions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user transactions' })
  async getMyTransactions(@Request() req) {
    return await this.usersService.getUserTransactions(req.user.id);
  }

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