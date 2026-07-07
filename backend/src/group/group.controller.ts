import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';

@ApiTags('Ajo Groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Ajo Group' })
  @ApiResponse({ status: 201, description: 'Group created with a Nomba Virtual Account' })
  createGroup(@Body() dto: CreateGroupDto) {
    return this.groupService.createGroup(dto);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join a group & assign Fastest-Finger slot' })
  joinGroup(@Param('id') groupId: string, @Body() dto: JoinGroupDto) {
    return this.groupService.joinGroup(groupId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active groups' })
  getAllGroups() {
    return this.groupService.getAllGroups();
  }
}