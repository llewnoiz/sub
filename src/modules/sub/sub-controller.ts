import { Body, Controller, Get, OnModuleInit, Post } from '@nestjs/common';
import {
  Client,
  ClientKafka,
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { microserviceConfig } from './kafka-config';
import { SubService } from './sub-service';
import { CreateUserDTO } from './user-create-dto';
@Controller('Sub')
export class SubController implements OnModuleInit {
  @Client(microserviceConfig)
  client: ClientKafka;

  constructor(private readonly subService: SubService) {}
  onModuleInit() {
    const requestPatterns = ['sub-entity-created'];

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
  }
  @Get()
  async getPub() {

    // 1  자체 db user 저장
    // 2. kafka 저장 완료 이벤트 전달
    // 3. 응답 확인

    // 4. 오류시 db 저장 rollback
    const result = await this.client.emit('pub-entity-created', 'date ' + new Date());    
    console.log('Sub Result');
    console.log(result);
    const users = await this.subService.findAll();
    // console.log(users);
    return result;
  }

  @Post()
  async createPub(@Body() createUser: CreateUserDTO) {

    // 1  자체 db user 저장
    // 2. kafka 저장 완료 이벤트 전달
    // 3. 응답 확인

    // 4. 오류시 db 저장 rollback

    const users = await this.subService.created(createUser);
    const result = await this.client.emit('pub-entity-created', { users });
    console.log('Sub Result');
    return result;
  }

  @EventPattern('sub-entity-created')
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
      `offset: ${offset}\ntimestamp :${timestamp}\n, key:${key}\n, value:${value}\n, partition: ${partition}\n, topic: ${topic}\n`
      );

    // throw new Error('SUB ERROR');

    return { id: 'sub', data };
  }
}
