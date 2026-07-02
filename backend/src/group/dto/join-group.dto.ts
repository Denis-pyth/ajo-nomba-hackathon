import { ApiProperty } from '@nestjs/swagger';

export class JoinGroupDto {
  @ApiProperty({ example: 'uuid-of-the-user', description: 'The ID of the user joining the group' })
  userId: string;
}