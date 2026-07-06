import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NombaAuthService } from './nomba-auth.service';
import { NombaVirtualAccountService } from './nomba-virtual-account.service';
import { NombaTransferService } from './nomba-transfer.service';

@Module({
  imports: [ConfigModule], // Required so the services can access process.env variables
  providers: [
    NombaAuthService,
    NombaVirtualAccountService,
    NombaTransferService,
  ],
  exports: [
    // Exporting these makes them available to any module that imports NombaModule
    NombaAuthService,
    NombaVirtualAccountService,
    NombaTransferService,
  ],
})
export class NombaModule {}