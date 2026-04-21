import { Injectable, Logger } from '@nestjs/common';
import { LogMessageDto } from '@incident-iq/shared-types';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  analyzeLog(log: LogMessageDto): boolean {
    // Stub implementation: Just mark all 'ERROR' and 'CRITICAL' levels as an anomaly for now
    this.logger.debug(`Inspecting log from ${log.serviceName} - Level: ${log.level}`);
    
    if (log.level === 'ERROR') {
      this.logger.warn(`ANOMALY DETECTED! ${log.level} spike in ${log.serviceName}`);
      return true;
    }
    
    return false;
  }
}
