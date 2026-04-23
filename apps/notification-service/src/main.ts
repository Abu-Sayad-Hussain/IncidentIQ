import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { RedisIoAdapter } from './redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // allow the dashboard to connect

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  
  app.useWebSocketAdapter(redisIoAdapter);

  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`Notification Service (WebSockets) listening on ws://localhost:${port}`);
}
bootstrap();
