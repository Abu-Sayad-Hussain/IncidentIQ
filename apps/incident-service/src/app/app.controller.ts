import { Controller, Logger, Inject } from '@nestjs/common';
import { EventPattern, Payload, ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogMessageDto } from '@incident-iq/shared-types';
import { Incident, IncidentSeverity, IncidentStatus } from './incident.entity';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    @InjectRepository(Incident) private readonly incidentRepo: Repository<Incident>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
  ) {}

  @EventPattern('anomalies.detected')
  async handleAnomalyDetection(@Payload() message: any) {
    const payload: LogMessageDto = typeof message === 'string' ? JSON.parse(message) : message;
    
    this.logger.log(`Incident Generation Triggered by Anomaly in ${payload.serviceName}`);

    // Map log payload to Incident Database Schema
    const incident = this.incidentRepo.create({
      title: 'Automated AI Incident generated',
      description: payload.message,
      serviceName: payload.serviceName,
      status: IncidentStatus.OPEN,
      severity: payload.level === 'CRITICAL' ? IncidentSeverity.CRITICAL : IncidentSeverity.HIGH,
      metadata: { originalLog: payload },
    });

    // Save to PostgreSQL strictly
    const savedIncident = await this.incidentRepo.save(incident);
    this.logger.log(`Successfully persists Incident [${savedIncident.id}] into Postgres!`);

    // Emit live incident socket hook to Notification Event Mesh wrapper
    this.kafkaClient.emit('incident.new', savedIncident);
  }
}
