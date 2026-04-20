import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { LogMessageDto } from '@incident-iq/shared-types';
import { ElasticClientService } from '@incident-iq/elastic-client';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly elasticService: ElasticClientService) {}

  @EventPattern('logs.ingested')
  async handleLogIngestion(@Payload() message: any) {
    const payload: LogMessageDto = typeof message === 'string' ? JSON.parse(message) : message;
    
    this.logger.log(`Received log from Kafka for service: ${payload.serviceName}`);
    
    try {
      await this.elasticService.indexLog(payload);
      this.logger.log(`Successfully mapped payload into Elasticsearch.`);
    } catch (err) {
      this.logger.error('Failed to map payload to Elastic', err);
    }
  }
}
