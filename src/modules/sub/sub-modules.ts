import { Module } from '@nestjs/common';
import { SubController } from './sub-controller';
import { DatabaseModule } from 'src/common/db/db-module';
import { UserProvider } from './user-providers';
import { SubService } from './sub-service';

@Module({
  imports: [DatabaseModule],
  controllers: [SubController],
  providers: [...UserProvider, SubService],
})
export class SubModule {}
