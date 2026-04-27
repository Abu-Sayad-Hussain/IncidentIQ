import { Controller, Logger, Inject } from '@nestjs/common';
import { EventPattern, Payload, ClientKafka } from '@nestjs/microservices';
import { LogMessageDto } from '@incident-iq/shared-types';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
  ) {}

  @EventPattern('logs.ingested')
  async handleLogIngestion(@Payload() message: any) {
    const payload: LogMessageDto = typeof message === 'string' ? JSON.parse(message) : message;
    
    // Pass payload through the anomaly detection stub
    const isAnomaly = this.appService.analyzeLog(payload);
    
    if (isAnomaly) {
      this.logger.error(`Emitting Anomaly Signal to Mesh for: ${payload.serviceName}`);
      this.kafkaClient.emit('anomalies.detected', payload);
    }
  }
}
