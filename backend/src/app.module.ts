import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { User } from './entities/user.entity';
import { AjoGroup } from './entities/ajo-group.entity';
import { GroupMember } from './entities/group-member.entity';
import { Transaction } from './entities/transaction.entity';

// Feature Modules
import { WebhookModule } from './webhook/webhook.module';
import { GroupModule } from './group/group.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'), 
        entities: [User, AjoGroup, GroupMember, Transaction],
        synchronize: true, // Keep this true for the hackathon so tables auto-update
      }),
    }),
    AuthModule,
    GroupModule,
    WebhookModule,
  ],
  controllers: [], 
  providers: [],  
})
export class AppModule {}