import { Controller, Post, Body, Param, Get, Delete, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express'; // Required for handling the CSV file download
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { NombaVirtualAccountService } from '../nomba/nomba-virtual-account.service';

@ApiTags('Ajo Groups')
@Controller('groups')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly nombaVirtualAccountService: NombaVirtualAccountService,
  ) {}

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

  // =========================================================================
  // NEW: INFRASTRUCTURE TRACK ENDPOINTS (Account Expiry, Requery, CSV)
  // =========================================================================

  @Delete(':id/virtual-account')
  @ApiOperation({ summary: 'Close a group and expire its Nomba Virtual Account' })
  @ApiResponse({ status: 200, description: 'Virtual Account expired and group closed successfully' })
  closeVirtualAccount(@Param('id') id: string) {
    return this.groupService.closeGroup(id);
  }

  @Get(':id/reconcile')
  @ApiOperation({ summary: 'Manually requery Nomba API to reconcile missed webhook inflows' })
  @ApiResponse({ status: 200, description: 'Transactions successfully reconciled' })
  async reconcileTransactions(@Param('id') id: string) {
    // 1. Fetch group to ensure it exists
    const group = await this.groupService.findById(id);
    
    // 2. Fetch live transactions directly from Nomba's ledger
    const liveTransactions = await this.nombaVirtualAccountService.reconcileAccountInflows();
    
    return {
      message: 'Reconciliation query successful',
      groupId: group.id,
      nombaData: liveTransactions,
    };
  }

  @Get(':id/statement')
  @ApiOperation({ summary: 'Download Group Ledger Statement as CSV' })
  @ApiResponse({ status: 200, description: 'CSV File Download Triggered' })
  async downloadStatement(@Param('id') id: string, @Res() res: Response) {
    // 1. Generate the raw CSV string from the database
    const csvData = await this.groupService.generateGroupStatementCsv(id);

    // 2. Set Express headers to force file download on the client side
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="ajo-statement-${id}.csv"`);
    
    // 3. Send the raw CSV string
    res.status(HttpStatus.OK).send(csvData);
  }
}