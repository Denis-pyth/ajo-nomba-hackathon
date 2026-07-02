import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Desire Denis' })
  fullName: string;

  @ApiProperty({ example: 'desire@example.com' })
  email: string;

  @ApiProperty({ example: 'securepassword123' })
  password: string;
}