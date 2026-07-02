import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'desire@example.com' })
  email: string;

  @ApiProperty({ example: 'securepassword123' })
  password: string;
}