import { Controller, Logger, Inject, Get, Patch, Param, Body } from '@nestjs/common';
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

    const incident = this.incidentRepo.create({
      title: 'Automated AI Incident generated',
      description: payload.message,
      serviceName: payload.serviceName,
      status: IncidentStatus.OPEN,
      severity: payload.level === 'ERROR' ? IncidentSeverity.CRITICAL : IncidentSeverity.HIGH,
      metadata: { originalLog: payload },
    });

    const savedIncident = await this.incidentRepo.save(incident);
    this.logger.log(`Successfully persists Incident [${savedIncident.id}] into Postgres!`);
    this.kafkaClient.emit('incident.new', savedIncident);
  }

  @Get('incidents')
  async getActiveIncidents() {
    return this.incidentRepo.find({
      where: [
        { status: IncidentStatus.OPEN },
        { status: IncidentStatus.IN_PROGRESS }
      ],
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  @Patch('incidents/:id')
  async updateIncident(@Param('id') id: string, @Body() updateData: Partial<Incident>) {
    const incident = await this.incidentRepo.findOne({ where: { id } });
    if (!incident) {
      return null; // For simplicity in this demo, return null if not found
    }

    if (updateData.status) incident.status = updateData.status;
    if (updateData.assignedTo !== undefined) incident.assignedTo = updateData.assignedTo;

    const updatedIncident = await this.incidentRepo.save(incident);
    
    // Broadcast the update into the Event Mesh
    this.logger.log(`Incident ${id} updated, broadcasting event...`);
    this.kafkaClient.emit('incident.updated', updatedIncident);

    return updatedIncident;
  }
}
