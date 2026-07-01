import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AjoGroup } from './entities/ajo-group.entity';
import { GroupMember } from './entities/group-member.entity';
import { Transaction } from './entities/transaction.entity';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    // 1. Load Environment Variables Globally
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    // 2. Configure TypeORM with PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'), // Pulls from your .env
        entities: [User, AjoGroup, GroupMember, Transaction],
        synchronize: true, // Auto-generates your tables!
      }),
    }),

    // 3. Register your Feature Modules
    WebhookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}