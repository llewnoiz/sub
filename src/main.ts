import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { microserviceConfig } from './modules/sub/kafka-config';
import { initializeTransactionalContext } from 'typeorm-transactional';


async function bootstrap() {
  initializeTransactionalContext();
  const db = {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
  };

  console.log('db');
  console.log(db);

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(microserviceConfig);
  await app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
