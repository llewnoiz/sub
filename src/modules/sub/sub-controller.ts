import {
  Body,
  Controller,
  Get,
  OnModuleInit,
  Post,
  Res,
  Response,
} from '@nestjs/common';
import {
  Client,
  ClientKafka,
  Ctx,
  EventPattern,
  MessagePattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { microserviceConfig } from './kafka-config';
import { SubService } from './sub-service';
import { CreateUserDTO } from './user-create-dto';
import { timeout } from 'rxjs';
@Controller('Sub')
export class SubController implements OnModuleInit {
  @Client(microserviceConfig)
  client: ClientKafka;

  constructor(private readonly subService: SubService) {}
  onModuleInit() {
    const requestPatterns = ['pub-entity-created'];

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
  }
  @Get()
  async getPub(@Res() res: any) {
    // 1  자체 db user 저장
    // 2. kafka 저장 완료 이벤트 전달
    // 3. 응답 확인
    const users = await this.subService.findAll();
    // 4. 오류시 db 저장 rollback
    const result = await this.client
      .send('pub-entity-created', 'date ' + new Date())
      .pipe(
        timeout(5000),
      )
      .subscribe({
        next(x) {
          console.log(x);
          res.status(200).json({
            code: 200,
            message: x,
          });
        },
        error(err) {
          console.error(err);
          result.unsubscribe();
          res.status(400).json({
            code: 400,
            message: err?.message,
          });
        },
        complete() {
          console.log('done');

          result.unsubscribe();
        },
      });

    console.log();
    return result;
  }

  @Post()
  async createPub(@Body() createUser: CreateUserDTO) {
    // 1  자체 db user 저장
    // 2. kafka 저장 완료 이벤트 전달
    // 3. 응답 확인

    // 4. 오류시 db 저장 rollback

    const users = await this.subService.created(createUser);
    const result = this.client.emit('pub-entity-created', {
      users,
      created: new Date(),
    });
    console.log('Sub Result');
    return result;
  }

  // @EventPattern('sub-entity-created')
  @MessagePattern('sub-entity-created')
  async handleEntityCreated(
    @Payload() data: any,
    @Ctx() context: KafkaContext,
  ) {
    const { offset, timestamp, key, value } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    console.log('data');
    console.log(data);
    console.log(
      `offset: ${offset}\ntimestamp :${timestamp}\n, key:${key}\n, value:${value}\n, partition: ${partition}\n, topic: ${topic}\n`,
    );

    // throw new Error('SUB ERROR');

    return { id: 'sub', data };
  }
}
