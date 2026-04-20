import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ElasticClientModule } from '@incident-iq/elastic-client';

@Module({
  imports: [ElasticClientModule],
  controllers: [AppController],
})
export class AppModule {}
