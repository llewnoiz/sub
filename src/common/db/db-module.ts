import { Module } from '@nestjs/common';
import { databaseProviders } from './db-service';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}