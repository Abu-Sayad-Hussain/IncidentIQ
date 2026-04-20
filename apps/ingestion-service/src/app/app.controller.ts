import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { LogMessageDto } from '@incident-iq/shared-types';

@Controller('logs')
export class AppController {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
  ) {}

  @Post()
  async ingestLog(@Body() payload: LogMessageDto) {
    // Emit the log payload to the Kafka topic "logs.ingested"
    this.kafkaClient.emit('logs.ingested', JSON.stringify(payload));
    return { status: 'Ingested Successfully', timestamp: new Date().toISOString() };
  }
}
