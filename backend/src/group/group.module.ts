import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { AjoGroup } from '../entities/ajo-group.entity';
import { GroupMember } from '../entities/group-member.entity';
import { User } from '../entities/user.entity';
import { NombaModule } from '../nomba/nomba.module';

@Module({
  imports: [TypeOrmModule.forFeature([AjoGroup, GroupMember, User]),
   NombaModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}