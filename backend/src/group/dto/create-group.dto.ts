import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GroupMode, CycleFrequency } from '../../entities/ajo-group.entity';

export class CreateGroupDto {
  @ApiProperty({ example: 'MacBook Pro Savings', description: 'Name of the Ajo group' })
  name: string;

  // Added the enum array explicitly so Swagger builds a dropdown menu
  @ApiProperty({ enum: [GroupMode.CLASSIC, GroupMode.PURPOSE_BOUND, GroupMode.AGENT_LED], example: GroupMode.CLASSIC })
  mode: GroupMode;

  @ApiProperty({ example: 50000, description: 'Amount each member pays per cycle' })
  contributionAmount: number;

  // Added the enum array explicitly here too
  @ApiProperty({ enum: [CycleFrequency.WEEKLY, CycleFrequency.MONTHLY], example: CycleFrequency.WEEKLY })
  cycleFrequency: CycleFrequency;

  @ApiPropertyOptional({ example: 'MERCH_999', description: 'Required only for PURPOSE_BOUND mode' })
  targetMerchantId?: string;
}