import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AppModule } from './app/app.module';
import { RedisIoAdapter } from './redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // allow the dashboard to connect

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Bind Kafka to implicitly receive 'incident.new'
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'notification-service-consumer',
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      }
    },
  });

  const port = process.env.PORT || 3003;
  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`Notification Service (WebSockets) listening on ws://localhost:${port}`);
}
bootstrap();
