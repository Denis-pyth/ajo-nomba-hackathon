import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBankDetailsDto {
  @ApiProperty({ example: '058', description: 'The NIBSS Bank Code (e.g. GTBank is 058)' })
  @IsString()
  @IsNotEmpty()
  bankCode: string;

  @ApiProperty({ example: '0123456789', description: 'The 10-digit NUBAN account number' })
  @IsString()
  @IsNotEmpty()
  bankAccountNumber: string;
}