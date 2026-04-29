import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppGateway } from './app.gateway';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appGateway: AppGateway) {}

  @EventPattern('incident.new')
  async handleNewIncident(@Payload() payload: any) {
    const incidentData = typeof payload === 'string' ? JSON.parse(payload) : payload;
    this.logger.log(`Received internal routing for Incident ${incidentData.id}. Broadcasting to Front-End UIs via WebSockets!`);
    
    // Broadcast instantly inside the socket room logic
    this.appGateway.broadcastIncident({
      id: incidentData.id,
      title: incidentData.title,
      message: incidentData.description,
      serviceName: incidentData.serviceName,
      level: incidentData.severity,
      timestamp: incidentData.createdAt
    });
  }

  @EventPattern('logs.ingested')
  async handleLiveLogStream(@Payload() payload: any) {
    const logData = typeof payload === 'string' ? JSON.parse(payload) : payload;
    this.appGateway.broadcastLog(logData);
  }
}
