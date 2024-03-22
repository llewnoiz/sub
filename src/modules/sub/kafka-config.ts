import { KafkaOptions, Transport } from '@nestjs/microservices';

export const microserviceConfig: KafkaOptions = {
  transport: Transport.KAFKA,

  options: {
    client: {
      brokers: ['ws01.amanocloud.co.kr:9092'],
    },
    consumer: {
      groupId: 'sub-entity-created',
      allowAutoTopicCreation: true,
    },
    producer: {
      allowAutoTopicCreation: true,
    }
  },
};
