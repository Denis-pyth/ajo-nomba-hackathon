import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true, // Automatically loads any entity you create
      synchronize: true,      // Auto-generates your database tables
    }),
    WebhookModule,
  ],
})
export class AppModule {}