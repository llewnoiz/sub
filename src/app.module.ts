import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubModule } from './modules/sub/sub-modules';
import { DatabaseModule } from './common/db/db-module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SubModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [`${process.cwd()}/env/.env.local`],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
