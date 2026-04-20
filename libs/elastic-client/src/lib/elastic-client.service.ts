import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { LogMessageDto } from '@incident-iq/shared-types';

@Injectable()
export class ElasticClientService implements OnModuleInit {
  private readonly logger = new Logger(ElasticClientService.name);
  private readonly INDEX_NAME = 'incident-iq-logs';

  constructor(private readonly esService: ElasticsearchService) {}

  async onModuleInit() {
    await this.initializeIndex();
  }

  private async initializeIndex() {
    try {
      const indexExists = await this.esService.indices.exists({ index: this.INDEX_NAME });
      
      if (!indexExists) {
        await this.esService.indices.create({
          index: this.INDEX_NAME,
          mappings: {
            properties: {
              serviceName: { type: 'keyword' },
              level: { type: 'keyword' },
              message: { type: 'text' },
              timestamp: { type: 'date' },
              meta: { type: 'object' },
            },
          },
        });
        this.logger.log(`Created Elasticsearch index: ${this.INDEX_NAME}`);
      } else {
        this.logger.log(`Elasticsearch index ${this.INDEX_NAME} already exists`);
      }
    } catch (error) {
      this.logger.error('Failed to initialize Elasticsearch index', error);
    }
  }

  async indexLog(log: LogMessageDto) {
    return this.esService.index({
      index: this.INDEX_NAME,
      document: log,
    });
  }

  async searchLogs(query: string, limit: number = 50) {
    return this.esService.search({
      index: this.INDEX_NAME,
      size: limit,
      query: {
        multi_match: {
          query,
          fields: ['message', 'serviceName', 'level'],
        },
      },
      sort: [{ timestamp: { order: 'desc' as const } }],
    });
  }
}
