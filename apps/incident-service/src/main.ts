import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Act as a Kafka Consumer
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'incident-service-consumer',
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      }
    },
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3004; // Distinct port
  
  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`Incident Service HTTP listening on http://localhost:${port}/${globalPrefix}`);
}
bootstrap();
