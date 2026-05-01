import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  broadcastIncident(incidentData: any) {
    this.server.emit('incident.new', incidentData);
  }

  broadcastIncidentUpdate(incidentData: any) {
    this.server.emit('incident.updated', incidentData);
  }

  broadcastLog(logData: any) {
    this.server.emit('log.new', logData);
  }
}
